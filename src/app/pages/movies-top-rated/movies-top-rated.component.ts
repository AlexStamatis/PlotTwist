import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { FiltersComponent } from '../../shared/layout/filters/filters.component';
import { MovieCardComponent } from '../../shared/layout/movie-card/movie-card.component';

@Component({
  selector: 'app-movies-top-rated',
  standalone: true,
  imports: [FiltersComponent, MovieCardComponent],
  templateUrl: './movies-top-rated.component.html',
  styleUrl: './movies-top-rated.component.css',
})
export class MoviesTopRatedComponent {
  topRatedMovies = signal<any[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);

  constructor(private tmdbService: TmdbService) {
    this.onLoadMovies();
  }
  onLoadMovies() {
    this.tmdbService
      .getTopRatedMovies(this.currentPage())
      .subscribe((res: any) => {
        this.topRatedMovies.update((movies) => [...movies, ...res.results]);
        this.totalPages.set(res.total_pages);
      });
  }

  onLoadNextPages() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      this.onLoadMovies();
    }
  }
}
