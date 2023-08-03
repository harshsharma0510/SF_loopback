import { promisify } from "util";
import { UserProfile, securityId } from "@loopback/security";
import { HttpErrors } from "@loopback/rest";
import { inject } from "@loopback/core";
import { TokenServicesBindings } from '../keys';
import { token } from "morgan";

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);
export class JWTService{
    @inject(TokenServicesBindings.TOKEN_SECRET) 
    public readonly jwtSecret: string;
    @inject(TokenServicesBindings.TOKEN_EXPIRES_IN) 
    public readonly jwtExpiresIn: string;

async generateToken(userProfile: UserProfile): Promise<string>{
if(!userProfile){
    throw new HttpErrors.Unauthorized('Error generating token : userprofile is null');
}
let token = '';
try {
     token = await signAsync(userProfile, this.jwtSecret, {
       expiresIn: this.jwtExpiresIn, 
    })
} catch (err) {
    throw new HttpErrors.Unauthorized(`error generating token ${err}`);
}
return token;
}
    async verifyToken(token: string): Promise<UserProfile> {
        if (!token) {
          throw new HttpErrors.Unauthorized(
            `Error verifying token : 'token' is null`,
          );
        }
        let userProfile: UserProfile;
      

   return Promise.resolve({id: '1', name: 'new', [securityId]: '1'});
    }
  }
