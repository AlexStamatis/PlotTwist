import { Component, inject, signal } from '@angular/core';
import { ToggleButtonComponent } from '../../shared/layout/toggle-button/toggle-button.component';
import { TmdbService } from '../../shared/services/tmdb.service';
import { MovieCardComponent } from '../../shared/layout/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { TrailerCardComponent } from '../../shared/layout/trailer-card/trailer-card.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchResultsComponent } from '../../shared/layout/search-results/search-results.component';
export interface ButtonOptions {
  btnName: string;
  isActive: boolean;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    ToggleButtonComponent,
    MovieCardComponent,
    TrailerCardComponent,
    FormsModule,
    SearchResultsComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  
  mediaType = signal<'movies' | 'tv'>('movies');
  mediaTypeTrailers = signal<'movies' | 'tv' | 'Released This Week'>('movies');
  mediaTypeRecommended = signal<'movies' | 'tv'>('movies');

  tvTrailers = signal<any[]>([]);
  movieTrailers = signal<any[]>([]);
  trendingItems = signal<any[]>([]);
  recommendedItems = signal<any[]>([]);

  searchQuery = signal('');
  searchTriggered = signal(false);
  queryParams = signal<Params>({});

  movieId = 27205;
  tvId = 1396;

  get hasQuery(): boolean {
    return !!this.queryParams()?.['query']?.trim();
  }


  constructor(private tmdbService: TmdbService, private router:Router) {
    
    this.getTrendingItems();
    this.onLoadMovieTrailers();
    this.getRecommendedItems(this.movieId, this.tvId);
  }

  performSearch() {
    const q = this.searchQuery().trim();

    if (q) {
      this.router.navigate(['/search'], {
        queryParams: { query: q }
      });
    }
      }

  clearSearch() {
    this.searchQuery.set('');
    this.searchTriggered.set(false);
  }

  getTrendingItems() {
    if (this.mediaType() === 'movies') {
      this.tmdbService.getTrendingMovies().subscribe((res: any) => {
        this.trendingItems.set(res.results);
      });
    } else {
      this.tmdbService.getTrendingTv().subscribe((res: any) => {
        this.trendingItems.set(res.results);
      });
    }
  }

  onToggleChange(option: string) {
    this.mediaType.set(option === 'Movies' ? 'movies' : 'tv');
    this.getTrendingItems();
  }

  getRecommendedItems(movieId: number, tvId: number) {
    if (this.mediaTypeRecommended() === 'movies') {
      this.tmdbService.getRecommendedMovies(movieId).subscribe((res: any) => {
        this.recommendedItems.set(res.results);
      });
    } else {
      this.tmdbService.getRecommendedTvShows(tvId).subscribe((res: any) => {
        this.recommendedItems.set(res.results);
      });
    }
  }

  onToggleChangeRecommended(option: string) {
    this.mediaTypeRecommended.set(option === 'Movies' ? 'movies' : 'tv');
    this.getRecommendedItems(this.movieId, this.tvId);
  }

  onLoadTvTrailers() {
    this.tvTrailers.set([]);

    this.tmdbService.getTrendingTv().subscribe((res: any) => {
      res.results.slice(0, 10).forEach((tv: any) => {
        this.tmdbService.getTrendingTvVideos(tv.id).subscribe((vid: any) => {
          const trailer = vid.results.find(
            (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
          );
          if (trailer) {
            this.tvTrailers.update((trailers) => [
              ...trailers,
              {
                id: `${tv.id}-${trailer.key}`,
                key: trailer.key,
                title: tv.name,
              },
            ]);
          }
        });
      });
    });
  }

  onLoadMovieTrailers() {
    this.movieTrailers.set([]);

    this.tmdbService.getTrendingMovies().subscribe((res: any) => {
      res.results.slice(0, 10).forEach((movie: any) => {
        this.tmdbService
          .getTrendingMovieVideos(movie.id)
          .subscribe((videos: any) => {
            const trailer = videos.results.find(
              (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube'
            );
            if (trailer) {
              this.movieTrailers.update((movies: any) => [
                ...movies,
                {
                  id: `${movie.id}-${trailer.key}`,
                  key: trailer.key,
                  title: movie.title,
                },
              ]);
            }
          });
      });
    });
  }

  onLoadThisWeeksTrailers() {
    this.movieTrailers.set([]);
    this.tvTrailers.set([]);

    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    const fromDate = lastWeek.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];

    this.tmdbService
      .getReleasedThisWeekMovies(fromDate, toDate)
      .subscribe((res: any) => {
        res.results.forEach((movies: any) => {
          this.tmdbService
            .getTrendingMovieVideos(movies.id)
            .subscribe((videos: any) => {
              const trailer = videos.results.find(
                (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube'
              );
              if (trailer) {
                this.movieTrailers.update((trailers: any) => [
                  ...trailers,
                  {
                    id: `${movies.id}-${trailer.key}`,
                    key: trailer.key,
                    title: movies.title,
                    poster: movies.poster_path,
                  },
                ]);
              }
            });
        });
      });

    this.tmdbService
      .getReleasedThisWeekSeries(fromDate, toDate)
      .subscribe((res: any) => {
        res.results.forEach((series: any) => {
          this.tmdbService
            .getTrendingTvVideos(series.id)
            .subscribe((videos: any) => {
              const trailer = videos.results.find(
                (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube'
              );
              if (trailer) {
                this.tvTrailers.update((trailers: any) => [
                  ...trailers,
                  {
                    id: `${series.id}-${trailer.key}`,
                    key: trailer.key,
                    title: series.name,
                    poster: series.poster_path,
                  },
                ]);
              }
            });
        });
      });
  }

  onToggleChangeTrailers(option: string) {
    this.mediaTypeTrailers.set(option === 'Movies' ? 'movies' : 'tv');

    if (option === 'Movies') {
      this.onLoadMovieTrailers();
    } else if (option === 'TV') {
      this.onLoadTvTrailers();
    } else if (option === 'Released This Week') {
      this.onLoadThisWeeksTrailers();
    }
  }

  buttonOptions: ButtonOptions[] = [
    { btnName: 'Movies', isActive: true },
    { btnName: 'TV', isActive: false },
  ];

  buttonOptionsTrailers: ButtonOptions[] = [
    { btnName: 'Movies', isActive: true },
    { btnName: 'TV', isActive: false },
    { btnName: 'Released This Week', isActive: false },
  ];

  buttonOptionsRecommendations: ButtonOptions[] = [
    { btnName: 'Movies', isActive: true },
    { btnName: 'Tv-shows', isActive: false },
  ];
}
