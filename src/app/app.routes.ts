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

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'movie',
    component: MoviesPopularComponent,
  },

  {
    path: 'movie/now-playing',
    component: MoviesNowPlayingComponent,
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
];

export default routes;
