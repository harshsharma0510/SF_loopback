import {Entity, hasMany, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'roles',
    },
  },
})
export class Role extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  key?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property.array(String) // Define permissions as a string array
  permissions?: string[];
  

  @property({
    type: 'string',
    postgresql: {
      columnName: 'created_on',
    },
  })
  created_on: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'modified_on',
    },
  })
  modified_on: string;

  @hasMany(() => User) // Define the "hasMany" relationship between Role and User
  users?: User[];
  
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
