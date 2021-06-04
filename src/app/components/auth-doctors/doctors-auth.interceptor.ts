//Feature provided by http client
//to manipulate any outgoing request
//e.g to attach token to outgoing requests

import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoctorsAuthService } from './doctors-auth.service';

@Injectable()
export class DoctorAuthInterceptor implements HttpInterceptor {
  constructor(private doctorsAuthService: DoctorsAuthService) {}

  // Angular call this method on the requests leaving/outgoing from this app(from DoctorsAuthService)
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const DoctorAuthToken = this.doctorsAuthService.getToken();
    //we will add header
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + DoctorAuthToken),
    });
    //we will allow the request to continue its journey
    return next.handle(authRequest);
  }
}
