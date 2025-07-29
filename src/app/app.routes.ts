import { Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { MoviesPopularComponent } from './pages/movies-popular/movies-popular.component';
import { MoviesNowPlayingComponent } from './pages/movies-now-playing/movies-now-playing.component';
import { MoviesUpcomingComponent } from './pages/movies-upcoming/movies-upcoming.component';
import { MoviesTopRatedComponent } from './pages/movies-top-rated/movies-top-rated.component';
import { TvShowsPopularComponent } from './pages/tv-shows-popular/tv-shows-popular.component';
import { TvShowsAiringTodayComponent } from './pages/tv-shows-airing-today/tv-shows-airing-today.component';
import { TvShowsOnTvComponent } from './pages/tv-shows-on-tv/tv-shows-on-tv.component';
import { TvShowsTopRatedComponent } from './pages/tv-shows-top-rated/tv-shows-top-rated.component';
import { PopularPeopleComponent } from './pages/popular-people/popular-people.component';
import { AuthDoneComponent } from './auth/auth-done/auth-done.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'movie',
    component: MoviesPopularComponent,
    runGuardsAndResolvers: 'always'
  },

  {
    path: 'movie/now-playing',
    component: MoviesNowPlayingComponent,
    runGuardsAndResolvers: 'always'
  },

  {
    path: 'movie/upcoming',
    component: MoviesUpcomingComponent,
  },

  {
    path: 'movie/top-rated',
    component: MoviesTopRatedComponent,
  },

  {
    path: 'tv',
    component: TvShowsPopularComponent,
  },

  {
    path: 'tv/airing-today',
    component: TvShowsAiringTodayComponent,
  },

  {
    path: 'tv/on-tv',
    component: TvShowsOnTvComponent,
  },

  {
    path: 'tv/top-rated',
    component: TvShowsTopRatedComponent,
  },

  {
    path: 'people',
    component: PopularPeopleComponent,
  },

  {
    path: 'person/:id',
    loadComponent: () => import('./shared/layout/person-details/person-details.component').then((m)=> m.PersonDetailsComponent),  //lazy loading
  },

  {
    path: 'movie/:id',
    loadComponent: () => import('./shared/layout/movie-details/movie-details.component').then((m) => m.MovieDetailsComponent),
  },

  {
    path: 'tv/:id',
    loadComponent: () => import('./shared/layout/movie-details/movie-details.component').then((m) => m.MovieDetailsComponent),
  },

  {
    path: 'search',
    loadComponent: () => import('./shared/layout/search-results/search-results.component').then((m) => m.SearchResultsComponent),
    },

  {
    path: 'auth/done',
    loadComponent: () => import('./auth/auth-done/auth-done.component').then(m => m.AuthDoneComponent),
  }, 

  {
    path: 'u/:username/:type',
    loadComponent: () => import('./pages/user-list/user-list.component').then(m => m.UserListComponent),
  }
  
];

export default routes;
