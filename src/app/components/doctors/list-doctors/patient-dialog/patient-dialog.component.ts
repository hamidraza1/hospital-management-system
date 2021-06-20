import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.css'],
})
export class PatientDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    console.log(this.data.Patients);
  }
}
