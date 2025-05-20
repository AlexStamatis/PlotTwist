import { Component, signal } from '@angular/core';
import { ToggleButtonComponent } from '../../shared/layout/toggle-button/toggle-button.component';
import { TmdbService } from '../../shared/services/tmdb.service';
import { MovieCardComponent } from '../../shared/layout/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';

export interface ButtonOptions {
  btnName: string;
  isActive: boolean;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ToggleButtonComponent, MovieCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  mediaType = signal<'movies' | 'tv'>('movies');

  trendingItems = signal<any[]>([]);

  constructor(private tmdbService: TmdbService) {
    this.getTrendingItems();
  }

  getTrendingItems() {
    if (this.mediaType() === 'movies') {
      this.tmdbService.getTrendingMovies().subscribe((res: any) => {
        this.trendingItems.set(res.results);
      });
    } else {
      this.tmdbService.getTrendingTv().subscribe((res: any) => {
        this.trendingItems.set(res.results);
      });
    }
  }

  onToggleChange(option: string) {
    this.mediaType.set(option === 'Movies' ? 'movies' : 'tv');
    this.getTrendingItems();
  }

  buttonOptions: ButtonOptions[] = [
    { btnName: 'Movies', isActive: true },
    { btnName: 'TV', isActive: false },
  ];
}
