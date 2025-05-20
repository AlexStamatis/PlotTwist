import { CommonModule } from '@angular/common';
import { Component, signal} from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { MovieCardComponent } from "../../shared/layout/movie-card/movie-card.component";



@Component({
  selector: 'app-movies-popular',
  standalone:true,
  imports: [CommonModule, MovieCardComponent],
  providers: [TmdbService],
  templateUrl: './movies-popular.component.html',
  styleUrl: './movies-popular.component.css'
})
export class MoviesPopularComponent {
  popularMovies;
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);

constructor(private tmdbService: TmdbService) {
  this.popularMovies = this.tmdbService.movies;

  this.onloadMovies();
}
 onloadMovies() {
    this.tmdbService.getMoviesPopular(this.currentPage()).subscribe((res:any) => {
      this.popularMovies.update((movies) => [...movies,...res.results]);
      this.totalPages.set(res.total_pages);
    })
  }
onloadNextPages() {
  if (this.currentPage() < this.totalPages()) {
    this.currentPage.update((page) => page + 1);
    this.onloadMovies(); 
  }
}
}
