import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {
@Input() title! : string;
@Input() posterPath!:string | null;
@Input() releaseDate!: string;
@Input() voteAverage!: number;
@Input() movieId!: number;
@Input() mediaType: 'movie' | 'tv' = 'movie';

constructor(private router:Router) {

  }

}
