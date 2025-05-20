import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable()
export class TmdbService {
  private apikey = 'f041c326048aa835b14568059e58dc43';
  private baseUrl = 'https://api.themoviedb.org/3';

  movies = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  getMoviesPopular(page: number = 1) {
    return this.http
      .get(
        `${this.baseUrl}/movie/popular?api_key=${this.apikey}&language=en-US&page=${page}`
      )
    
  }

  getTrendingMovies() {
    return this.http.get(
      `${this.baseUrl}/trending/movie/day?api_key=${this.apikey}&language=en-US`
    );
  }

  getTrendingTv() {
    return this.http.get(
      `${this.baseUrl}/trending/tv/day?api_key=${this.apikey}&language=en-US`
    );
  }

  getNowPlayingMovies() {
    return this.http.get(
      `${this.baseUrl}/movie/now_playing?api_key=${this.apikey}&language=en-US`
    );
  }
}
