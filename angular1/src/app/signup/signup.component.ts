import { Component } from '@angular/core';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user: any = {}; 

  constructor(private signupService: SignupService) {}
  signup() {
    this.signupService.signup(this.user).subscribe(
      (response) => {
        console.log('User signed up successfully:', response);
    
      },
      (error) => {
        console.error('Sign-up failed:', error);
        
      }
    );
    }


}
