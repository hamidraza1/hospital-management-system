import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorsService } from '../../doctors/doctors.service';
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
  assignedDoctorId: string;
  assignedDoctorDetails: any;

  constructor(
    private patientAuthService: PatientAuthService,
    private patientsService: PatientsService,
    private doctorsService: DoctorsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientEmail = this.patientAuthService.getPatientEmail();
    this.patientsService
      .getPatientByEmail(this.patientEmail)
      .subscribe((response) => {
        console.log(response.patient);
        this.patient = response.patient;
        this.patientId = response.patient?._id;
        this.assignedDoctorId = response.patient.assignedDoctor || null;
        this.doctorsService.getDoctors(1000, 1);
        this.doctorsService
          .getDoctorsUpdateListener()
          .subscribe((doctorsData) => {
            if (this.assignedDoctorId) {
              doctorsData.doctors.map((doc) => {
                if (doc.id === this.assignedDoctorId) {
                  this.assignedDoctorDetails = doc;
                }
              });
            }
          });
        /* console.log(this.assignedDoctorDetails); */
      });
  }

  onDeletePatient(patientId: string) {
    this.patientsService.deletePatient(patientId).subscribe(() => {
      this.router.navigate(['/patient-details']);
    });
  }
}
