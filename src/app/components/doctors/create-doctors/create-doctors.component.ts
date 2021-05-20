import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { doctor } from '../doctor.model';
import { DoctorsService } from '../doctors.service';

@Component({
  selector: 'app-create-doctors',
  templateUrl: './create-doctors.component.html',
  styleUrls: ['./create-doctors.component.css'],
})
export class CreateDoctorsComponent {
  doctors: doctor[];

  constructor(private doctorsService: DoctorsService) {}

  onAddDoctor(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.doctorsService.addDoctors(
      form.value.name,
      form.value.email,
      form.value.speciality
    );

    form.resetForm();
  }
}
