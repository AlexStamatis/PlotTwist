import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieResponse, TvShowResponse } from '../models/movie.model';

@Injectable()
export class TmdbService {
  private apikey = 'f041c326048aa835b14568059e58dc43';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  getMoviesPopular(page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
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

  getNowPlayingMovies(page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.baseUrl}/movie/now_playing?api_key=${this.apikey}&language=en-US&page=${page}`
    );
  }

  getUpcomingMovies(page: number = 1): Observable<MovieResponse> {
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

    return this.http.get<MovieResponse>(`${this.baseUrl}/discover/movie`, {
      params,
    });
  }

  getTopRatedMovies(page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.baseUrl}/movie/top_rated?api_key=${this.apikey}&language=en-US&page=${page}`
    );
  }
  getPopularTvShows(page: number = 1): Observable<TvShowResponse> {
    return this.http.get<TvShowResponse>(
      `${this.baseUrl}/tv/popular?api_key=${this.apikey}&language=en-US&page=${page}`
    );
  }

  getAiringTodayTvShows(page: number = 1): Observable<TvShowResponse> {
    const params = new HttpParams()
      .set('api_key', this.apikey)
      .set('language', 'en-US')
      .set('page', page.toString());

    return this.http.get<TvShowResponse>(`${this.baseUrl}/tv/airing_today`, {
      params,
    });
  }
  getTvShowsOnTv(page: number = 1): Observable<TvShowResponse> {
    return this.http.get<TvShowResponse>(
      `${this.baseUrl}/tv/on_the_air?api_key=${this.apikey}&language=en-US&page=${page}`
    );
  }

  getTvShowsTopRated(page: number = 1): Observable<TvShowResponse> {
    return this.http.get<TvShowResponse>(
      `${this.baseUrl}/tv/top_rated?api_key=${this.apikey}&language=en-US&page=${page}`
    );
  }

  getPopularPeople(page: number = 1) {
    return this.http.get(
      `${this.baseUrl}/person/popular?api_key=${this.apikey}&language=en-US&page=${page}`
    );
  }

  getTrendingMovieVideos(movieId: number) {
    return this.http.get(
      `${this.baseUrl}/movie/${movieId}/videos?api_key=${this.apikey}`
    );
  }

  getTrendingTvVideos(tvId: number) {
    return this.http.get(
      `${this.baseUrl}/tv/${tvId}/videos?api_key=${this.apikey}`
    );
  }

  getReleasedThisWeekMovies(fromDate: string, toDate: string) {
    return this.http.get(
      `${this.baseUrl}/discover/movie?primary_release_date.gte=${fromDate}&primary_release_date.lte=${toDate}&api_key=${this.apikey}`
    );
  }

  getReleasedThisWeekSeries(fromDate: string, toDate: string) {
    return this.http.get(
      `${this.baseUrl}/discover/tv?first_air_date.gte=${fromDate}&first_air_date.lte=${toDate}&api_key=${this.apikey}`
    );
  }

  getRecommendedMovies(movieId: number) {
    return this.http.get(
      `${this.baseUrl}/movie/${movieId}/recommendations?api_key=${this.apikey}&language=en-US`
    );
  }

  getRecommendedTvShows(tvId: number) {
    return this.http.get(
      `${this.baseUrl}/tv/${tvId}/recommendations?api_key=${this.apikey}&language=en-US`
    );
  }

  getSortedPopularMovies(
    sortBy: string,
    page: number = 1
  ): Observable<MovieResponse> {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    let params = new HttpParams()

      .set('api_key', this.apikey)
      .set('sort_by', sortBy)
      .set('language', 'en-US')
      .set('page', page.toString())
      .set('vote_count.gte', '100');

    if (sortBy !== 'release_date.asc') {
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      params = params
        .set('primary_release_date.gte', '1930-01-01')
        .set('primary_release_date.lte', `${nextYear}-12-31`);
    }

    return this.http.get<MovieResponse>(`${this.baseUrl}/discover/movie`, {
      params,
    });
  }

  getSortedNowPlayingMovies(
    sortBy: string,
    page: number = 1
  ): Observable<MovieResponse> {
    const nextYear = new Date().getFullYear() + 1;
    let params = new HttpParams()
      .set('api_key', this.apikey)
      .set('sort_by', sortBy)
      .set('language', 'en-Us')
      .set('page', page.toString())
      .set('vote_count.gte', '100');

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    params = params
      .set('primary_release_date.gte', oneMonthAgo.toISOString().split('T')[0])
      .set('primary_release_date.lte', today.toISOString().split('T')[0]);

    return this.http.get<MovieResponse>(`${this.baseUrl}/discover/movie`, {
      params,
    });
  }

  getSortedTopRatedMovie(
    sortBy: string,
    page: number = 1
  ): Observable<MovieResponse> {
    let params = new HttpParams()
      .set('api_key', this.apikey)
      .set('sort_by', sortBy)
      .set('language', 'en-US')
      .set('page', page.toString())
      .set('vote_count.gte', '500')
      .set('vote_average.gte', '7');

    const earliestYear = 1920;
    const nextYear = new Date().getFullYear() + 1;

    params = params
      .set('primary_release_date.gte', `${earliestYear}-01-01`)
      .set('primary_release_date.lte', `${nextYear}-12-31`);

    return this.http.get<MovieResponse>(`${this.baseUrl}/discover/movie`, {
      params,
    });
  }

  getSortedUpcomingMovies(
    sortBy: string,
    page: number = 1
  ): Observable<MovieResponse> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setFullYear(today.getFullYear() + 1);

    const todayFixed = today.toISOString().split('T')[0];
    const futureFixed = futureDate.toISOString().split('T')[0];

    let params = new HttpParams()
      .set('api_key', this.apikey)
      .set('sort_by', 'popularity.desc')
      .set('language', 'en-US')
      .set('page', page.toString())
      .set('include_adult', 'false')
      .set('primary_release_date.gte', todayFixed)
      .set('primary_release_date.lte', futureFixed)
      .set('with_release_type', '3|2');

    return this.http.get<MovieResponse>(`${this.baseUrl}/discover/movie`, {
      params,
    });
  }

  getSortedPopularTvShows(
    sortBy: string,
    page: number = 1
  ): Observable<TvShowResponse> {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    let params = new HttpParams()
      .set('api_key', this.apikey)
      .set('sort_by', sortBy)
      .set('language', 'en-US')
      .set('page', page.toString())
      .set('vote_count.gte', '100')
      .set('include_null_first_air_dates', 'false')
      .set('first_air_date.gte', '1930-01-01')
      .set('first_air_date.lte', `${nextYear}-12-31`);

    return this.http.get<TvShowResponse>(`${this.baseUrl}/discover/tv`, {
      params,
    });
  }

  getSortedAiringTodayTvShows(
    sortBy: string,
    page: number = 1
  ): Observable<TvShowResponse> {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const nextYear = today.getFullYear() + 1;

    const params = new HttpParams()
      .set('api_key', this.apikey)
      .set('language', 'en-US')
      .set('sort_by', sortBy)
      .set('page', page.toString())
      .set('first_air_date.gte', oneMonthAgo.toISOString().split('T')[0])
      .set('first_air_date.lte', today.toISOString().split('T')[0]);

    return this.http.get<TvShowResponse>(`${this.baseUrl}/discover/tv`, {
      params,
    });
  }

  getSortedOnTvShows(
    sortBy: string,
    page: number = 1
  ): Observable<TvShowResponse> {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const params = new HttpParams()
      .set('api_key', this.apikey)
      .set('language', 'en-US')
      .set('sort_by', sortBy)
      .set('page', page.toString())
      .set('first_air_date.gte', oneMonthAgo.toISOString().split('T')[0])
      .set('first_air_date.lte', today.toISOString().split('T')[0]);

    return this.http.get<TvShowResponse>(`${this.baseUrl}/discover/tv`, {
      params,
    });
  }

  getSortedTopRatedTvShows(
    sortBy: string,
    page: number = 1
  ): Observable<TvShowResponse> {
    const today = new Date();

    let params = new HttpParams()
      .set('api_key', this.apikey)
      .set('language', 'en-US')
      .set('sort_by', sortBy)
      .set('vote_count.gte', '100')
      .set('page', page.toString())
      .set('first_air_date.gte', '1930-01-01')
      .set('first_air_date.lte', 'today');

      return this.http.get<TvShowResponse>(`${this.baseUrl}/discover/tv`, { params });
  }
}
