import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientAuthService } from '../../patient-auth/patient-auth.service';
import { PatientsService } from '../patients.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css'],
})
export class PatientDetailsComponent implements OnInit {
  patientId: string;
  patientEmail: string;
  patient: any;

  constructor(
    private patientAuthService: PatientAuthService,
    private patientsService: PatientsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientEmail = this.patientAuthService.getPatientEmail();
    this.patientsService
      .getPatientByEmail(this.patientEmail)
      .subscribe((response) => {
        this.patient = response.patient;
        this.patientId = response.patient?._id;
      });
  }
  onDeletePatient(patientId: string) {
    this.patientsService.deletePatient(patientId).subscribe(() => {
      this.router.navigate(['/patient-details']);
    });
  }
}
