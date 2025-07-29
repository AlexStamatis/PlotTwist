import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apikey = environment.tmdbApiKey;
  private baseUrl = environment.tmdbBaseUrl;

  isLoggedIn = signal(!!localStorage.getItem('session_id'));
  username = signal(localStorage.getItem('username'));

  constructor(private http: HttpClient, private router: Router) {}

  requestToken() {
    const url = `${this.baseUrl}/authentication/token/new`;
    const params = new HttpParams().set('api_key', this.apikey);
    return this.http.get(url, { params });
  }

  redirectToTmdbAuth(requestToken: string) {
    const redirectUrl = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=http://localhost:4200/auth/done`;
    window.location.href = redirectUrl;
  }

  createSession(requestToken: string) {
    const url = `${this.baseUrl}/authentication/session/new`;
    const params = new HttpParams().set('api_key', this.apikey);
    return this.http.post(url, { request_token: requestToken }, { params });
  }

  getAccountDetails(sessionId: string) {
    const url = `${this.baseUrl}/account`;
    const params = new HttpParams()
      .set('api_key', this.apikey)
      .set('session_id', sessionId);
    return this.http.get(url, { params });
  }

  login(sessionId: string, username: string, userId: string) {
    localStorage.setItem('session_id', sessionId);
    localStorage.setItem('username', username);
    localStorage.setItem('user_id', userId);
    this.isLoggedIn.set(true);
    this.username.set(username);
  }

  logout() {
    localStorage.removeItem('session_id');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    this.isLoggedIn.set(false);
    this.username.set(null);
    this.router.navigate(['/']);
  }

getSessionId():string | null {
  return localStorage.getItem('session_id') || '';
}

getAccountId():string | null {
  return localStorage.getItem('user_id');
} 
}
