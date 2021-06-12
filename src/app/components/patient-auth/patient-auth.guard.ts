import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { PatientAuthService } from './patient-auth.service';

@Injectable()
export class PatientAuthGuard implements CanActivate {
  constructor(
    private patientAuthService: PatientAuthService,
    private router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isAuth = this.patientAuthService.getIsPatientAuthenticated();
    if (!isAuth) {
      this.router.navigate(['/patient-login']);
    }
    return isAuth;
  }
}
