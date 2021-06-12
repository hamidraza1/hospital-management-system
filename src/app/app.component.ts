import { Component, OnInit } from '@angular/core';
import { AuthService } from './components/auth/auth.service';
import { PatientAuthService } from './components/patient-auth/patient-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private patientAuthService: PatientAuthService
  ) {}
  ngOnInit() {
    this.authService.autoAuthAdmin();
    this.patientAuthService.autoAuthPatient();
  }
}
