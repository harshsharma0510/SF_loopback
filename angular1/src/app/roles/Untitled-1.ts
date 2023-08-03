// import { Component, OnInit } from '@angular/core';
// import { Role, role } from '../role.model';
// import { RolesService } from './roles.service';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { roleData } from '../roles/role.service';
// import { formatDate } from '@angular/common';

// @Component({
//   selector: 'app-roles',
//   templateUrl: './roles.component.html',
//   styleUrls: ['./roles.component.css'],
// })
// export class RolesComponent implements OnInit {
//   Roles: Role[] = [];
//   selectedRole: Role | null = null;
//   rolesForSelectedRole: role[] = [];
//   addingRole: boolean = false;
//   permissionsArray: string[] = [];
//   RoleForm!: FormGroup;
//   editedRole: Role | null = null;

//   constructor(private fb: FormBuilder, private rolesService: RolesService, private roleData: roleData) {}

//   ngOnInit(): void {
//     this.getAllRoles();
//     this.initForm();
//     this.initPermissionsArray();
//   }
//   initPermissionsArray(): void {
//     this.permissionsArray = []; // Initialize the permissionsArray with empty values or any default values
//   }

//   initForm(): void {
    
//     const currentDate = new Date();
//     const formattedDate = this.formatDate(currentDate);
//     this.RoleForm = this.fb.group({
//       name: ['', Validators.required],
//       key: ['', Validators.required],
//       description: ['', Validators.required],
//       created_on: [formattedDate],
//       modified_on: [formattedDate],
//       permissions: this.fb.array([]),
//     });
//   }

//   getAllRoles(): void {
//     this.rolesService.getAllRoles().subscribe((Roles: Role[]) => {
//       this.Roles = Roles;
//     });
//   }
//   isRoleBeingEdited(Role: Role): boolean {
//     return this.editedRole === Role;
//   }
//   addPermission() {
//     const permissionsArray = this.RoleForm.get('permissions') as FormArray;
//     permissionsArray.push(this.fb.control(''));
//   }
//   showroles(Role: Role): void {
//     if (!this.isRoleBeingEdited(Role)) {
//       this.selectedRole = Role;
//       this.roleData.getrolesForRole(Role.id ?? 0).subscribe((roles: any[]) => {
//         this.rolesForSelectedRole = roles.filter((role) => role.RoleId === Role.id);
//       });
//       this.editedRole = null;
//       this.addingRole = false;
//     }
//   }
  
//   addRole(): void {
//     this.addingRole = true;
//     this.initForm();
//     this.editedRole = null;
//   }

//   saveRole(): void {
//     console.log('Save button clicked');
    
//     if (this.RoleForm.valid) {
//       const newRole: Role = this.RoleForm.value;
//       // const permissionsArray: string[] = [];
//       // const permissionsFormArray = this.RoleForm.get('permissions') as FormArray;
//       // permissionsFormArray.controls.forEach((control) => {
//       //   const permission = control.value.trim(); // Trim the input to remove any leading/trailing spaces
//       //   if (permission !== '') { // Only add non-empty permissions to the array
//       //     permissionsArray.push(permission);
//       //   }
//       // });
//       // newRole.permissions = permissionsArray;
//       // if (!newRole.permissions) {
//       //   newRole.permissions = [];
//       // }
//       //newRole.permissions = newRole.permissions || [];
//       if (!newRole.permissions) {
//         this.RoleForm.patchValue({ permissions: [] });
//       }
//       console.log('New Role Data:', newRole);
//       this.rolesService.createRole(newRole).subscribe(
//         () => {
          
//           this.getAllRoles();
//           this.addingRole = false; 
//           this.selectedRole = null; 
//         },
//         (error: any) => {
          
//           console.error('Error creating Role:', error);
          
//         }
//       );
//     }
//   }

//   cancelAddRole(): void {
//     this.addingRole = false; 
//     this.selectedRole = null; 
//     this.initForm(); 
//     this.editedRole = null;
//   }

//   private formatDate(date: Date): string {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const seconds = String(date.getSeconds()).padStart(2, '0');

//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//   }

//   editRole(Role: Role): void {
//     this.selectedRole = Role;
//     this.editedRole = Role;
//   }

//   updateRole(Role: Role): void {
//     if (Role.id === undefined) {
//       Role.id = null;
//     }
//     if (Role.id) {
      
//       console.log('Updating Role:', Role); 
//       this.rolesService.updateRole(Role.id, Role).subscribe(() => {
//         this.getAllRoles();
//         this.selectedRole = null; 
//       });
//     } else {
     
//       console.log('Creating New Role:', Role);
//       this.rolesService.createRole(Role).subscribe(() => {
//         this.getAllRoles();
//         this.selectedRole = null; 
//       });
//     }
//   }

//   deleteRole(Role: Role): void {
//     this.rolesService.deleteRole(Role.id ?? 0).subscribe(() => {
//       this.getAllRoles();
//       this.selectedRole = null;
//     });
//   }

//   cancelEdit(Role: Role): void {
//     if (!Role.id) {
      
//       this.Roles = this.Roles.filter((c) => c !== Role);
//     }
//     this.selectedRole = null;
//   }
// }

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Role, User } from '../user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class RolesService {
//   private apiUrl = 'http://localhost:3000/roles';

//   constructor(private http: HttpClient) {}

//   getAllRoles(): Observable<Role[]> {
//     return this.http.get<Role[]>(this.apiUrl);
//   }

//   getRoleById(id: number): Observable<Role> {
//     const url = `${this.apiUrl}/${id}`;
//     return this.http.get<Role>(url);
//   }

//   createRole(Role: Role): Observable<Role> {
//     return this.http.post<Role>(this.apiUrl, Role);
//   }

//   updateRole(id: number,Role: Role): Observable<Role> {
//     const url = `${this.apiUrl}/${id}`;
//     return this.http.put<Role>(url, Role);
//   }

//   deleteRole(id: number): Observable<void> {
//     const url = `${this.apiUrl}/${id}`;
//     return this.http.delete<void>(url);
//   }
//   getUsersForRole(RoleId: number): Observable<User[]> {
//     return this.http.get<User[]>(`${this.apiUrl}?RoleId=${RoleId}`);
//   }
// }