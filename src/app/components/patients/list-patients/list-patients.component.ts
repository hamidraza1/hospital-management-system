import { Component, OnInit } from '@angular/core';
import { PatientsService } from '../patients.service';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.css'],
})
export class ListPatientsComponent implements OnInit {
  patients = [];

  constructor(private patientsService: PatientsService) {}

  ngOnInit(): void {
    this.patientsService.getPatients();
    this.patientsService.patients.subscribe((patients) => {
      this.patients = patients;
    });
  }
}
