import { Component, OnInit } from '@angular/core';
import { PatientAuthService } from '../patient-auth.service';

@Component({
  selector: 'app-patient-login',
  templateUrl: './patient-login.component.html',
  styleUrls: ['./patient-login.component.css'],
})
export class PatientLoginComponent implements OnInit {
  responseStatus: any;
  constructor(private patientAuthService: PatientAuthService) {}

  ngOnInit(): void {}

  onPatientLogin(form) {
    if (form.invalid) {
      return;
    }
    this.patientAuthService.loginPatient(form.value.email, form.value.password);
    this.patientAuthService
      .getResponseStatusListener()
      .subscribe((status) => (this.responseStatus = status));
  }
}
