import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly API_BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient,) {}

  login(credentials: { email: string; password: string }) {
    const url = `${this.API_BASE_URL}/user/login`;
    return this.http.post(url, credentials);
  }
  signup(user: any) {
    return this.http.post<any>(`${this.API_BASE_URL}/users/signup`, user);
  }
}
