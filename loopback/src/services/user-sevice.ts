import{UserService} from '@loopback/authentication';
import { Credentials, UserRepository } from '../repositories';
import { UserProfile, securityId } from '@loopback/security';
import { User } from '../models';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { BcryptHasher } from './hash.password.dcrypt';
import { inject } from '@loopback/core';
import { PasswordHasherBindings } from '../keys';
export class MyUserService implements UserService<User, Credentials>{
constructor (
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher
){}
    //logic for logiging in
   async  verifyCredentials(credentials: Credentials): Promise<User> {
        const foundUser = await this.userRepository.findOne({
            where: {
                email: credentials.email
            }
        });
    if (!foundUser){
        throw new HttpErrors.NotFound(`User not found ${credentials.email}`);
    }
    const passwordMatched = await this.hasher.comparePassword(
      credentials.password, foundUser.password 
    );
    if(!passwordMatched) {
        throw new HttpErrors.Unauthorized('invaild password');
    }
    return foundUser;
    }
    convertToUserProfile(user: User): UserProfile {
    let userName = '';
if(user.first_name){
userName =user.first_name;
    }
if (user.last_name){
                userName = user.last_name 
              ?  `${user.first_name} ${user.last_name}`
              : user.first_name!;
}
              return {id: `${user.id}`, 
              name:userName, 
              [securityId]:`${user.id}`};
}

}