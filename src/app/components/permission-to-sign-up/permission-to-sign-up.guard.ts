import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionToSignUpService } from './permission-to-sign-up.service';

@Injectable()
export class PermissionToSignUpServiceGuard implements CanActivate {
  constructor(
    private permissionToSignUpService: PermissionToSignUpService,
    private router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isAuth = this.permissionToSignUpService.getIsAuth();
    if (!isAuth) {
      this.router.navigate(['/permission-for-admin-or-doctor/signup']);
    }
    return isAuth;
  }
}
