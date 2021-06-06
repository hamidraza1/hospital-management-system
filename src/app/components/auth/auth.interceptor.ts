//Feature provided by http client
//to manipulate any outgoing request
//e.g to attach token to outgoing requests

import {
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authservice: AuthService) {}

  // Angular call this method on the requests leaving/outgoing from this app(from AuthService)
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authservice.getToken();
    const Role = this.authservice.getRole();
    //we will add header
    const authRequest = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + authToken + ' ' + Role
      ),
    });

    //we will allow the request to continue its journey
    return next.handle(authRequest);
  }
}
