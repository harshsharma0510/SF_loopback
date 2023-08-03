import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //const token = localStorage.getItem('access_token');
    const token = this.authService.getAuthToken();
    //console.log('Token:', token);
    console.log('Interceptor - Token:', token);
    if (token) {
      console.log('Interceptor - Adding Authorization Header');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    console.log('interceptor -Request Headers:', request.headers); // Log the request headers
    return next.handle(request);
  }
}
