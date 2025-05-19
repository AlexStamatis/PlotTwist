import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';



@Component({
  selector: 'app-movies-popular',
  standalone:true,
  imports: [CommonModule],
  providers: [TmdbService],
  templateUrl: './movies-popular.component.html',
  styleUrl: './movies-popular.component.css'
})
export class MoviesPopularComponent {
  popularMovies;

constructor(private tmdbService: TmdbService) {
  this.popularMovies = this.tmdbService.movies;

  this.tmdbService.getMoviesPopular();
}
}
