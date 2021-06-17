import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  private patientsUpdated = new Subject<{
    patients: any;
    patientsCount: number;
  }>();
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

  getPatients(patientsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${patientsPerPage}&currentPage=${currentPage}`;
    this.http
      .get<{ message: string; patients: any; maxPatients: number }>(
        'http://localhost:3000/api/patients' + queryParams
      )
      .subscribe((responseData) => {
        this.patientsUpdated.next({
          patients: responseData.patients,
          patientsCount: responseData.maxPatients,
        });
      });
  }

  getPatientsUpdateListener() {
    //so we can only subscribe to this subject outside of this service, but not emit any value
    return this.patientsUpdated.asObservable();
  }

  getPatient(id: string) {
    return this.http.get<{ patient: any }>(
      'http://localhost:3000/api/patients/' + id
    );
  }

  getPatientByEmail(email: string) {
    return this.http.get<{ patient: any }>(
      'http://localhost:3000/api/patients/patient-email/' + email
    );
  }

  upDatePatient(
    id: string,
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
      id: id,
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
      .put<{ patients: any }>(
        'http://localhost:3000/api/patients/' + id,
        patientData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/list-patients']);
      });
  }

  deletePatient(patientId) {
    return this.http.delete<{ message: string }>(
      'http://localhost:3000/api/patients/' + patientId
    );
  }

  AssignDocToPatient(patientId: string, doctorId: string) {
    const DocPatientId = { patientId: patientId, doctorId: doctorId };
    return this.http.put(
      'http://localhost:3000/api/patients/assign/doctor-to-patient',
      DocPatientId,
      {
        observe: 'response',
      }
    );
  }

  AssignPatientsToDoctor(patientId: string, doctorId: string) {
    const DocPatientId = { patientId: patientId, doctorId: doctorId };
    return this.http.put(
      'http://localhost:3000/api/patients/assign/patients-to-doctor',
      DocPatientId,
      {
        observe: 'response',
      }
    );
  }
}
