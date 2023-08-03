import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import{User, Customer, Role} from '../user.model'

import { throwError } from 'rxjs';
import { AuthService } from '../auth.service';
@Injectable({
  providedIn: 'root'
})
export class UserData {
  public userData: User[];
  public customerData: Customer[] = [];
  public roleData: Role[] = [];
  private apiUrl = 'http://localhost:3000/users';

  constructor(public http: HttpClient, private authService: AuthService) {
    this.userData = [];
    this.customerData = [];
    this.roleData = [];
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred:', error);
    return Promise.reject(error.message || error);
  }

getCustomerNameById(customerId: number): string {
    console.log('getCustomerNameById - customerId:', customerId);
    const customer = this.customerData.find((c) => c.id === customerId);
    console.log('getCustomerNameById - customer:', customer);
    return customer ? customer.name : '';
  }
  getRoleNameById(roleId: number): string {
    console.log('getRoleNameById - roleId:', roleId);
    const role = this.roleData.find((r) => r.id === roleId);
    console.log('getRoleNameById - role:', role);
    return role ? role.name : '';
  }


  getCustomerData(): Customer[] {
    return this.customerData;
  }

  getRoleData(): Role[] {
    return this.roleData;
  }
  getUsersForCustomer(customerId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?customerId=${customerId}`);
  }
  getUsersForRole(roleId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?roleId=${roleId}`);
  }

  async getCustomers(): Promise<Customer[]> {
    console.log('Fetching customer data...');
    const response = await fetch('http://localhost:3000/customers');
    const data = await response.json();
    this.customerData = data;
    console.log('Customer Data:', this.customerData);
    return this.customerData;
  }

  async getRoles(): Promise<Role[]> {
    console.log('Fetching role data...');
    const response = await fetch('http://localhost:3000/roles');
    const data = await response.json();
    this.roleData = data;
    console.log('Role Data:', this.roleData);
    return this.roleData;
  }


  async getAll(): Promise<User[]> {
    console.log('Fetching all user data...');
        try {
          const authToken = this.authService.getAuthToken();
          const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
          const data = await this.http.get<User[]>('http://localhost:3000/users', { headers }).toPromise();
          this.userData = data!;
          return this.userData;
        } catch (error) {
          console.error('Error fetching all user data:', error);
          return [];
        }
      }

  async create(user: User): Promise<void> {
    console.log('Creating user:', user);
    const { id, customerId, roleId, ...rest } = user;
    const requestData = {
      ...rest,
      customerId,
      roleId,
    };
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    if (response.ok) {
      const data = await response.json();
      data.customer_name = this.getCustomerNameById(data.customer_id);
      data.role_name = this.getRoleNameById(data.role_id);
      console.log('Processed data:', data);
      this.userData.push(data);
    } else {
      console.error('Error creating user:', response.status, response.statusText);
    }
  }
 
  async update(user: User): Promise<void> {
        console.log('Updating user:', user);
        const response = await fetch(`http://localhost:3000/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authService.getAuthToken()}`
          },
          body: JSON.stringify(user),
        });
    
        if (response.ok) {
    
          const responseData = await response.text();
          if (responseData) {
            const data = JSON.parse(responseData);
            const index = this.userData.findIndex((u) => u.id === data.id);
            if (index !== -1) {
              this.userData[index] = data;
            }
          } else {
    
            console.log('User update successful.');
          }
        } else {
          console.error('Error updating user:', response.status, response.statusText);
        }
      }
    
      async deleteUserFromServer(userId: number): Promise<void> {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.authService.getAuthToken()}`
          }
        });
        if (!response.ok) {
          console.error('Error deleting user:', response.status, response.statusText);
        }
      }
  

  async delete(userId: number): Promise<void> {
    console.log('Deleting user with ID:', userId);
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.authService.getAuthToken()}`
          }
        });
    this.userData = this.userData.filter((u) => u.id !== userId);
  
      await this.deleteUserFromServer(userId);

    if (!response.ok) {
      console.error('Error deleting user:', response.status, response.statusText);
    }
  }
}
