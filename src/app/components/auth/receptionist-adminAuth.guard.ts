import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class ReceptionistAdminAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isAuth = this.authService.getIsAuth();
    const isReceptionistAuth = this.authService.getIsRecptionistAuth();
    if (!isAuth && !isReceptionistAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth || isReceptionistAuth;
  }
}
