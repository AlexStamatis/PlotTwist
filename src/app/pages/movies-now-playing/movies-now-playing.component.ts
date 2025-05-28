import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { FiltersComponent } from '../../shared/layout/filters/filters.component';
import { MovieCardComponent } from '../../shared/layout/movie-card/movie-card.component';

@Component({
  selector: 'app-movies-now-playing',
  standalone: true,
  imports: [CommonModule, FiltersComponent, MovieCardComponent],
  providers: [TmdbService],
  templateUrl: './movies-now-playing.component.html',
  styleUrl: './movies-now-playing.component.css',
})
export class MoviesNowPlayingComponent {
  nowPlayingMovies = signal<any[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);

  constructor(private tmdbService:TmdbService) {
    this.onLoadMovies();
  }

  onLoadMovies() {
    this.tmdbService
      .getNowPlayingMovies(this.currentPage())
      .subscribe((res: any) => {
        this.nowPlayingMovies.update((movies) => [...movies, ...res.results]);
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
