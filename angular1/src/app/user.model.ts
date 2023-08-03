export interface User {
    id?: number | null;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    customerId: number;
    roleId: number;
    created_at: Date;
    modified_on: Date;
    username: string;
    password: string;
    editing?: boolean;
  }
  
  export interface Customer {
    id?: number | null;
    name: string;
    website: string;
    address: string;
    created_on: Date;
    modified_on: Date;
    editing? : boolean;
  }
  
  export interface Role {
    id?: number| null;
    name: string;
    key: string;
    description: string;
    created_on: Date;
    modified_on: Date;
    permissions: string[],
  }