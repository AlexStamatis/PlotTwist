import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterConfigOptions, withHashLocation, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { TmdbService } from './shared/services/tmdb.service';
import { httpErrorInterceptor } from './interceptors/http-error.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' }), withHashLocation()),provideHttpClient(withInterceptors([httpErrorInterceptor])),TmdbService], 
};
