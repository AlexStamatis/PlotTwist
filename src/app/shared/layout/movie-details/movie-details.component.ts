import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { MovieDetails } from '../../models/movie.model';
import { CastCardComponent } from '../cast-card/cast-card.component';
import { NgbRating} from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from "../spinner/spinner.component";

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule, CastCardComponent, NgbRating, SpinnerComponent],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent {
  mediaType = signal<'movie' | 'tv'>('movie');
  id = signal<number | null>(null);
  details = signal<MovieDetails | null>(null);
  crew = signal<any[]>([]);
  cast = signal<any[]>([]);
  isFavourite = signal<boolean>(false);
  isWatchlisted = signal<boolean>(false);
  userRating = signal<number | null>(null);
  starRating = signal<number>(0);
  loading = signal(true);

  ngOnInit() {
  this.loadUserActions();
}

setInitialRating(userRating: number) {
  this.starRating.set(userRating);
}

  loadUserActions() {
    const accountId = localStorage.getItem('user_id')
    const sessionId = localStorage.getItem('session_id');
    const movieId = this.id();

    if(!accountId || !sessionId || !movieId) return;

    this.tmdbService.getFavorites(accountId, sessionId, this.mediaType()).subscribe((res:any) => {
        const found = res.results.find((m:any) => m.id === movieId);
        this.isFavourite.set(!!found);
    });

    this.tmdbService.getUserWatchlist(accountId, sessionId,this.mediaType()).subscribe((res:any) => {
      const found = res.results.find((m:any) => m.id === movieId);
      this.isWatchlisted.set(!!found);
    });

    this.tmdbService.getUserRatings(accountId, sessionId,this.mediaType()).subscribe((res:any) => {
      const found = res.results.find((m:any) => m.id === movieId);
      console.log('Found rating:', found);
      if(found) {
        this.starRating.set(found.rating);
        this.userRating.set(found.rating);
        this.setInitialRating(found.rating);
      }
    });
  }

  toggleFavorite() {
    const accountId = localStorage.getItem('user_id')
    const sessionId = localStorage.getItem('session_id');
    const id = this.id();
    const media = this.mediaType();

    if(!accountId || !sessionId || !id) return;

    const newStatus = !this.isFavourite();  //flip current state (for example from true to false)
    this.tmdbService.markAsFavorite(accountId, sessionId,  {
      media_type: media,
      media_id: id,
      favorite: newStatus,
    }).subscribe(() => {
      this.isFavourite.set(newStatus);
    })
  }

  toggleWatchlist() {
    const accountId = localStorage.getItem('user_id')
    const sessionId = localStorage.getItem('session_id');
    const id = this.id();
    const media = this.mediaType();

    console.log('Toggle Watchlist:', { accountId, sessionId, id, media });
    if(!accountId || !sessionId || !id) return;

    const newStatus = !this.isWatchlisted();
    this.tmdbService.addToWatchlist(accountId, sessionId, {
      media_type: media,
      media_id: id,
      watchlist: newStatus,
    }).subscribe(() => {
      this.isWatchlisted.set(newStatus);
    })
  }

  movieRate(rating: number) {
    const sessionId = localStorage.getItem('session_id');
    const id = this.id();
    const media = this.mediaType();

    if(!sessionId || !id) return;

      this.tmdbService.rateMovieorSeries(media, id, sessionId, rating).subscribe(() => {
        this.userRating.set(rating);
        this.starRating.set(rating);
        
      });
    
  }

  genres = computed(() => {
    const value = this.details();
    return value?.genres?.map((g) => g.name).join(', ') || '';
  });

  groupCrewByPerson = computed(() => {
    const grouped = new Map<
      number,
      { id: number; name: string; roles: string[] }
    >();
    const importantJobs = [
      'Director',
      'Screenplay',
      'Writer',
      'Story',
      'Creator',
      'Writing',
      'Directing',
    ];

    for (const person of this.crew()) {
      if (!importantJobs.includes(person.job)) continue;
      const crewMember = grouped.get(person.id);

      if (crewMember) {
        if (!crewMember.roles.includes(person.job)) {
          crewMember.roles.push(person.job);
        }
      } else {
        grouped.set(person.id, {
          id: person.id,
          name: person.name,
          roles: [person.job],
        });
      }
    }
    return Array.from(grouped.values());
  });

  constructor(private route: ActivatedRoute, private tmdbService: TmdbService) {
    const type = this.route.snapshot.routeConfig?.path?.startsWith('tv')
      ? 'tv'
      : 'movie';
    const idParam = this.route.snapshot.paramMap.get('id');

    this.mediaType.set(type);
    this.id.set(idParam ? +idParam : null);

    effect(() => {
      const id = this.id();
      const media = this.mediaType();

      if (id && media) {
        this.loading.set(true);
        this.tmdbService.getMovieDetails(media, id).subscribe((res) => {
          this.details.set(res);

          let combinedCrew: any[] = [];

          if (media === 'tv' && res.created_by?.length) {
            const creators = res.created_by.map((creator: any) => ({
              ...creator,
              job: 'Creator',
            }));

            combinedCrew = [...combinedCrew, ...creators];
          }

          this.tmdbService.getCredits(media, id).subscribe((res) => {
            if (res.crew?.length) {
              combinedCrew = [...combinedCrew, ...res.crew];
            }
            this.crew.set(combinedCrew);
            if (res.cast?.length) {
              this.cast.set(res.cast);
            }
            this.loading.set(false);
          });
        });
      }
    });
  }
}
