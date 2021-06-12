import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PatientAuthService } from '../patient-auth.service';

@Component({
  selector: 'app-patient-signup',
  templateUrl: './patient-signup.component.html',
  styleUrls: ['./patient-signup.component.css'],
})
export class PatientSignupComponent implements OnInit {
  constructor(private patientAuthService: PatientAuthService) {}

  ngOnInit(): void {}

  onPatientSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.patientAuthService.createPatient(
      form.value.email,
      form.value.password
    );
  }
}
