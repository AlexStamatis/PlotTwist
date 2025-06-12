import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterConfigOptions, withRouterConfig } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { TmdbService } from './shared/services/tmdb.service';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),provideHttpClient(),TmdbService], 
};
