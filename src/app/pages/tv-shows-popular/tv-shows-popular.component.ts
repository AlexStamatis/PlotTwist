import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { MovieCardComponent } from '../../shared/layout/movie-card/movie-card.component';
import { FiltersComponent } from '../../shared/layout/filters/filters.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CombinedFiltersSelection, TvShowResponse } from '../../shared/models/movie.model';
import { SpinnerComponent } from '../../shared/layout/spinner/spinner.component';

@Component({
  selector: 'app-tv-shows-popular',
  standalone: true,
  imports: [MovieCardComponent, FiltersComponent, SpinnerComponent],
  templateUrl: './tv-shows-popular.component.html',
  styleUrl: './tv-shows-popular.component.css',
})
export class TvShowsPopularComponent {
  popularTvShows = signal<any[]>([]);
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
        if (this.router.url === '/tv') {
          this.sortOptionPicked.set(null);
          this.genreOptionPicked.set([]);
          this.currentPage.set(1);
          this.popularTvShows.set([]);
          this.resetFilters();
          this.onLoadSeries();
        }
      });
  }
  onLoadSeries() {
    this.loading.set(true);
    const page = this.currentPage();
    const sort = this.sortOptionPicked();
    const genreIds = this.genreOptionPicked();
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const fetchSeries = sort || genreIds.length > 0
      ? this.tmdbService.getSortedPopularTvShows(sort ?? '', page, genreIds)
      : this.tmdbService.getPopularTvShows(page);

    fetchSeries.subscribe({
      next: (res: TvShowResponse) => {
        this.totalPages.set(res.total_pages);

        let filtered = res.results.filter((series) => {
          const year = series.first_air_date
            ? parseInt(series.first_air_date.substring(0, 4))
            : 0;

          const validYear =
            sort === 'first_air_date.asc'
              ? year > 0
              : year >= 1920 && year <= nextYear;

          return !!series.poster_path && series.vote_average > 0 && validYear;
        });
        if (sort === 'first_air_date.asc') {
          filtered.sort(
            (a, b) =>
              a.first_air_date.localeCompare(b.first_air_date ?? '') ?? 0
          );
        } else if (sort === 'first_air_date.desc') {
          filtered.sort(
            (a, b) =>
              b.first_air_date.localeCompare(a.first_air_date ?? '') ?? 0
          );
        }

        if (page === 1) {
          this.popularTvShows.set(filtered);
        } else {
          this.popularTvShows.update((existing) => {
            const existingIds = new Set(existing.map((item) => item.id));
            const newItems = filtered.filter(
              (item) => !existingIds.has(item.id)
            );
            return [...existing, ...newItems];
          });
        }

        this.currentPage.set(page);
      },
      error: (err) => {
        console.error('Problem in loading Tv Shows', err);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
  onSearchFromFilters(event: CombinedFiltersSelection) {
    const sort = event.sort?.trim() || null;
    const genres = event.genreIds ?? [];
    this.sortOptionPicked.set(sort);
    this.genreOptionPicked.set(genres);
    this.currentPage.set(1);
    this.popularTvShows.set([]);
    this.onLoadSeries();
  }
  onLoadNextPages() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      this.onLoadSeries();
    }
  }
}
