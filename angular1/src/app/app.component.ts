import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './auth.service'; // Import the AuthService
import { NgForm } from '@angular/forms'; // Import NgForm for ViewChild

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isUserLoggedIn = false;

  // Use ViewChild to get a reference to the login form
  @ViewChild('loginForm', { static: false }) loginForm!: NgForm;

  constructor(private authService: AuthService) {} // Inject the AuthService or authentication service here

  ngOnInit() {
    // Subscribe to the authentication status changes from the AuthService
    this.authService.isAuthenticated().subscribe((loggedIn) => {
      this.isUserLoggedIn = loggedIn;
    });
  }

  login() {
    // Extract the email and password from the login form
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    // Call your AuthService login method here and handle the login logic
    // For example:
    this.authService.login({ email, password }).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        localStorage.setItem('access_token', response.token);
        this.isUserLoggedIn = true;
      },
      (error: any) => {
        console.error('Login error:', error);
      }
    );
  }
  logout() {
    // Call your AuthService logout method here and handle the logout logic
    // For example:
    this.authService.logout();
    this.isUserLoggedIn = false;
  }

}
