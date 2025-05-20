import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';

@Component({
  selector: 'app-movies-now-playing',
  standalone:true,
  imports: [CommonModule],
  providers : [TmdbService],
  templateUrl: './movies-now-playing.component.html',
  styleUrl: './movies-now-playing.component.css'
})
export class MoviesNowPlayingComponent {

}
