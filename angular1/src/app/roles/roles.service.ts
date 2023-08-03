import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import{User, Customer, Role} from '../user.model'

import { throwError } from 'rxjs';
@Injectable()
export class RoleData {
  public userData: User[];
  public customerData: Customer[] = [];
  public roleData: Role[] = [];
  private apiUrl = 'http://localhost:3000/roles';

  constructor(public http: HttpClient) {
    this.userData = [];
    this.customerData = [];
    this.roleData = [];
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred:', error);
    return Promise.reject(error.message || error);
  }



  async getAll(): Promise<Role[]> {
    console.log('Fetching all role data...');
    const response = await fetch('http://localhost:3000/roles');
    const data = await response.json();
    this.roleData = data;
    return this.roleData;
  }

  async create(role: Role): Promise<void> {
    console.log('Creating role:', role);

    const { id, ...rest } = role;
    const requestData = {
      ...rest,
    };
    const response = await fetch('http://localhost:3000/roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),


    });
    console.log('Response from server:', role);
    if (response.ok) {
      const data = await response.json();
      console.log('Processed data:', data);
      this.userData.push(data);
    } else {
      
      console.error('Error creating user:', response.status, response.statusText);
    }

  }
  async update(role: Role): Promise<void> {
    console.log('Updating role:', role);
    const response = await fetch(`http://localhost:3000/roles/${role.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(role),
    });
  
    if (response.ok) {
      
      const responseData = await response.text();
      if (responseData) {
        const data = JSON.parse(responseData);
        const index = this.userData.findIndex((u) => u.id === data.id);
        if (index !== -1) {
          this.roleData[index] = data;
        }
      } else {
       
        console.log('Role update successful.');
      }
    } else {
      console.error('Error updating Role:', response.status, response.statusText);
    }
  }
  
  

  async deleteRoleFromServer(role: Role): Promise<void> {
    const response = await fetch(`http://localhost:3000/roles/${role.id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      console.error('Error deleting Role:', response.status, response.statusText);
    }
  }
  

  async delete(id: number): Promise<void> {
    console.log('Deleting role with ID:', id);
    const roleToDelete = this.roleData.find((r) => r.id === id);
    if (!roleToDelete) {
      console.error('Role not found in roleData:', id);
      return;
    }
  
    this.roleData = this.roleData.filter((r) => r.id !== id);
    try {
      await this.deleteRoleFromServer(roleToDelete);
  
    } catch (error) {
      console.error('Error deleting Role:', error);
    }
  }
  
}


