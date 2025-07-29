import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-favorites-card',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './favorites-card.component.html',
  styleUrl: './favorites-card.component.css',
})
export class FavoritesCardComponent {
  @Input() item: any;
  @Input() type: 'favorites' | 'watchlist' | 'ratings' = 'favorites';

  @Output() rated = new EventEmitter<{item: any; rating:number}>();
  @Output() favoriteChanged = new EventEmitter<any>();
  @Output() watchlistChanged = new EventEmitter<any>();
  @Output() removed = new EventEmitter<any>();
  @Output() openRatingModal = new EventEmitter<any>();

  


  get title(): string {
    return this.item?.title || this.item?.name || '';
  }

  get releaseDate(): string {
    return this.item?.release_date || this.item?.first_air_date || '';
  }

  get poster(): any {
    return this.item?.poster_path
      ? `https://image.tmdb.org/t/p/w185${this.item.poster_path}`
      : 'https://via.placeholder.com/185x278?text=Image+Unavailable';
  }

  get overview(): string {
    return this.item?.overview || '';
  }

  get rating(): number | null {
    return this.item?.rated?.value ?? null;
  }

  rate(newRating: number) {
    if(!this.item) return;
    this.rated.emit({item: this.item, rating: newRating});
  }

  toggleFavorite() {
    if(!this.item) return;
    this.favoriteChanged.emit(this.item);
  }

  toggleWatchlist() {
    if(!this.item) return;
    this.watchlistChanged.emit(this.item);

  }

  remove() {
    if(!this.item) return;
    this.removed.emit(this.item);
  }

openRatingModalHandler() {
  this.openRatingModal.emit(this.item);
}
}
