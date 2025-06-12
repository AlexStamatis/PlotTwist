import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { FiltersComponent } from '../../shared/layout/filters/filters.component';
import { MovieCardComponent } from '../../shared/layout/movie-card/movie-card.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MovieResponse } from '../../shared/models/movie.model';
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
    const today = new Date();

    const fetchMovies = sort
      ? this.tmdbService.getSortedUpcomingMovies(sort, page)
      : this.tmdbService.getUpcomingMovies(page);

    fetchMovies.subscribe({
      next: (res: MovieResponse) => {
        this.totalPages.set(res.total_pages);

        let filtered = res.results.filter(
          (movie) => !!movie.poster_path && !!movie.release_date
        );

        if (sort === 'primary_release_date.asc') {
          filtered = filtered.sort((a, b) =>
            a.release_date.localeCompare(b.release_date)
          );
        } else if (sort === 'primary_release_date.desc') {
          filtered = filtered.sort((a, b) =>
            b.release_date.localeCompare(a.release_date)
          );
        } else if (sort === 'vote_average.asc') {
          filtered = filtered.sort((a, b) => a.vote_average - b.vote_average);
        } else if (sort === 'vote_average.desc') {
          filtered = filtered.sort((a, b) => b.vote_average - a.vote_average);
        } else if (sort === 'popularity.asc') {
          filtered = filtered.sort((a, b) => a.popularity - b.popularity);
        } else if (sort === 'popularity.desc') {
          filtered = filtered.sort((a, b) => b.popularity - a.popularity);
        }

        this.upcomingMovies.update((movies) => [...movies, ...filtered]);
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

  onSearchFromFilters(sortBy: string) {
    this.sortOptionPicked.set(sortBy);
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
