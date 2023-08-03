import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, User } from '../user.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:3000/customers';

  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomerById(id: number): Observable<Customer> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Customer>(url);
  }
  private removeEditingProperty(customer: Customer): Customer {
    const { editing, ...rest } = customer;
    return rest;
  }

  createCustomer(customer: Customer): Observable<Customer> {
    const requestData = this.removeEditingProperty(customer);
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(id: number,customer: Customer): Observable<Customer> {
    const requestData = this.removeEditingProperty(customer);
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Customer>(url, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
  // getUsersForCustomer(customerId: number): Observable<User[]> {
  //   return this.http.get<User[]>(`${this.apiUrl}?customerId=${customerId}`);
  // }
  getUsersForCustomer(customerId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${customerId}/users`);
  }

  createUserForCustomer(customerId: number, user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/${customerId}/users`, user);
  }

  updateUserForCustomer(customerId: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${customerId}/users/${user.id}`, user);
  }

  deleteUserForCustomer(customerId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${customerId}/users/${userId}`);
  }
}

