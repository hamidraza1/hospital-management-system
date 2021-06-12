import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { PatientAuthService } from '../patient-auth/patient-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  adminIsAuthenticated = false;
  doctorIsAuthenticated = false;
  patientIsAuthenticated = false;
  role: string;
  private authListenerSub: Subscription;
  private docAuthListenerSub: Subscription;
  private patientAuthListenerSub: Subscription;

  constructor(
    private authService: AuthService,
    private patientAuthService: PatientAuthService
  ) {}

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

    this.patientAuthListenerSub = this.patientAuthService
      .getAuthPatientStatusListener()
      .subscribe(
        (isPatientAuthenticated) =>
          (this.patientIsAuthenticated = isPatientAuthenticated)
      );
    this.patientIsAuthenticated =
      this.patientAuthService.getIsPatientAuthenticated();
  }

  onLogout() {
    this.authService.logout();
  }
  onPatientLogout() {
    this.patientAuthService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
    this.docAuthListenerSub.unsubscribe();
  }
}
