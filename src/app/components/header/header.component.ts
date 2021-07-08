import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DoctorsService } from '../doctors/doctors.service';
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
  receptionistIsAuthenticated = false;
  role: string;
  docNameSpeciality;
  private authListenerSub: Subscription;
  private docAuthListenerSub: Subscription;
  private patientAuthListenerSub: Subscription;
  private receptionistAuthListenerSub: Subscription;

  constructor(
    private authService: AuthService,
    private patientAuthService: PatientAuthService,
    private doctorsService: DoctorsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    /*-------------------- Role Status------------------- */
    this.authService.getRoleStatusListener().subscribe((role) => {
      this.role = role;
    });
    this.role = this.authService.getRole();

    /*-------------------- Admin Status------------------- */
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.adminIsAuthenticated = isAuthenticated;
      });
    this.adminIsAuthenticated = this.authService.getIsAuth();

    /*-------------------- Doctor Status------------------- */
    this.docAuthListenerSub = this.authService
      .getDoctorAuthStatusListener()
      .subscribe((isDocAuthenticated) => {
        this.doctorIsAuthenticated = isDocAuthenticated;
      });
    this.doctorIsAuthenticated = this.authService.getIsDoctorAuth();

    /*-------------------- Patient Status------------------- */
    this.patientAuthListenerSub = this.patientAuthService
      .getAuthPatientStatusListener()
      .subscribe(
        (isPatientAuthenticated) =>
          (this.patientIsAuthenticated = isPatientAuthenticated)
      );
    this.patientIsAuthenticated =
      this.patientAuthService.getIsPatientAuthenticated();
    /*-------------------- Receptionist Status------------------- */
    this.receptionistAuthListenerSub = this.authService
      .getRecptionistAuthStatusListener()
      .subscribe(
        (isRecptionistAuthenticated) =>
          (this.receptionistIsAuthenticated = isRecptionistAuthenticated)
      );
    this.receptionistIsAuthenticated = this.authService.getIsRecptionistAuth();
    /*------------------- doctor Name emission -------------------*/
    this.doctorsService.doctorName.subscribe(
      (docName) => (this.docNameSpeciality = docName)
    );
  }

  onLogout() {
    this.authService.logout();
  }
  onPatientLogout() {
    this.patientAuthService.logout();
  }

  onAdminDocLogin() {
    this.patientAuthService.logout();
    this.router.navigate(['/login']);
  }

  onPatientLogin() {
    this.authService.logout();
    this.router.navigate(['/patient-login']);
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
    this.docAuthListenerSub.unsubscribe();
    this.patientAuthListenerSub.unsubscribe();
    this.receptionistAuthListenerSub.unsubscribe();
  }
}
