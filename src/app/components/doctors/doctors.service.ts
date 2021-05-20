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
  private doctorsUpdated = new Subject<doctor[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getDoctors() {
    this.http
      .get<{ message: string; doctors: any }>(
        'http://localhost:3000/api/doctors'
      )
      .pipe(
        map((doctorsData) => {
          return doctorsData.doctors.map((doctor) => {
            return {
              id: doctor._id,
              name: doctor.name,
              email: doctor.email,
              speciality: doctor.speciality,
            };
          });
        })
      )
      .subscribe((transformedDoctors) => {
        this.doctors = transformedDoctors;
        this.doctorsUpdated.next([...this.doctors]);
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
    }>('http://localhost:3000/api/doctors/' + doctorId);
  }

  addDoctors(name: string, email: string, speciality: string) {
    const doctor: doctor = {
      id: null,
      name: name,
      email: email,
      speciality: speciality,
    };
    this.http
      .post<{ message: string; doctorId: string }>(
        'http://localhost:3000/api/doctors',
        doctor
      )
      .subscribe((responseData) => {
        console.log(responseData.message);
        //store id in local doctors array
        const id = responseData.doctorId;
        doctor.id = id;
        this.doctors.push(doctor);
        this.doctorsUpdated.next([...this.doctors]);
        this.router.navigate(['/']);
      });
  }

  updateDoctor(id: string, name: string, email: string, speciality: string) {
    const doctor: doctor = {
      id: id,
      name: name,
      email: email,
      speciality: speciality,
    };
    this.http
      .put<{ message: string }>(
        'http://localhost:3000/api/doctors/' + id,
        doctor
      )
      .subscribe((response) => {
        //update locally in doctor array
        const updatedPosts = [...this.doctors];
        const oldDoctorIndex = updatedPosts.findIndex(
          (d) => d.id === doctor.id
        );
        updatedPosts[oldDoctorIndex] = doctor;
        this.doctors = updatedPosts;
        this.doctorsUpdated.next([...this.doctors]);
        this.router.navigate(['/']);
      });
  }

  deletedoctor(doctorId: string) {
    this.http
      .delete<{ message: string }>(
        'http://localhost:3000/api/doctors/' + doctorId
      )
      .subscribe((res) => {
        //updating the locally stored doctors array, once any doc is deleted
        const updateDoctors = this.doctors.filter((doc) => doc.id !== doctorId);
        this.doctors = updateDoctors;
        this.doctorsUpdated.next([...this.doctors]);
      });
  }
}
