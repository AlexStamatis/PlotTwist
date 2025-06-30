import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { FiltersComponent } from '../../shared/layout/filters/filters.component';
import { MovieCardComponent } from '../../shared/layout/movie-card/movie-card.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import {
  CombinedFiltersSelection,
  TvShowResponse,
} from '../../shared/models/movie.model';

@Component({
  selector: 'app-tv-shows-top-rated',
  standalone: true,
  imports: [FiltersComponent, MovieCardComponent],
  templateUrl: './tv-shows-top-rated.component.html',
  styleUrl: './tv-shows-top-rated.component.css',
})
export class TvShowsTopRatedComponent {
  topRatedTvShows = signal<any[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  sortOptionPicked = signal<string | null>(null);
  genreOptionPicked = signal<number[]>([]);
  loading = signal(false);
  resetFilter = signal(0);

  resetFilters() {
    this.resetFilter.update((v) => v + 1);
  }

  constructor(private tmdbService: TmdbService, private router: Router) {
    this.onLoadTvSeries();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))

      .subscribe(() => {
        if (this.router.url === '/tv/top-rated') {
          this.sortOptionPicked.set(null);
          this.genreOptionPicked.set([]);
          this.currentPage.set(1);
          this.topRatedTvShows.set([]);
          this.resetFilters();
          this.onLoadTvSeries();
        }
      });
  }
  onLoadTvSeries(minCount = 20) {
    this.loading.set(true);
    let page = this.currentPage();
    const sort = this.sortOptionPicked();
    const genreIds = this.genreOptionPicked();

    if (page === 1) {
      this.topRatedTvShows.set([]);
    }

    const loadNext = () => {
      const fetchShows = sort || genreIds.length > 0
        ? this.tmdbService.getSortedTopRatedTvShows(sort ?? '', page, genreIds)
        : this.tmdbService.getTvShowsTopRated(page);

      fetchShows.subscribe({
        next: (res: TvShowResponse) => {
          this.totalPages.set(res.total_pages);

          const filtered = res.results.filter((show) => {
            const year = show.first_air_date
              ? parseInt(show.first_air_date.substring(0, 4))
              : 0;
            const validYear =
              year >= 1930 && year <= new Date().getFullYear() + 1;
            return !!show.poster_path && show.vote_average > 0 && validYear;
          });

          this.topRatedTvShows.update((existing) => {
            const existingIds = new Set(existing.map((item) => item.id));
            const newItems = filtered.filter(
              (item) => !existingIds.has(item.id)
            );
            return [...existing, ...newItems];
          });

          const currentCount = this.topRatedTvShows().length;
          if (currentCount < minCount && page < res.total_pages) {
            page++;
            this.currentPage.set(page);
            loadNext(); // recursive
          } else {
            this.currentPage.set(page);
            this.loading.set(false);
          }
        },
        error: (err) => {
          console.error('Failed to load Top Rated TV Shows:', err);
          this.loading.set(false);
        },
      });
    };
    loadNext();
  }

  onSearchFromFilters(event: CombinedFiltersSelection) {
    const sort = event.sort?.trim() || null;
    const genres = event.genreIds ?? [];
    this.sortOptionPicked.set(sort);
    this.genreOptionPicked.set(genres);
    this.currentPage.set(1);
    this.topRatedTvShows.set([]);
    this.onLoadTvSeries();
  }
  onLoadNextPages() {
    if (this.currentPage() < this.totalPages()) {
      const previousCount = this.topRatedTvShows().length;
      this.onLoadTvSeries(previousCount + 20);
    }
  }
}
