import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { FiltersComponent } from '../../shared/layout/filters/filters.component';
import { MovieCardComponent } from '../../shared/layout/movie-card/movie-card.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MovieResponse } from '../../shared/models/movie.model';
import { SpinnerComponent } from '../../shared/layout/spinner/spinner.component';

@Component({
  selector: 'app-movies-top-rated',
  standalone: true,
  imports: [FiltersComponent, MovieCardComponent, SpinnerComponent],
  templateUrl: './movies-top-rated.component.html',
  styleUrl: './movies-top-rated.component.css',
})
export class MoviesTopRatedComponent {
  topRatedMovies = signal<any[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  sortOptionPicked = signal<string | null>(null);
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
        if (this.router.url === '/movie/top-rated') {
          this.sortOptionPicked.set(null);
          this.currentPage.set(1);
          this.topRatedMovies.set([]);
          this.resetFilters();
          this.onLoadMovies();
        }
      });
  }

  onLoadMovies() {
    this.loading.set(true);
    const page = this.currentPage();
    const sort = this.sortOptionPicked();
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const fetchMovies = sort
      ? this.tmdbService.getSortedTopRatedMovie(sort, page)
      : this.tmdbService.getTopRatedMovies(page);

    fetchMovies.subscribe({
      next: (res: MovieResponse) => {
        this.totalPages.set(res.total_pages);

        const filtered = res.results.filter((movie) => {
          const year = movie.release_date
            ? parseInt(movie.release_date.substring(0, 4))
            : 0;

          const validYear =
            sort === 'release_date.asc'
              ? year > 0
              : year >= 1920 && year <= nextYear;

          return movie.poster_path && movie.vote_average > 0 && validYear;
        });
        this.topRatedMovies.update((movies) => [...movies, ...filtered]);
        this.currentPage.set(page);
      },
      error: (err) => {
        console.error('Problem in loading Movies', err);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  onSearchFromFilters(sortBy: string) {
    this.sortOptionPicked.set(sortBy);
    this.currentPage.set(1);
    this.topRatedMovies.set([]);
    this.onLoadMovies();
  }

  onLoadNextPages() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      this.onLoadMovies();
    }
  }
}
