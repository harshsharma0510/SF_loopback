import { AuthenticationStrategy } from "@loopback/authentication";
import { UserProfile } from "@loopback/security";
import { Request} from "express";
import { TokenServicesBindings } from "../keys";
import { JWTService } from "../services/jwt-services";
import {HttpErrors} from "@loopback/rest"
import {Provider, inject} from '@loopback/core';
import { ValueOrPromise } from "@loopback/context";
import { JWTAuthenticationStrategy } from "@loopback/authentication-jwt";

export class JWTStrategy implements  Provider<AuthenticationStrategy | AuthenticationStrategy[] | undefined> {
    constructor(
      @inject(TokenServicesBindings.TOKEN_SERVICE)
      public jwtService: JWTService,
    ) {}

value(): JWTAuthenticationStrategy {
    return new JWTAuthenticationStrategy(this.jwtService);
  }
    name: string = 'jwt';
    async authenticate(request: Request): Promise<UserProfile | undefined> {
      const token: string = this.extractCredentials(request);
      const userProfile = await this.jwtService.verifyToken(token);
      return Promise.resolve(userProfile);
    }
    extractCredentials(request: Request): string {
      if (!request.headers.authorization) {
        throw new HttpErrors.Unauthorized('Authorization header is missing');
      }
  
      const authHeaderValue = request.headers.authorization;
  
      if (!authHeaderValue.startsWith('Bearer')) {
        throw new HttpErrors.Unauthorized(`
        Authorization header is not type of 'Bearer'.
        `);
      }
      const parts = authHeaderValue.split(' ');
      if (parts.length !== 2) {
        throw new HttpErrors.Unauthorized(`
       Authorization header has too many parts it must follow this pattern 'Bearer xx.yy.zz' where xx.yy.zz should be valid token
      `);
      }
      const token = parts[1];
      return token;
    }
  }

