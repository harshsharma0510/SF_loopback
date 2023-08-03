import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE_URL = 'http://localhost:3000';

  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  login(credentials: { email: string; password: string }) {
    const url = `${this.API_BASE_URL}/user/login`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(url, credentials);
  }

  handleLoginSuccess(response: any) {
    console.log('Login successful:', response);
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('access_token', response.token);
    this.router.navigate(['/users']);
  }

  handleLoginError(error: any) {
    console.error('Login error:', error);
  }

  logout() {
    localStorage.removeItem('access_token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }
  getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
