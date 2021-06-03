import { Injectable } from '@angular/core';
import { doctor } from './doctor.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  private doctors: doctor[] = [];
  private doctorsUpdated = new Subject<{
    doctors: doctor[];
    doctorCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getDoctors(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}`;
    this.http
      .get<{ message: string; doctors: any; maxDoctors: number }>(
        'http://localhost:3000/api/doctors' + queryParams
      )
      .pipe(
        map((doctorsData) => {
          return {
            doctors: doctorsData.doctors.map((doctor) => {
              return {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                speciality: doctor.speciality,
                imagePath: doctor.imagePath,
                creator: doctor.creator,
              };
            }),
            maxPosts: doctorsData.maxDoctors,
          };
        })
      )
      .subscribe((transformedDoctorsData) => {
        this.doctors = transformedDoctorsData.doctors;
        this.doctorsUpdated.next({
          doctors: [...this.doctors],
          doctorCount: transformedDoctorsData.maxPosts,
        });
      });
  }

  getDoctorsUpdateListener() {
    //so we can only subscribe to this subject outside of this service, but not emit any value
    return this.doctorsUpdated.asObservable();
  }

  getDoctor(doctorId: string) {
    return this.http.get<{
      _id: string;
      name: string;
      email: string;
      speciality: string;
      imagePath: string;
      creator: string;
    }>('http://localhost:3000/api/doctors/' + doctorId);
  }

  addDoctors(name: string, email: string, speciality: string, image: File) {
    //FormData is used to combine json and file data(blob)
    const doctorData = new FormData();
    doctorData.append('name', name);
    doctorData.append('email', email);
    doctorData.append('speciality', speciality);
    doctorData.append('image', image, name);

    this.http
      .post<{ message: string; doctor: doctor }>(
        'http://localhost:3000/api/doctors',
        doctorData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updateDoctor(
    id: string,
    name: string,
    email: string,
    speciality: string,
    image: File | any
  ) {
    let doctorData: doctor | FormData;
    //if a new image is selected then image type will be file/object
    //if a image is not updated then image type will be url
    if (typeof image === 'object') {
      doctorData = new FormData();
      doctorData.append('id', id);
      doctorData.append('name', name);
      doctorData.append('email', email);
      doctorData.append('speciality', speciality);
      doctorData.append('image', image, name);
    } else {
      doctorData = {
        id: id,
        name: name,
        email: email,
        speciality: speciality,
        imagePath: image,
        creator: null,
      };
    }

    this.http
      .put<{ message: string; result: doctor }>(
        'http://localhost:3000/api/doctors/' + id,
        doctorData
      )
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  deletedoctor(doctorId: string) {
    return this.http.delete<{ message: string }>(
      'http://localhost:3000/api/doctors/' + doctorId
    );
  }
}
