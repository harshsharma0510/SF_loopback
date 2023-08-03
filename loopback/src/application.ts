import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings, RestServer} from '@loopback/rest';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {CustomerController, RoleController, UserController} from './controllers';
import {DbDataSource} from './datasources';
import {MySequence} from './sequence';
import { BcryptHasher } from './services/hash.password.dcrypt';
import { MyUserService } from './services/user-sevice';
import { JWTService } from './services/jwt-services';
import { PasswordHasherBindings, TokenServicesBindings, TokenServicesConstants, UserServiceBindings } from './keys';
import { AuthenticationBindings, AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { JWTStrategy } from './authentication/jwt-strategy';
import { JWTStrategyProvider } from './authentication/jwt-strategy.provider';


export {ApplicationConfig};

export class LoopbackApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  public readonly myrestServer: RestServer;

  constructor(options?: ApplicationConfig) {
    super(options);
    
    this.sequence(MySequence);
    this.static('/', path.join(__dirname, '../public'));
    
    this.component(AuthenticationComponent);
    this.setupBinding();

    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);
  


    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.setupDatasources();
    this.setupControllers();
    
    this.projectRoot = __dirname;

    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
  setupBinding(): void {
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(PasswordHasherBindings.ROUND).to(10);
    this.bind(TokenServicesBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    this.bind(TokenServicesBindings.TOKEN_SECRET).to(TokenServicesConstants.TOKEN_SECRET_VALUE);
    this.bind(TokenServicesBindings.TOKEN_EXPIRES_IN).to(TokenServicesConstants.TOKEN_EXPIRES_IN_VALUE);
    this.bind('authentication.jwt').toProvider(JWTStrategyProvider);
  
  }

  setupDatasources() {
    const config = {
      name: 'db',
      connector: 'postgresql',
      url: '',
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: '05101996',
      database: 'loopback',
      debug :true,
    };

    this.dataSource(DbDataSource, config);
  }

  setupControllers(): void {
    this.controller(CustomerController);
    this.controller(RoleController);
    this.controller(UserController);
  }
}



export async function main(options: ApplicationConfig = {}) {
  const app = new LoopbackApplication(options);
  await app.boot();
  await app.start();

  // Call super.start() here, after the app has started
  await app.restServer.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      gracePeriodForClose: 5000,
      openApiSpec: {
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
function morgan(arg0: string): import("@loopback/rest").ExpressMiddlewareFactory<unknown> {
  throw new Error('Function not implemented.');
}

