import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { CustomersComponent } from './customers/customers.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './users/users.component';
import { AppComponent } from './app.component';
import { UserData } from '../app/users/user.service';
import { RolesComponent } from './roles/roles.component';
import { RoleData } from './roles/roles.service';
import { CustomerService } from './customers/customer.service';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginService } from './login/login.service';
import { SignupService } from './signup/signup.service';
import { AuthInterceptor } from './interceptor';
import { AuthService } from './auth.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UserComponent },
  { path: 'customers/:customerId/users', component: UserComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CustomersComponent,
    UserComponent,
    RolesComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [LoginService, SignupService,AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
     UserData, RoleData, CustomerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
