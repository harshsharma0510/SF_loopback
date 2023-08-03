import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import{User, Customer, Role} from '../app/user.model'


@Injectable({
  providedIn: 'root'
})
export class UserData {
    public userData: User[];
  private customerData: Customer[] = [];
  private roleData: Role[] = [];
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {
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
    const response = await fetch('http://localhost:3000/users');
    const data = await response.json();
    this.userData = data;
    return this.userData;
  }

  async create(user: User): Promise<void> {
    console.log('Creating user:', user);

    const { customerId, roleId, ...rest } = user;
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
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    const index = this.userData.findIndex((u) => u.id === data.id);
    if (index !== -1) {
      this.userData[index] = data;
    }
  }
  async deleteUserFromServer(userId: number): Promise<void> {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      console.error('Error deleting user:', response.status, response.statusText);
    }
  }
  

  async delete(id: number): Promise<void> {
    console.log('Deleting user with ID:', id);
    this.userData = this.userData.filter((u) => u.id !== id);
    try {
      await this.deleteUserFromServer(id);

    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
}
