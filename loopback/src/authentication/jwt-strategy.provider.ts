
import { Provider } from '@loopback/context';
import { JWTService } from '../services/jwt-services';
import { JWTStrategy } from '../authentication/jwt-strategy';
import { TokenServicesBindings } from '../keys';
import { JWTAuthenticationStrategy } from '@loopback/authentication-jwt';
import { inject } from '@loopback/context';
export class JWTStrategyProvider implements Provider<JWTAuthenticationStrategy> {
  constructor(
    @inject(TokenServicesBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
  ) {}

  value(): JWTAuthenticationStrategy {
    return new JWTAuthenticationStrategy(this.jwtService);
  }
}
