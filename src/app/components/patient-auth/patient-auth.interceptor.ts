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
import { PatientAuthService } from './patient-auth.service';

@Injectable()
export class PatientAuthInterceptor implements HttpInterceptor {
  constructor(private patientAuthService: PatientAuthService) {}

  // Angular call this method on the requests leaving/outgoing from this app(from AuthService)
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const patientAuthToken = this.patientAuthService.getToken();
    //we will add header
    const authRequest = req.clone({
      headers: req.headers.set(
        'PatientAuthorization',
        'Bearer ' + patientAuthToken
      ),
    });

    //we will allow the request to continue its journey
    return next.handle(authRequest);
  }
}
