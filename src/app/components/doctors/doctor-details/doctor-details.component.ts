import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DoctorsService } from '../doctors.service';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css'],
})
export class DoctorDetailsComponent implements OnInit {
  doctorId;
  public doctor: any;
  public loading: boolean = false;
  constructor(
    public route: ActivatedRoute,
    private doctorsService: DoctorsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('doctorId')) {
        this.doctorId = paramMap.get('doctorId');
        this.loading = true;
        this.doctorsService.getDoctor(this.doctorId).subscribe((doctor) => {
          //
          const nameSpeciality = {
            name: doctor.name,
            speciality: doctor.speciality,
          };
          this.doctorsService.doctorName.next(nameSpeciality);
          console.log(doctor);
          this.loading = false;
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
      }
    });
  }
  ngOnDestroy(): void {
    this.doctorsService.doctorName.next(false);
  }
}
