import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PermissionToSignUpService } from './permission-to-sign-up.service';

@Injectable()
export class PermissionToSignUpInterceptor implements HttpInterceptor {
  constructor(private permissionToSignUpService: PermissionToSignUpService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.permissionToSignUpService.getToken();
    //we will add header
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken),
    });
    //we will allow the request to continue its journey
    return next.handle(authRequest);
  }
}
