import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { PatientAuthService } from '../patient-auth/patient-auth.service';
import { AuthService } from './auth.service';

@Injectable()
export class PatientAdminAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private patientAuthService: PatientAuthService,
    private router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isAuth = this.authService.getIsAuth();
    const isPatientAuth = this.patientAuthService.getIsPatientAuthenticated();

    if (!isPatientAuth && !isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth || isPatientAuth;
  }
}
