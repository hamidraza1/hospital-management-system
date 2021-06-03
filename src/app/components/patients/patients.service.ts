import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  patients = new Subject<[]>();
  unAvailableTimeSlots = new Subject<[]>();

  constructor(private http: HttpClient, private router: Router) {}

  datePicked(date: string) {
    const datePicked = { date: date };
    this.http
      .post<{ patients: any }>(
        'http://localhost:3000/api/patients/datePicked',
        datePicked
      )
      .pipe(
        map((patientsData) => {
          return {
            patientsData: patientsData.patients.map((patient) => {
              return patient.time;
            }),
          };
        })
      )
      .subscribe((responseData) => {
        this.unAvailableTimeSlots.next(responseData.patientsData);
      });
  }

  getUnAvailableTimeSlots() {
    return this.unAvailableTimeSlots.asObservable();
  }

  addPatients(
    name: string,
    email: string,
    phone: string,
    category: string,
    profession: string,
    date: string,
    time: string,
    description: string
  ) {
    const patientData = {
      name: name,
      email: email,
      phone: phone,
      category: category,
      profession: profession,
      date: date,
      time: time,
      description: description,
    };

    this.http
      .post<{ message: string }>(
        'http://localhost:3000/api/patients',
        patientData
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  getPatients() {
    this.http
      .get<{ patients: any }>('http://localhost:3000/api/patients')
      .subscribe((responseData) => {
        this.patients.next(responseData.patients);
      });
  }

  getPatient(id: string) {
    return this.http.get<{ patient: any }>(
      'http://localhost:3000/api/patients/' + id
    );
  }
}
