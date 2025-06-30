import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { MovieCardComponent } from '../../shared/layout/movie-card/movie-card.component';
import { FiltersComponent } from '../../shared/layout/filters/filters.component';
import { CombinedFiltersSelection, Movie, MovieResponse } from '../../shared/models/movie.model';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SpinnerComponent } from "../../shared/layout/spinner/spinner.component";

@Component({
  selector: 'app-movies-popular',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, FiltersComponent, SpinnerComponent],
  providers: [TmdbService],
  templateUrl: './movies-popular.component.html',
  styleUrl: './movies-popular.component.css',
})
export class MoviesPopularComponent {
  popularMovies = signal<Movie[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  sortOptionPicked = signal<string | null>(null);
  genreOptionPicked = signal<number[]>([]);
  loading = signal(false);
  resetFilter = signal(0);

  resetFilters() {
  this.resetFilter.update(v => v + 1);
  }
  constructor(private tmdbService: TmdbService, private router: Router) {
    this.onloadMovies();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (this.router.url === '/movie') {
          this.sortOptionPicked.set(null);
          this.genreOptionPicked.set([]);
          this.currentPage.set(1);
          this.popularMovies.set([]);
          this.resetFilters();
          this.onloadMovies();
         
        }
      });
  }
  onloadMovies() {
    this.loading.set(true);
    const page = this.currentPage();
    const sort = this.sortOptionPicked();
    const genreIds = this.genreOptionPicked();
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const fetchMovies = sort|| genreIds.length > 0
      ? this.tmdbService.getSortedPopularMovies(sort ?? '', page, genreIds)
      : this.tmdbService.getMoviesPopular(page);

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
              : year >= 1900 && year <= nextYear;

          return movie.poster_path && movie.vote_average > 0 && validYear;
        });
        this.popularMovies.update((movies) => {
          const existingIds = new Set(movies.map((movie) => movie.id));
          const newUniqueMovies = filtered.filter((movie) => !existingIds.has(movie.id));
          return [...movies, ...newUniqueMovies];
        })
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

  onSearchFromFilters(event: CombinedFiltersSelection) {
    const sort = event.sort?.trim() || null;
    const genres = event.genreIds ?? [];
    this.sortOptionPicked.set(sort);
    this.genreOptionPicked.set(genres);
    this.currentPage.set(1);
    this.popularMovies.set([]);
    this.onloadMovies();
  }

  onLoadNextPages() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      this.onloadMovies();
    }
  }
}
