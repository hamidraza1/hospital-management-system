import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  adminIsAuthenticated = false;
  doctorIsAuthenticated = false;
  role: string;
  private authListenerSub: Subscription;
  private docAuthListenerSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.adminIsAuthenticated = isAuthenticated;
      });

    this.adminIsAuthenticated = this.authService.getIsAuth();
    this.docAuthListenerSub = this.authService
      .getDoctorAuthStatusListener()
      .subscribe((isDocAuthenticated) => {
        this.doctorIsAuthenticated = isDocAuthenticated;
      });
    this.doctorIsAuthenticated = this.authService.getIsDoctorAuth();
    this.authService.getRoleStatusListener().subscribe((role) => {
      this.role = role;
    });
    this.role = this.authService.getRole();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
    this.docAuthListenerSub.unsubscribe();
  }
}
