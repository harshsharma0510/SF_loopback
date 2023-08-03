import { Component, Input, OnInit } from '@angular/core';
import { User, Role, Customer} from '../user.model';
import { UserData } from './user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from , of} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
  export class UserComponent implements OnInit {
    @Input() selectedCustomer: Customer | null = null;
    constructor(
      private userData: UserData,
       private authService: AuthService,
       ) {}
  private userTable: HTMLTableElement | null | undefined;
  private loadDataButton: HTMLButtonElement | null | undefined;
  private createUserButton!: HTMLButtonElement | null;
  isUserLoggedIn = false;

  ngOnInit(): void {
  this.authService.isAuthenticated().subscribe((loggedIn) => {
    this.isUserLoggedIn = loggedIn;
    if (loggedIn) {
      this.init();
    }
  });
}

  async init(): Promise<void> {
    await Promise.all([this.userData.getCustomers(), this.userData.getRoles()]);

    this.userTable = document.getElementById('userDataTable') as HTMLTableElement;
    this.loadDataButton = document.getElementById('loadDataButton') as HTMLButtonElement;
    this.createUserButton = document.getElementById('createUserButton') as HTMLButtonElement;

    this.loadDataButton!.addEventListener('click', this.loadData.bind(this));
    this.createUserButton!.addEventListener('click', this.createUser.bind(this));
  }

  async loadData(): Promise<void> {
    const data = await this.userData.getAll();
    this.renderTable(data);
    this.loadDataButton!.innerHTML = 'Refresh';
    this.loadDataButton!.removeEventListener('click', this.loadData);
    this.loadDataButton!.addEventListener('click', this.refreshData.bind(this));
  }

  async refreshData(): Promise<void> {
    const data = await this.userData.getAll();
    this.renderTable(data);
  }

  renderTable(data: User[]): void {
    const tbody = this.userTable!.querySelector('tbody');
    tbody!.innerHTML = '';
    data.forEach((user) => {
      const row = this.createRow(user);
      tbody!.appendChild(row);
    });
  }

  createRow(user: User): HTMLTableRowElement {
    const row = document.createElement('tr');
    row.dataset['userId'] = user.id?.toString();
    row.innerHTML = `
      <td>${user.first_name}</td>
      <td>${user.middle_name}</td>
      <td>${user.last_name}</td>
      <td>${user.email}</td>
      <td>${user.phone_number}</td>
      <td>${user.address}</td>
      <td>${this.userData.getCustomerNameById(user.customerId)}</td> 
    <td>${this.userData.getRoleNameById(user.roleId)}
    <td>${user.password}</td>
    <td>${user.username}</td>
      <td>${user.created_at}</td>
      <td>${user.modified_on}</td>
      <td>
        <button class="editButton">Edit</button>
        <button class="deleteButton">Delete</button>
      </td>
    `;
    const editButton = row.querySelector('.editButton') as HTMLButtonElement;
    const deleteButton = row.querySelector('.deleteButton') as HTMLButtonElement;
    editButton.addEventListener('click', this.editRow.bind(this, row, user));
    deleteButton.addEventListener('click', this.deleteRow.bind(this, row, user.id!));
    return row;
  }

  editRow(row: HTMLTableRowElement, user: User): void {
    row.classList.add('editing');
    this.createEditableRow(row, user);
  }

  createEditableRow(row: HTMLTableRowElement, user: User): void {
    row.innerHTML = `
      <td><input type="text" name="first_name" value="${user.first_name}" placeholder =" First Name"></td>
      <td><input type="text" name="middle_name" value="${user.middle_name}" placeholder =" Middle Name"></td>
      <td><input type="text" name="last_name" value="${user.last_name}" placeholder ="Last Name"></td>
      <td><input type="text" name="email" value="${user.email}" placeholder ="Email"></td>
      <td><input type="text" name="phone_number" value="${user.phone_number}" placeholder ="Phone Number"></td>
      <td><input type="text" name="address" value="${user.address}" placeholder ="Address"></td>
      <td>
        <select name="customer_id">
        <option value="0" disabled selected>Select Customer</option>
          ${this.userData.getCustomerData().map(customer => `<option value="${customer.id}"${customer.id === user.customerId ? ' selected' : ''}>${customer.name}</option>`).join('')}
        </select>
      </td>
      <td>
        <select name="role_id">
        <option value="0" disabled selected>Select Role</option>
          ${this.userData.getRoleData().map(role => `<option value="${role.id}"${role.id === user.roleId ? ' selected' : ''}>${role.name}</option>`).join('')}
        </select>
      </td>
      <td><input type="text" name="password" value="${user.password}" placeholder ="Password"></td>
      <td><input type="text" name="username" value="${user.username}" placeholder ="Username"></td>
      <td>${user.created_at}</td>
      <td>${user.modified_on}</td>
      <td>
        <button class="saveButton">Save</button>
        <button class="cancelButton">Cancel</button>
      </td>
    `;
    const saveButton = row.querySelector('.saveButton') as HTMLButtonElement;
    const cancelButton = row.querySelector('.cancelButton') as HTMLButtonElement;
    saveButton.addEventListener('click', this.saveRow.bind(this, row, user));
    cancelButton.addEventListener('click', this.cancelEdit.bind(this, row, user));
    console.log('Customer Data:', this.userData.getCustomerData()); 
    console.log('Role Data:', this.userData.getRoleData()); 
  }

  async saveRow(row: HTMLTableRowElement, user: User): Promise<void> {

    const isNewUser = user.id ===0;
    user.first_name = (row.querySelector('input[name="first_name"]') as HTMLInputElement).value;
    user.middle_name = (row.querySelector('input[name="middle_name"]') as HTMLInputElement).value;
    user.last_name = (row.querySelector('input[name="last_name"]') as HTMLInputElement).value;
    user.email = (row.querySelector('input[name="email"]') as HTMLInputElement).value;
    user.phone_number = (row.querySelector('input[name="phone_number"]') as HTMLInputElement).value;
    user.address = (row.querySelector('input[name="address"]') as HTMLInputElement).value;
    user.password = (row.querySelector('input[name="password"]') as HTMLInputElement).value;
    user.username = (row.querySelector('input[name="username"]') as HTMLInputElement).value;
    const customerSelect = row.querySelector('select[name="customer_id"]') as HTMLSelectElement;
    const roleSelect = row.querySelector('select[name="role_id"]') as HTMLSelectElement;
    user.customerId = parseInt(customerSelect.value, 10);
    user.roleId = parseInt(roleSelect.value, 10);

  if (isNewUser) {
    user.created_at = new Date() ;
    user.modified_on = new Date();
     try {
      await this.userData.create(user);
    } catch (error) {
      console.error('Error Creating Role:', error);
    }
  } else {
    user.modified_on = new Date();
   try {
    await this.userData.update(user);
  } catch (error) {
    console.error('Error Updating Role:', error);
  }
}
    row.classList.remove('editing');
    const newRow = this.createRow(user);
    const editButton = newRow.querySelector('.editButton') as HTMLButtonElement;
    const deleteButton = newRow.querySelector('.deleteButton') as HTMLButtonElement;
    editButton.addEventListener('click', this.editRow.bind(this, newRow, user));
    deleteButton.addEventListener('click', this.deleteRow.bind(this, newRow, user.id!));
    row.parentNode!.replaceChild(newRow, row);
  }

  cancelEdit(row: HTMLTableRowElement, user: User): void {
    row.classList.remove('editing');
    const newRow = this.createRow(user);
    const editButton = newRow.querySelector('.editButton') as HTMLButtonElement;
    const deleteButton = newRow.querySelector('.deleteButton') as HTMLButtonElement;
    editButton.addEventListener('click', this.editRow.bind(this, newRow, user));
    deleteButton.addEventListener('click', this.deleteRow.bind(this, newRow, user.id!));
    row.parentNode!.replaceChild(newRow, row);
  }

  async deleteRow(row: HTMLTableRowElement, userId: number): Promise<void> {
    await this.userData.delete(userId);
    if (row && row.parentNode) {
    row.parentNode!.removeChild(row);
    }
  }
  

  async createUser(): Promise<void> {
    const emptyUser: User = {
      id: 0,
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      address: '',
      customerId: 0,
      roleId: 0,
      username: '',
      password: '',
      created_at: new Date(),
      modified_on: new Date(),
    };
    
    const newRow = this.createRow(emptyUser);

    const tbody = this.userTable!.querySelector('tbody');
    tbody!.insertBefore(newRow, tbody!.firstChild);

    const cancelButton = newRow.querySelector('.cancelButton') as HTMLButtonElement;
    if (cancelButton) {
      cancelButton.addEventListener('click', () => this.cancelCreate(newRow, emptyUser));
    }

    this.editRow(newRow, emptyUser);
  }

  cancelCreate(row: HTMLTableRowElement, user: User): void {
    if (user.id === 0) {
      row.parentNode!.removeChild(row);
    } else {
      row.classList.remove('editing');
      const newRow = this.createRow(user);
      const editButton = newRow.querySelector('.editButton') as HTMLButtonElement;
      const deleteButton = newRow.querySelector('.deleteButton') as HTMLButtonElement;
      editButton.addEventListener('click', () => this.editRow(newRow, user)); 
      deleteButton.addEventListener('click', () => this.deleteRow(newRow, user.id!)); 
      row.parentNode!.replaceChild(newRow, row);
    
    }
  }
  logout() {
    this.authService.logout();
    this.isUserLoggedIn = false;
  }
}