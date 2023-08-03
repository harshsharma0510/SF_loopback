import { AuthenticationBindings, TokenService, UserService } from "@loopback/authentication";
import { BindingKey } from "@loopback/core"
import { Credentials } from "./repositories";
import { User } from "./models";
import { PasswordHasher } from '../src/services/hash.password.dcrypt';
import { JWTService } from "./services/jwt-services";
import { MyUserService } from "./services/user-sevice";

export namespace TokenServicesConstants{
    export const TOKEN_SECRET_VALUE= '11022023';
    export const TOKEN_EXPIRES_IN_VALUE = '7h';
}
export namespace TokenServicesBindings{
    export const TOKEN_EXPIRES_IN =BindingKey.create<string>(
'authentication.jwt.expiresIn'
    );
    export const TOKEN_SECRET =BindingKey.create<string>(
      'authentication.jwt.secret'  
        );
        export const TOKEN_SERVICE =BindingKey.create<TokenService>(
       'service.jwt.service', 
            );
}
export namespace PasswordHasherBindings{
    export const PASSWORD_HASHER =BindingKey.create<PasswordHasher>(
'service.hasher'
    );
    export const ROUND =BindingKey.create<number>(
        'service.hasher.round'
            );       
}
export  namespace UserServiceBindings{
    export const USER_SERVICE =BindingKey.create<UserService<User, Credentials>>(
'service.user.service'
    );

}
