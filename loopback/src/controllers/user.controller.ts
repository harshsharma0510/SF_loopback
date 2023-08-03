/* eslint-disable @typescript-eslint/naming-convention */
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import { inject } from '@loopback/context';
import { BcryptHasher } from '../services/hash.password.dcrypt';
import { validateCredentials } from '../services/validator';
import _ from 'lodash';
import { CredentialsRequestBody } from './user.controller.spec';
import { MyUserService } from '../services/user-sevice';
import { JWTService } from '../services/jwt-services';
import { PasswordHasherBindings, TokenServicesBindings, UserServiceBindings } from '../keys';
import { TokenServiceBindings } from '@loopback/authentication-jwt';
import passport from 'passport';
import { authenticate } from '@loopback/authentication';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher:BcryptHasher,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService : MyUserService,
    @inject (TokenServicesBindings.TOKEN_SERVICE)
    public jwtService : JWTService
  ) {}
@post('/users/signup')
@response(200, {
  description: 'User Signup',
  content: { 'application/json': { schema: getModelSchemaRef(User) } },
})

async signup(
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {
          title: 'NewUserSignUp',
          exclude: ['id'],
        }),
      },
    },
  })
  user: Omit<User,'id'>,
): Promise<User> {

    validateCredentials(_.pick(user, ['email','password']));
    user.password = await  this.hasher.hashPassword(user.password);
  return this.userRepository.create(user);
}

@post('/user/login', {
  responses: {
    '200': {
      description: 'token is valid',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
})
async login(
  @requestBody({
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
          },
          required: ['email', 'password'],
        },
      },
    },
  }

  ) credentials: Credentials,
): Promise<{ token: string }> {
//credentials validation

const user = await this.userService.verifyCredentials(credentials);
console.log(user); 
const userProfile = await this.userService.convertToUserProfile(user);
console.log(userProfile);

//genrating web token
const token = await this.jwtService.generateToken(userProfile);
return Promise.resolve({ token });
}


@post('/users')
  @response(200, {
    description: 'User model instance',
    content: { 'application/json': { schema: getModelSchemaRef(User) } },
  })

  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    try {
      
      if (!user.email || !user.first_name || !user.last_name) {
        
        throw new Error('Required fields (email, first_name, last_name) are missing');
      }
    return this.userRepository.create(user);
  } catch (error) {
    
    throw {
      statusCode: 422,
      message: error.message,
    };
  }
}

  @get('/users/count')

  @response(200, {
    description: 'User model count',
    content: { 'application/json': { schema: CountSchema } },
  })
 @authenticate('jwt')
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
 
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, { includeRelations: true }),
        },
      },
    },
  })
  @authenticate('jwt')
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter,{});
  }

  @patch('/users')

  @response(200, {
    description: 'User PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, { includeRelations: true }),
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(User, { exclude: 'where' }) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
 
  @response(204, {
    description: 'User PATCH success',
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  
  @response(204, {
    description: 'User PUT success',
  })
 @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
 
  @response(204, {
    description: 'User DELETE success',
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}