// eslint-disable-next-line @typescript-eslint/naming-convention
import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Customer} from './customer.model';
import {Role} from './role.model';
//@model({settings: {strict: false}})
@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'users',
    },
  },
})
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  username: string;

  @property({
    type: 'string',
  })
  password: string;

  @property({
    type: 'string',
  })
  first_name?: string;

  @property({
    type: 'string',
  })
  middle_name?: string;

  @property({
    type: 'string',
  })
  last_name?: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  phone_number?: string;

  @property({
    type: 'string',
  })
  address?: string;

  
  

  @property({
    type: 'string',
    postgresql: {
      columnName: 'created_at',
    },
  })
  created_at: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'modified_on',
    },
  })
  modified_on: string;

  @belongsTo(() => Customer)
  customerId: number;

  @belongsTo(() => Role)
  roleId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
