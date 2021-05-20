import { Injectable } from '@angular/core';
import { doctor } from './doctor.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  private doctors: doctor[] = [];
  private doctorsUpdated = new Subject<doctor[]>();

  getDoctors() {
    return [...this.doctors];
  }

  getDoctorsUpdateListener() {
    //so we can only subscribe to this subject outside of this service, but not emit any value
    return this.doctorsUpdated.asObservable();
  }

  addDoctors(name: string, email: string, speciality: string) {
    const doctor: doctor = {
      name: name,
      email: email,
      speciality: speciality,
    };
    this.doctors.push(doctor);
    this.doctorsUpdated.next([...this.doctors]);
  }
}
