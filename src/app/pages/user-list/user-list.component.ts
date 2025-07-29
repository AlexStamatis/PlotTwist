import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FavoritesCardComponent } from '../../shared/layout/favorites-card/favorites-card.component';
import { StarRatingModalComponent } from "../../shared/star-rating-modal/star-rating-modal.component";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FavoritesCardComponent, StarRatingModalComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  listType = signal<'favorites' | 'watchlist' | 'ratings'>('favorites');
  title = signal<string>('');
  results = signal<any[]>([]);
  ratingModal = signal<any | null>(null);

  constructor(
    private tmdbService: TmdbService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const type = params.get('type') as 'favorites' | 'watchlist' | 'ratings';
      const username = params.get('username');

      if (!username || !type) return;

      this.listType.set(type);
      this.title.set(`My ${type.charAt(0).toUpperCase() + type.slice(1)}`);

      const sessionId = localStorage.getItem('session_id');
      const accountId = localStorage.getItem('user_id');

      if (!sessionId || !accountId) return;

      const fetchResBasedOnType = {
        favorites: this.tmdbService.getFavorites.bind(this.tmdbService),
        watchlist: this.tmdbService.getUserWatchlist.bind(this.tmdbService),
        ratings: this.tmdbService.getUserRatings.bind(this.tmdbService),
      }[type];

      forkJoin([
        fetchResBasedOnType(accountId, sessionId, 'movie'),
        fetchResBasedOnType(accountId, sessionId, 'tv'),
      ]).subscribe(([movies, tvShows]: any[]) => {
        const combined = [
          ...(movies.results || []).map((item:any) => {
            const ratedValue = item.rating ? { value: item.rating} : null;
            return {...item, media_type: 'movie', rated: ratedValue};
          }),
          ...(tvShows.results || []).map((item:any) =>{
            const ratedValue = item.rating ? {value: item.rating} : null;
            return {...item, media_type : 'tv', rated: ratedValue};
          }),
        ];
        this.results.set(combined);
      });
    });
  }

  onRate(event: { item: any; rating: number }) {
    const { item, rating } = event;
    const sessionId = this.authService.getSessionId();

    if (!sessionId) return;

    const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
    item.rated = { value: rating };

    this.tmdbService
      .rate(mediaType, item.id, rating, sessionId)
      .subscribe(() => {});
  }

  onToggleFavorite(item: any) {
    const sessionId = this.authService.getSessionId();
    const accountId = this.authService.getAccountId();
    const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
    const isFavorite = !item.favorite;

    if (!sessionId || !accountId) return;

    this.tmdbService
      .toggleFavorite(mediaType, accountId, item.id, isFavorite, sessionId)
      .subscribe(() => {
        item.favorite = isFavorite;
      });
  }

  onToggleWatchlist(item: any) {
    const sessionId = this.authService.getSessionId();
    const accountId = this.authService.getAccountId();
    const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
    const isWatchlisted = !item.watchlist;

    if (!sessionId || !accountId) return;

    this.tmdbService
      .toggleWatchlist(mediaType, accountId, item.id, isWatchlisted, sessionId)
      .subscribe(() => {
        item.watchlist = isWatchlisted;
      });
  }

  removeLocally(itemForRemove: any) {
    const current = this.results();
    const updated = current.filter((item) => item.id !== itemForRemove.id);
    this.results.set(updated);
  }

  onRemove(item: any) {
    const sessionId = this.authService.getSessionId();
    const accountId = this.authService.getAccountId();
    const mediaType = item.media_type || (item.title ? 'movie' : 'tv');

    if (!sessionId || !accountId) return;

    switch(this.listType()) {
      case 'favorites': this.tmdbService.toggleFavorite(mediaType, accountId, item.id, false, sessionId).subscribe(() => this.removeLocally(item));
      break;

      case 'watchlist': this.tmdbService.toggleWatchlist(mediaType, accountId, item.id, false, sessionId).subscribe(() => this.removeLocally(item));
      break;
      
      case 'ratings': this.tmdbService.removeRating(mediaType, item.id , sessionId).subscribe(() => this.removeLocally(item));
      break;

  
    }
    console.log('Removing from ratings:', item);

  }

  openRatingModal(item:any) {
    this.ratingModal.set(item);
  }
}
