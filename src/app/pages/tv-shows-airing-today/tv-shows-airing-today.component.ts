import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { MovieCardComponent } from '../../shared/layout/movie-card/movie-card.component';
import { FiltersComponent } from '../../shared/layout/filters/filters.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CombinedFiltersSelection, TvShowResponse } from '../../shared/models/movie.model';
import { SpinnerComponent } from '../../shared/layout/spinner/spinner.component';

@Component({
  selector: 'app-tv-shows-airing-today',
  standalone: true,
  imports: [MovieCardComponent, FiltersComponent, SpinnerComponent],
  templateUrl: './tv-shows-airing-today.component.html',
  styleUrl: './tv-shows-airing-today.component.css',
})
export class TvShowsAiringTodayComponent {
  airingTodayTvShows = signal<any[]>([]);
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
        if (this.router.url === '/tv/airing-today') {
          this.sortOptionPicked.set(null);
          this.genreOptionPicked.set([]);
          this.currentPage.set(1);
          this.airingTodayTvShows.set([]);
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
      this.airingTodayTvShows.set([]);
    }
    const loadNext = () => {
      const fetchShows = sort || genreIds.length > 0
        ? this.tmdbService.getSortedAiringTodayTvShows(sort ?? '', page, genreIds)
        : this.tmdbService.getAiringTodayTvShows(page);

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
          this.airingTodayTvShows.update((existing) => {
            const existingIds = new Set(existing.map((item) => item.id));
            const newItems = filtered.filter(
              (item) => !existingIds.has(item.id)
            );
            return [...existing, ...newItems];
          });

          const currentCount = this.airingTodayTvShows().length;

          if (currentCount < minCount && page < res.total_pages) {
            page++;
            this.currentPage.set(page);
            loadNext(); 
          } else {
            this.currentPage.set(page); // Update after all done
            this.loading.set(false);
          }
        },
        error: (err) => {
          console.error('Failed to load TV Shows:', err);
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
    this.airingTodayTvShows.set([]);
    this.onLoadSeries();
  }

  onLoadNextPages() {
  if (this.currentPage() < this.totalPages()) {
      const previousCount = this.airingTodayTvShows().length;
      this.onLoadSeries(previousCount + 20);
    }
  }
}
