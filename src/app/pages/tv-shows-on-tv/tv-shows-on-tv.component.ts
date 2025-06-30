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
import { SpinnerComponent } from '../../shared/layout/spinner/spinner.component';

@Component({
  selector: 'app-tv-shows-on-tv',
  standalone: true,
  imports: [FiltersComponent, MovieCardComponent, SpinnerComponent],
  templateUrl: './tv-shows-on-tv.component.html',
  styleUrl: './tv-shows-on-tv.component.css',
})
export class TvShowsOnTvComponent {
  showsOnTv = signal<any[]>([]);
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
    this.onLoadSeries();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (this.router.url === '/tv/on-tv') {
          this.sortOptionPicked.set(null);
          this.genreOptionPicked.set([]);
          this.currentPage.set(1);
          this.showsOnTv.set([]);
          this.resetFilters();
          this.onLoadSeries();
        }
      });
  }
  onLoadSeries(minCount = 20) {
    this.loading.set(true);
    let page = this.currentPage();
    const sort = this.sortOptionPicked();
    const genreIds = this.genreOptionPicked();

    if (page === 1) {
      this.showsOnTv.set([]);
    }

    const loadNext = () => {
      const fetchShows = sort || genreIds.length > 0
        ? this.tmdbService.getSortedOnTvShows(sort ?? '', page, genreIds)
        : this.tmdbService.getTvShowsOnTv(page);

      fetchShows.subscribe({
        next: (res: TvShowResponse) => {
          this.totalPages.set(res.total_pages);

          const filtered = res.results.filter((show) => {
            const year = show.first_air_date
              ? parseInt(show.first_air_date.substring(0, 4))
              : 0;
            const validYear = year >= 2024 && year <= 2026;
            return !!show.poster_path && show.vote_average > 0 && validYear;
          });

          this.showsOnTv.update((existing) => {
            const existingIds = new Set(existing.map((item) => item.id));
            const newItems = filtered.filter(
              (item) => !existingIds.has(item.id)
            );
            return [...existing, ...newItems];
          });

          const currentCount = this.showsOnTv().length;

          if (currentCount < minCount && page < res.total_pages) {
            page++;
            this.currentPage.set(page);
            loadNext();
          } else {
            this.currentPage.set(page);
            this.loading.set(false);
          }
        },
        error: (err) => {
          console.error('Failed to load On TV Shows:', err);
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
    this.showsOnTv.set([]);
    this.onLoadSeries();
  }

  onLoadNextPages() {
    if (this.currentPage() < this.totalPages()) {
      const previousCount = this.showsOnTv().length;
      this.onLoadSeries(previousCount + 20);
    }
  }
}
