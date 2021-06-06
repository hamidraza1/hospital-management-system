import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { PermissionToSignUpService } from './permission-to-sign-up.service';

@Injectable()
export class PermissionToSignUpInterceptor implements HttpInterceptor {
  constructor(
    private permissionToSignUpService: PermissionToSignUpService,
    private authservice: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.permissionToSignUpService.getToken();
    //we will add header
    const authRequest = req.clone({
      headers: req.headers.set(
        'PermissionToSignUpAuthorization',
        'Bearer ' + authToken
      ),
    });

    //we will allow the request to continue its journey
    return next.handle(authRequest);
  }
}
