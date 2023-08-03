import {MiddlewareSequence, RequestContext} from '@loopback/rest';

// export class MySequence extends MiddlewareSequence {}
import {inject} from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,

  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import { AuthenticateFn, AuthenticationBindings } from '@loopback/authentication';

import {AUTHENTICATION_STRATEGY_NOT_FOUND, USER_PROFILE_NOT_FOUND} from '@loopback/authentication'
const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
  ) {}

  async handle(context: RequestContext) {
    try {
      context.response.header('Access-Control-Allow-Origin', '*');
      context.response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
      context.response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      context.response.header('Access-Control-Allow-Credentials', 'true');



      const {request, response} = context;
      console.log(`${request.method} ${request.url}`);
      // Handle preflight request (OPTIONS)

    
    
    if (request.method === 'OPTIONS') {
      // Return a 200 response for preflight requests
      this.send(response, 'OK');
      return;
    }
      const route = this.findRoute(request);
     await this.authenticateRequest(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);


    } catch (error){
      if(   
             error.code ===AUTHENTICATION_STRATEGY_NOT_FOUND ||
        error.code === USER_PROFILE_NOT_FOUND
      ){
        Object.assign(error, {statusCode:401})
      }
      this.reject(context, error);
    }
  }
}
