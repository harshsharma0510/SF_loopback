import { Component, OnInit } from '@angular/core';
import { User, Customer } from '../user.model';
import { CustomerService } from './customer.service';
import { UserComponent } from '../users/users.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { UserData } from '../user.service';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  providers: [UserData, UserComponent]
  
})
export class CustomersComponent implements OnInit {

  selectedCustomer: Customer | null = null;
  usersForSelectedCustomer: User[] = [];
  customers: Customer[] = [];
  selectedCustomerUsers: User[] = [];
  private userTable: HTMLTableElement | null | undefined;
  private loadDataButton: HTMLButtonElement | null | undefined;
  private createUserButton!: HTMLButtonElement | null;
  constructor(private customerData: CustomerService,
    private userData: UserData,
    private usercomponent: UserComponent,
    private http: HttpClient,
    private authService: AuthService)
    {}

  ngOnInit(): void {
    this.loadData();
  }
  

  async showUsers(customer: Customer): Promise<void> {
    this.selectedCustomer = customer;
    try {
      const users = await this.userData.getUsersForCustomer(customer.id ?? 0).toPromise();
      if (users) {
        this.usersForSelectedCustomer = users.filter((user) => user.customerId === customer.id);
      } else {
        console.error('No users found for the selected customer.');
        this.usersForSelectedCustomer = []; 
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      this.usersForSelectedCustomer = []; 
    }
  }

  async loadData(): Promise<void> {
    this.customers = (await this.customerData.getAllCustomers().toPromise()) ?? [];
  }

  async createCustomer(): Promise<void> {
    const emptyCustomer: Customer = {
      id: 0,
      name: '',
      website: '',
      address: '',
      created_on: new Date(),
      modified_on: new Date(),
    };

    this.customers.unshift(emptyCustomer); 
    this.editRow(emptyCustomer);
  }

  editRow(customer: Customer): void {
    customer.editing = true;
  }

  cancelEdit(customer: Customer): void {
    if (customer.id === 0) {
      
      this.customers = this.customers.filter((c) => c !== customer);
    } else {
      customer.editing = false;
    }
  }

  async saveRow(customer: Customer): Promise<void> {
    const isNewCustomer = customer.id === 0;
    customer.editing = false;
    const { editing, ...customerWithoutEditing } = customer;
    if (isNewCustomer) {
      customer.created_on = new Date();
      customer.modified_on = new Date();
      try {
      const newCustomer: Customer = {
        name: customer.name,
        website: customer.website,
        address: customer.address,
        created_on: customer.created_on,
        modified_on: customer.modified_on,
      };
        await this.customerData.createCustomer(newCustomer).toPromise();
      } catch (error) {
        console.error('Error Creating Customer:', error);
      }
    } else {
      customer.modified_on = new Date();
      try {
        if (customer.id !== null && customer.id !== undefined){
        await this.customerData.updateCustomer(customer.id, customerWithoutEditing).toPromise();
      } else {
        console.error('Invalid customer ID:', customer.id);
      }
    }
      catch (error) {
        console.error('Error Updating Customer:', error);
      }
    }
  }

  async deleteRow(customer: Customer): Promise<void> {
    if (customer.id !== 0) {
      await this.customerData.deleteCustomer(customer.id!).toPromise();
    }
    this.customers = this.customers.filter((c) => c !== customer);
  }
}

