import { Component } from '@angular/core';
import { LoginService } from '../login/login.service';
import { SignupService } from '../signup/signup.service';
import {Router} from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService, SignupService]
})
export class LoginComponent {
  credentials: { email: string; password: string } = {
    email: '',
    password: ''
  };

  showSignUp = false;
  user: {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    username: string;
    password: string;
  } = {
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    username: '',
    password: ''
  };
  signupSuccess: boolean = false;

  constructor(
    private loginService: LoginService,
    private signupService: SignupService,
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    this.authService.login(this.credentials).subscribe(
      (response: any) => {
        this.authService.handleLoginSuccess(response);
      },
      (error: any) => {
        this.authService.handleLoginError(error);
      }
    );
  }

  signup() {
    this.signupService.signup(this.user).subscribe(
      (response) => {
        console.log('User signed up successfully:', response);
      
        this.signupSuccess = true;
        this.showSignUp = false;
      },
      (error) => {
        console.error('Sign-up failed:', error);
      }
    );
  }
}
