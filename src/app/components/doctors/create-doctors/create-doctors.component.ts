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
  selectedFile: File = null;
  imagepreview: any;
  languageLevel = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  private mode = 'create';
  private doctorId: string;
  public doctor: any;
  public loading: boolean = false;

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
          console.log(doctor);
          this.doctor = {
            id: doctor._id,
            name: doctor.name,
            email: doctor.email,
            speciality: doctor.speciality,
            imagePath: doctor.imagePath,
            experience: doctor.experience,
            phone: doctor.phone,
            address: doctor.address,
            englishLevel: doctor.englishLevel,
            deutschLevel: doctor.deutschLevel,
            arabicLevel: doctor.arabicLevel,
            description: doctor.description,
            specialityDegree: doctor.specialityDegree,
            specialityDegreeCompleteion: doctor.specialityDegreeCompleteion,
            specialityDegreeInstitute: doctor.specialityDegreeInstitute,
            creator: doctor.creator,
          };
        });
      } else {
        this.mode = 'create';
        this.doctorId = null;
      }
    });
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    //to preview image
    const reader = new FileReader();
    reader.onload = () => {
      this.imagepreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  onSaveDoctor(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form);
    this.loading = true;

    if (this.mode === 'create') {
      this.doctorsService.addDoctors(
        form.value.name,
        form.value.email,
        form.value.speciality,
        this.selectedFile,
        form.value.experience,
        form.value.phone,
        form.value.address,
        form.value.englishLevel,
        form.value.deutschLevel,
        form.value.arabicLevel,
        form.value.description,
        form.value.specialityDegree,
        form.value.specialityDegreeCompleteion,
        form.value.specialityDegreeInstitute
      );
    } else {
      this.doctorsService.updateDoctor(
        this.doctorId,
        form.value.name,
        form.value.email,
        form.value.speciality,
        this.doctor.imagePath,
        form.value.experience,
        form.value.phone,
        form.value.address,
        form.value.englishLevel,
        form.value.englishLevel,
        form.value.englishLevel,
        form.value.description,
        form.value.specialityDegree,
        form.value.specialityDegreeCompleteion,
        form.value.specialityDegreeInstitute
      );
    }
    form.resetForm();
  }
}
