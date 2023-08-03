import isemail from 'isEmail';
import { Credentials } from '../repositories/user.repository';
import { HttpErrors } from '@loopback/rest';
export function validateCredentials(credentials: Credentials){
    if(!isemail.validate(credentials.email)){
        throw new HttpErrors.UnprocessableEntity('invalid email')   
    }
    if(credentials.password.length <8){
throw new HttpErrors.UnprocessableEntity('password length should be more than 8 characters')
    }
}
