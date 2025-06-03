import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { MovieCardComponent } from '../../shared/layout/movie-card/movie-card.component';
import { FiltersComponent } from '../../shared/layout/filters/filters.component';

@Component({
  selector: 'app-movies-popular',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, FiltersComponent],
  providers: [TmdbService],
  templateUrl: './movies-popular.component.html',
  styleUrl: './movies-popular.component.css',
})
export class MoviesPopularComponent {
  popularMovies = signal<any[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  sortOptionPicked = signal<string | null>(null);

  constructor(private tmdbService: TmdbService) {
    this.onloadMovies();
  }
  onloadMovies() {
    const page = this.currentPage();
    const sort = this.sortOptionPicked();

    const fetchMovies = sort
      ? this.tmdbService.getSortedMovies(sort, page)
      : this.tmdbService.getMoviesPopular(page);

    fetchMovies.subscribe((res: any) => {
      this.popularMovies.update((movies) => [...movies, ...res.results]);
      this.totalPages.set(res.total_pages);
    });
  }
  onSearchFromFilters(sortBy: string) {
    this.sortOptionPicked.set(sortBy);
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
