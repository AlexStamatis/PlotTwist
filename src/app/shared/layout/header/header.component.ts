import { AfterViewInit, Component, computed, ElementRef, ViewChild } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import Dropdown from 'bootstrap/js/dist/dropdown';


declare const bootstrap: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, DropdownComponent,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('dropdownBtn') dropdownBtn!: ElementRef<HTMLButtonElement>;
  dropdownInstance!: Dropdown;

  moviesOptions = ['Popular', 'Now Playing', 'Upcoming', 'Top Rated'];
  tvshowsOptions = ['Popular', 'Airing Today', 'On TV', 'Top Rated'];
  peopleOptions = ['Popular People'];

  isLoggedIn = computed(() => this.authService.isLoggedIn());
  username = computed(() => this.authService.username());

  

  routeMap: Record<string, Record<string, string>> = {
    movies: {
      Popular: '/movie',
      'Now Playing': '/movie/now-playing',
      Upcoming: '/movie/upcoming',
      'Top Rated': '/movie/top-rated',
    },

    tv: {
      Popular: '/tv',
      'Airing Today': '/tv/airing-today',
      'On TV': '/tv/on-tv',
      'Top Rated': '/tv/top-rated',
    },
    people: {
      'Popular People': '/people',
    },
  };

  constructor(private router: Router, private authService: AuthService) {}

  onDropdownSelect(category: string, option: string) {
    const route = this.routeMap[category]?.[option];
    if (route) {
      this.router.navigate([route]);
    }
  }
  sendHome() {
    this.router.navigate(['/']);
  }

  startLogin() {
    this.authService.requestToken().subscribe({
      next: (res: any) => {
        const requestToken = res.request_token;
        this.authService.redirectToTmdbAuth(requestToken);
      },
      error: (err) => {
        console.error('Error requesting token', err);
      },
    });
  }

  logout() {
    this.authService.logout();
  }

  ngAfterViewInit() {
  this.dropdownInstance = new Dropdown(this.dropdownBtn.nativeElement);
  }
} 
