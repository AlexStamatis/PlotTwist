import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class TmdbService {
  private apikey = 'f041c326048aa835b14568059e58dc43';
  private baseUrl = 'https://api.themoviedb.org/3';

  

  constructor(private http: HttpClient) {}

  getMoviesPopular(page: number = 1) {
    return this.http.get(
      `${this.baseUrl}/movie/popular?api_key=${this.apikey}&language=en-US&page=${page}`
    );
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

  getNowPlayingMovies(page: number = 1) {
    return this.http.get(
      `${this.baseUrl}/movie/now_playing?api_key=${this.apikey}&language=en-US&page=${page}`
    );
  }

  getUpcomingMovies(page: number = 1) {
    const today = new Date().toISOString().split('T')[0];
    const params = new HttpParams()
    .set('api_key', this.apikey)
    .set('language', 'en-US')
    .set('region', 'US')
    .set('page', page.toString())
    .set('include_adult', 'false')
    .set('include_video', 'false')
    .set('with_release_type', '2|3')
    .set('primary_release_date.gte', today)
    .set('sort_by', 'release_date.asc');

    return this.http.get(`${this.baseUrl}/discover/movie`, { params });
  }

  getTopRatedMovies(page: number = 1) {
    return this.http.get(
      `${this.baseUrl}/movie/top_rated?api_key=${this.apikey}&language=en-US&page=${page}`
    );
  }
  getPopularTvShows(page:number = 1) {
    return this.http.get(`${this.baseUrl}/tv/popular?api_key=${this.apikey}&language=en-US&page=${page}`)
  }

  getAiringTodayTvShows(page:number = 1) {
    return this.http.get(`${this.baseUrl}/tv/airing_today?api_key=${this.apikey}&language=en-US&page=${page}`)
  }
  getTvShowsOnTv(page:number = 1) {
    return this.http.get(`${this.baseUrl}/tv/on_the_air?api_key=${this.apikey}&language=en-US&page=${page}`)
  }

  getTvShowsTopRated(page:number = 1) {
    return this.http.get(`${this.baseUrl}/tv/top_rated?api_key=${this.apikey}&language=en-US&page=${page}`)
  }

  getPopularPeople(page:number = 1) {
    return this.http.get(`${this.baseUrl}/person/popular?api_key=${this.apikey}&language=en-US&page=${page}`)
  }

  getTrendingMovieVideos(movieId: number) {
    return this.http.get(`${this.baseUrl}/movie/${movieId}/videos?api_key=${this.apikey}`)
  }

  getTrendingTvVideos(tvId: number) {
    return this.http.get(`${this.baseUrl}/tv/${tvId}/videos?api_key=${this.apikey}`)
  }

  getReleasedThisWeekMovies(fromDate:string, toDate:string) {
    return this.http.get(`${this.baseUrl}/discover/movie?primary_release_date.gte=${fromDate}&primary_release_date.lte=${toDate}&api_key=${this.apikey}`)
  }

  getReleasedThisWeekSeries(fromDate:string, toDate:string) {
    return this.http.get(`${this.baseUrl}/discover/tv?first_air_date.gte=${fromDate}&first_air_date.lte=${toDate}&api_key=${this.apikey}`)
  }

  getRecommendedMovies(movieId: number) {
    return this.http.get(`${this.baseUrl}/movie/${movieId}/recommendations?api_key=${this.apikey}&language=en-US`)
  }

  getRecommendedTvShows(tvId: number) {
    return this.http.get(`${this.baseUrl}/tv/${tvId}/recommendations?api_key=${this.apikey}&language=en-US`)
  }

  getSortedMovies( sortBy: string , page:number = 1):Observable<any>{
    const params = new HttpParams().set('api_key', this.apikey).set('sort_by', sortBy).set('language','en-US').set('page',page.toString());
    return this.http.get(`${this.baseUrl}/discover/movie`, { params });
  }
}
