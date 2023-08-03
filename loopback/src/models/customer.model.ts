// eslint-disable-next-line @typescript-eslint/naming-convention
import {Entity, hasMany, model, property} from '@loopback/repository';
import {User} from './user.model';
//@model({settings: {strict: true}})

@model({settings:{ 
  postgresql: {
    schema: 'public', 
    table: 'customers', 
  },
},
})
export class Customer extends Entity {
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
  website?: string;

  @property({
    type: 'string',
  })
  address?: string;
  @property({
    type: 'string',

    postgresql: {
      columnName: 'created_on', 
    },
  })
  created_on: string;

  @property({
    type: 'string',
    // default: () => new Date(),
    postgresql: {
      columnName: 'modified_on', 
    },
  })
  modified_on: string;
  @property({
    type: 'boolean',
  })
  editing?: boolean;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
