import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { FiltersComponent } from '../../shared/layout/filters/filters.component';
import { MovieCardComponent } from '../../shared/layout/movie-card/movie-card.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import {
  CombinedFiltersSelection,
  MovieResponse,
} from '../../shared/models/movie.model';
import { SpinnerComponent } from '../../shared/layout/spinner/spinner.component';

@Component({
  selector: 'app-movies-upcoming',
  standalone: true,
  imports: [FiltersComponent, MovieCardComponent, SpinnerComponent],
  templateUrl: './movies-upcoming.component.html',
  styleUrl: './movies-upcoming.component.css',
})
export class MoviesUpcomingComponent {
  upcomingMovies = signal<any[]>([]);
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
    this.onLoadMovies();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (this.router.url === '/movie/upcoming') {
          this.sortOptionPicked.set(null);
          this.genreOptionPicked.set([])
          this.currentPage.set(1);
          this.upcomingMovies.set([]);
          this.resetFilters();
          this.onLoadMovies();
        }
      });
  }
  onLoadMovies() {
    this.loading.set(true);
    const page = this.currentPage();
    const sort = this.sortOptionPicked();
    const genreIds = this.genreOptionPicked();

    const fetchMovies = sort || genreIds.length > 0
      ? this.tmdbService.getSortedUpcomingMovies(sort ?? '', page, genreIds)
      : this.tmdbService.getUpcomingMovies(page);

    fetchMovies.subscribe({
      next: (res: MovieResponse) => {
        this.totalPages.set(res.total_pages);

        let filtered = res.results.filter(
          (movie) => !!movie.poster_path && !!movie.release_date
        );

        this.upcomingMovies.update((movies) => {
          const existingIds = new Set(movies.map((movie) => movie.id));
          const newUniqueMovies = filtered.filter(
            (movie) => !existingIds.has(movie.id)
          );
          return [...movies, ...newUniqueMovies];
        });
        this.currentPage.set(page);
      },
      error: (err) => {
        console.error('Problem loading upcoming movies', err);
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
    this.upcomingMovies.set([]);
    this.onLoadMovies();
  }

  onLoadNextPages() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      this.onLoadMovies();
    }
  }
}
