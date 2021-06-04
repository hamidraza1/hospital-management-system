import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/Paginator';
import { PatientsService } from '../patients.service';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.css'],
})
export class ListPatientsComponent implements OnInit {
  patients = [];

  //for pagination
  totalPatients = 0;
  patientsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10];

  constructor(private patientsService: PatientsService) {}

  ngOnInit(): void {
    this.patientsService.getPatients(this.patientsPerPage, this.currentPage);
    this.patientsService
      .getPatientsUpdateListener()
      .subscribe((patientsDate: { patients: any; patientsCount: number }) => {
        this.patients = patientsDate.patients;
        this.totalPatients = patientsDate.patientsCount;
      });
  }

  onDeletePatient(patientId: string) {
    this.patientsService.deletePatient(patientId).subscribe(() => {
      this.patientsService.getPatients(this.patientsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.patientsPerPage = pageData.pageSize;
    this.patientsService.getPatients(this.patientsPerPage, this.currentPage);
  }
}
