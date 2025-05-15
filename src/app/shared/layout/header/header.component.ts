import { Component } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  moviesOptions = ['Popular', 'Now Playing', 'Upcoming', 'Top Rated'];
  tvshowsOptions = ['Popular', 'Airing Today', 'On TV', 'Top Rated'];
  peopleOptions = ['Popular People'];

  routeMap:Record<string, Record<string, string>> = {
    movies: {
      'Popular': '/movie',
      'Now Playing': '/movie/now-playing',
      'Upcoming': '/movie/upcoming',
      'Top Rated': '/movie/top-rated',
    },

    tv: {
      'Popular': '/tv',
      'Airing Today': '/tv/airing-today',
      'On TV': '/tv/on-tv',
      'Top Rated': '/tv/top-rated',
    },
    people: {
      'Popular People': '/people',
    },
  };

  constructor(private router: Router) {}

  onDropdownSelect(category: string, option: string) {
 const route = this.routeMap[category]?.[option];
 if (route) {
    this.router.navigate([route]);
  }
}
 sendHome() {
  this.router.navigate(['/']);
 }
}
