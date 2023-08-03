
import { Component, OnInit } from '@angular/core';
import { User, Role, Customer} from '../user.model';
import { RoleData } from './roles.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from , of} from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
  export class RolesComponent implements OnInit {
    constructor(private roleData: RoleData) {}
  private roleTable: HTMLTableElement | null | undefined;
  private loadRoleButton: HTMLButtonElement | null | undefined;
  private createRoleButton!: HTMLButtonElement | null;

  ngOnInit(): void {
    this.init();
  }

  async init(): Promise<void> {
    //await Promise.all([this.roleData.getCustomers(), this.roleData.getRoles()]);

    this.roleTable = document.getElementById('roleDataTable') as HTMLTableElement;
    this.loadRoleButton = document.getElementById('loadRoleButton') as HTMLButtonElement;
    this.createRoleButton = document.getElementById('createRoleButton') as HTMLButtonElement;

    this.loadRoleButton!.addEventListener('click', () => this.loadData());
    this.createRoleButton!.addEventListener('click',  () => this.createRole());
  }

  async loadData(): Promise<void> {
    const data = await this.roleData.getAll();
    this.renderTable(data);
    this.loadRoleButton!.innerHTML = 'Refresh';
    this.loadRoleButton!.removeEventListener('click', this.loadData);
    this.loadRoleButton!.addEventListener('click', this.refreshData.bind(this));
  }

  async refreshData(): Promise<void> {
    const data = await this.roleData.getAll();
    this.renderTable(data);
  }

  renderTable(data: Role[]): void {
    const tbody = this.roleTable!.querySelector('tbody');
    tbody!.innerHTML = '';
    data.forEach((role) => {
      const row = this.createRow(role);
      tbody!.appendChild(row);
    });
  }

  createRow(role: Role): HTMLTableRowElement {
    const row = document.createElement('tr');
    row.dataset['roleId'] = role.id?.toString();
    row.innerHTML = `
      <td>${role.name}</td>
      <td>${role.key}</td>
      <td>${role.description}</td>
      <td>${role.permissions.join(', ')}</td>
      <td>${role.created_on}</td>
      <td>${role.modified_on}</td>
      <td>
        <button class="editButton">Edit</button>
        <button class="deleteButton">Delete</button>
      </td>
    `;
    const editButton = row.querySelector('.editButton') as HTMLButtonElement;
    const deleteButton = row.querySelector('.deleteButton') as HTMLButtonElement;
    editButton.addEventListener('click', this.editRow.bind(this, row, role));
    deleteButton.addEventListener('click', this.deleteRow.bind(this, row, role.id!));
    return row;
  }

  editRow(row: HTMLTableRowElement, role: Role): void {
    row.classList.add('editing');
    this.createEditableRow(row, role);
  }

  createEditableRow(row: HTMLTableRowElement, role: Role): void {
    row.innerHTML = `
      <td><input type="text" name="name" value="${role.name}" placeholder =" Name"></td>
      <td><input type="text" name="key" value="${role.key}" placeholder =" Key"></td>
      <td><input type="text" name="description" value="${role.description}" placeholder ="Description"></td>
      <td><input type="text" name="permissions" value="${role.permissions.join(', ')}" placeholder="Permissions"></td>
      <td>${role.created_on}</td>
      <td>${role.modified_on}</td>
      <td>
        <button class="saveButton">Save</button>
        <button class="cancelButton">Cancel</button>
      </td>
    `;
    const saveButton = row.querySelector('.saveButton') as HTMLButtonElement;
    const cancelButton = row.querySelector('.cancelButton') as HTMLButtonElement;
    saveButton.addEventListener('click', this.saveRow.bind(this, row, role));
    cancelButton.addEventListener('click', this.cancelEdit.bind(this, row, role));
  }

  async saveRow(row: HTMLTableRowElement, role: Role): Promise<void> {
    const isNewRole = role.id === 0;
    
    role.name = (row.querySelector('input[name="name"]') as HTMLInputElement).value;
    role.key = (row.querySelector('input[name="key"]') as HTMLInputElement).value;
    role.description = (row.querySelector('input[name="description"]') as HTMLInputElement).value;
    const permissionsInput = (row.querySelector('input[name="permissions"]') as HTMLInputElement).value;
    
    role.permissions = permissionsInput.split(',').map((permission) => permission.trim());
    role.permissions = role.permissions.map((permission) => permission.substring(0, 255));
if (isNewRole) {
  role.created_on = new Date() ;
  role.modified_on = new Date();
   try {
    await this.roleData.create(role);
  } catch (error) {
    console.error('Error Creating Role:', error);
  }
} else {
  role.modified_on = new Date();
try {
  await this.roleData.update(role);
} catch (error) {
  console.error('Error Updating Role:', error);
}
}
  


    row.classList.remove('editing');
    const newRow = this.createRow(role);
    const editButton = newRow.querySelector('.editButton') as HTMLButtonElement;
    const deleteButton = newRow.querySelector('.deleteButton') as HTMLButtonElement;
    editButton.addEventListener('click', this.editRow.bind(this, newRow, role));
    deleteButton.addEventListener('click', this.deleteRow.bind(this, newRow, role.id!));
    row.parentNode!.replaceChild(newRow, row);
  }

  cancelEdit(row: HTMLTableRowElement, role: Role): void {
    row.classList.remove('editing');
    const newRow = this.createRow(role);
    const editButton = newRow.querySelector('.editButton') as HTMLButtonElement;
    const deleteButton = newRow.querySelector('.deleteButton') as HTMLButtonElement;
    editButton.addEventListener('click', this.editRow.bind(this, newRow, role));
    deleteButton.addEventListener('click', this.deleteRow.bind(this, newRow, role.id!));
    row.parentNode!.replaceChild(newRow, row);
  }

  async deleteRow(row: HTMLTableRowElement, roleId: number): Promise<void> {
    await this.roleData.delete(roleId);
    if (row && row.parentNode) {
    row.parentNode!.removeChild(row);
    }
  }
  

  async createRole(): Promise<void> {
    const emptyrole: Role = {
      id: 0,
      name: '',
      key: '',
      description: '',
      created_on: new Date(),
      modified_on: new Date(),
      permissions: [],
    };
    
    const newRow = this.createRow(emptyrole);

    const tbody = this.roleTable!.querySelector('tbody');
    tbody!.insertBefore(newRow, tbody!.firstChild);

    const cancelButton = newRow.querySelector('.cancelButton') as HTMLButtonElement;
    if (cancelButton) {
      cancelButton.addEventListener('click', () => this.cancelCreate(newRow, emptyrole));
    }
    this.editRow(newRow, emptyrole);
    
  }

  cancelCreate(row: HTMLTableRowElement, role: Role): void {
    if (role.id === 0) {
      row.parentNode!.removeChild(row);
    } else {
      row.classList.remove('editing');
      const newRow = this.createRow(role);
      const editButton = newRow.querySelector('.editButton') as HTMLButtonElement;
      const deleteButton = newRow.querySelector('.deleteButton') as HTMLButtonElement;
      editButton.addEventListener('click', () => this.editRow(newRow, role)); 
      deleteButton.addEventListener('click', () => this.deleteRow(newRow, role.id!)); 
      row.parentNode!.replaceChild(newRow, row);
    
    }
  }
}