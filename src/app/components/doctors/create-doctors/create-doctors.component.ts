import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { doctor } from '../doctor.model';
import { DoctorsService } from '../doctors.service';

@Component({
  selector: 'app-create-doctors',
  templateUrl: './create-doctors.component.html',
  styleUrls: ['./create-doctors.component.css'],
})
export class CreateDoctorsComponent implements OnInit {
  doctors: doctor[];
  private mode = 'create';
  private doctorId: string;
  public doctor: doctor;
  private loading: boolean = false;

  constructor(
    private doctorsService: DoctorsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('doctorId')) {
        this.mode = 'edit';
        this.doctorId = paramMap.get('doctorId');
        //
        this.loading = true;
        this.doctorsService.getDoctor(this.doctorId).subscribe((doctor) => {
          //
          this.loading = false;
          this.doctor = {
            id: doctor._id,
            name: doctor.name,
            email: doctor.email,
            speciality: doctor.speciality,
          };
        });
      } else {
        this.mode = 'create';
        this.doctorId = null;
      }
    });
  }

  onSaveDoctor(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    if (this.mode === 'create') {
      this.doctorsService.addDoctors(
        form.value.name,
        form.value.email,
        form.value.speciality
      );
    } else {
      this.doctorsService.updateDoctor(
        this.doctorId,
        form.value.name,
        form.value.email,
        form.value.speciality
      );
    }
    form.resetForm();
  }
}
