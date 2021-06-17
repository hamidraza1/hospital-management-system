import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/Paginator';
import { AuthService } from '../../auth/auth.service';
import { DoctorsService } from '../../doctors/doctors.service';
import { PatientAuthService } from '../../patient-auth/patient-auth.service';
import { PatientsService } from '../patients.service';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.css'],
})
export class ListPatientsComponent implements OnInit {
  AdminIsAuthenticated = false;
  PatientIsAuthenticated = false;
  ReceptionistIsAuthenticated = false;

  patients = [];
  doctors;
  doctorId;
  DoctorAssigned;

  //for pagination
  totalPatients = 0;
  patientsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10];

  constructor(
    private patientsService: PatientsService,
    private authService: AuthService,
    private patientAuthService: PatientAuthService,
    private doctorsService: DoctorsService
  ) {}

  ngOnInit(): void {
    this.patientsService.getPatients(this.patientsPerPage, this.currentPage);
    this.patientsService
      .getPatientsUpdateListener()
      .subscribe((patientsDate: { patients: any; patientsCount: number }) => {
        this.patients = patientsDate.patients;
        this.totalPatients = patientsDate.patientsCount;
        this.patients.map((patient) => {
          if (!patient.assignedDoctor) {
            return;
          }
          this.doctorsService
            .getDoctor(patient.assignedDoctor)
            .subscribe((doc) => {
              if (doc) {
                patient.docName = doc.name;
              }
            });
        });
      });
    this.PatientIsAuthenticated =
      this.patientAuthService.getIsPatientAuthenticated();
    this.AdminIsAuthenticated = this.authService.getIsAuth();
    this.ReceptionistIsAuthenticated = this.authService.getIsRecptionistAuth();
    this.doctorsService.getDoctors(1000, 1);
    this.doctorsService.getDoctorsUpdateListener().subscribe((doctorsData) => {
      this.doctors = doctorsData.doctors;
    });
  }

  onDeletePatient(patientId: string) {
    this.patientsService.deletePatient(patientId).subscribe(() => {
      this.patientsService.getPatients(this.patientsPerPage, this.currentPage);
    });
  }
  onDoctorAssignSelector(event: any) {
    this.doctorId = event.value;
  }
  onAssignDoctor(patientId: string) {
    if (!this.doctorId) {
      return;
    }
    this.patientsService
      .AssignDocToPatient(patientId, this.doctorId)
      .subscribe((response) => {
        /* window.location.reload(); */
        console.log(response);
      });

    this.patientsService
      .AssignPatientsToDoctor(patientId, this.doctorId)
      .subscribe((response) => {
        /* window.location.reload(); */
        console.log(response);
      });

    this.doctorId = null;
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.patientsPerPage = pageData.pageSize;
    this.patientsService.getPatients(this.patientsPerPage, this.currentPage);
  }
}
