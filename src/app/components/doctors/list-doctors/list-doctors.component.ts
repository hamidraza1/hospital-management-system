import { Component, OnDestroy, OnInit } from '@angular/core';
import { doctor } from '../doctor.model';
import { DoctorsService } from '../doctors.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/Paginator';
import { AuthService } from '../../auth/auth.service';
import { PatientsService } from '../../patients/patients.service';
import { MatDialog } from '@angular/material/dialog';
import { PatientDialogComponent } from './patient-dialog/patient-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-doctors',
  templateUrl: './list-doctors.component.html',
  styleUrls: ['./list-doctors.component.css'],
})
export class ListDoctorsComponent implements OnInit, OnDestroy {
  doctors = [];

  //for pagination
  totalDoctors = 0;
  doctorsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10];

  userId: string;
  doctorId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  private authDoctorStatusSub: Subscription;
  public loading: boolean = false;
  public adminIsAuthenticated = false;
  public doctorIsAuthenticated = false;
  public receptionistIsAuthenticated = false;
  public doctorEmail: string;

  constructor(
    private doctorsService: DoctorsService,
    private authService: AuthService,
    private patientsService: PatientsService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    //
    this.loading = true;
    this.doctorsService.getDoctors(this.doctorsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.doctorId = this.authService.getDoctorId();
    this.postsSub = this.doctorsService
      .getDoctorsUpdateListener()
      .subscribe((doctorsData: { doctors: doctor[]; doctorCount: number }) => {
        //
        this.loading = false;
        this.totalDoctors = doctorsData.doctorCount;
        this.doctors = doctorsData.doctors;

        //getting details of assigned patinets
        this.doctors.map((doctor) => {
          if (!doctor.assignedPatients) {
            return;
          }
          doctor.assignedPatients.map((assignedPatientId) =>
            this.patientsService
              .getPatient(assignedPatientId)
              .subscribe((patientData) => {
                doctor.assignedPatients[
                  doctor.assignedPatients.indexOf(assignedPatientId)
                ] = patientData.patient;
              })
          );
        });
      });
    this.adminIsAuthenticated = this.authService.getIsAuth();
    this.doctorIsAuthenticated = this.authService.getIsDoctorAuth();
    this.doctorEmail = this.authService.getDoctorEmail();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.adminIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.authDoctorStatusSub = this.authService
      .getDoctorAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.doctorIsAuthenticated = isAuthenticated;
        this.doctorId = this.authService.getDoctorId();
      });

    this.receptionistIsAuthenticated = this.authService.getIsRecptionistAuth();
    this.authService
      .getRecptionistAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.receptionistIsAuthenticated = isAuthenticated;
      });
  }

  onOpenDialog(assignedPatients: any) {
    this.dialog.open(PatientDialogComponent, {
      width: '500px',
      data: { Patients: assignedPatients },
    });
  }

  onDeletedoctor(doctorId: string) {
    this.loading = true;
    this.doctorsService.deletedoctor(doctorId).subscribe(() => {
      this.doctorsService.getDoctors(this.doctorsPerPage, this.currentPage);
    });
  }

  doctorDetails(doctor) {
    this.router.navigate([`/doctor-details/${doctor.id}`]);
  }

  onChangedPage(pageData: PageEvent) {
    this.loading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.doctorsPerPage = pageData.pageSize;
    this.doctorsService.getDoctors(this.doctorsPerPage, this.currentPage);
  }
  ngOnDestroy() {
    //when we switch between pages, that subscription should be unsubscribed to prevent memory leak
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
    this.authDoctorStatusSub.unsubscribe();
  }
}
