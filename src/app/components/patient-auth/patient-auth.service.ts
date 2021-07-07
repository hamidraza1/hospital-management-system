import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class PatientAuthService {
  token: string;
  patientEmail: string;
  public isPatientAuthenticated = false;
  private authPatientStatusListener = new Subject<boolean>();
  private patientId: string;
  private responseStatusListener = new Subject<any>();

  constructor(private http: HttpClient, private router: Router) {}

  getAuthPatientStatusListener() {
    return this.authPatientStatusListener.asObservable();
  }
  getIsPatientAuthenticated() {
    return this.isPatientAuthenticated;
  }
  getPatientId() {
    return this.patientId;
  }
  getPatientEmail() {
    return this.patientEmail;
  }
  getToken() {
    return this.token;
  }
  getResponseStatusListener() {
    return this.responseStatusListener.asObservable();
  }

  createPatient(email: string, password: string) {
    const authData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/patientAuth/signup', authData, {
        observe: 'response',
      })
      .subscribe(
        (response) => {
          console.log(response);
          /* this.router.navigate(['/patientAuth/login']); */
        },
        (error) => {
          this.responseStatusListener.next(error.status);
        }
      );
  }

  loginPatient(email: string, password: string) {
    const authData = { email: email, password: password };
    this.http
      .post<{ token: string; patientId: string; patient: any }>(
        'http://localhost:3000/api/patientAuth/login',
        authData,
        {
          observe: 'response',
        }
      )
      .subscribe(
        (response) => {
          const token = response.body.token;
          this.token = token;

          if (response.body.token) {
            this.isPatientAuthenticated = true;
            this.authPatientStatusListener.next(true);
            this.patientId = response.body.patientId;
            this.patientEmail = response.body.patient.email;
            this.saveAuthData(token, this.patientId, this.patientEmail);
            this.router.navigate(['/patient-details']);
          }
        },
        (error) => {
          this.responseStatusListener.next(error.status);
        }
      );
  }
  private saveAuthData(token: string, patientId: string, patientEmail: string) {
    localStorage.setItem('patientToken', token);
    localStorage.setItem('patientId', patientId);
    localStorage.setItem('patientEmail', patientEmail);
  }

  logout() {
    this.token = null;
    this.isPatientAuthenticated = false;
    this.authPatientStatusListener.next(false);
    this.clearAuthData();
    this.patientId = null;
    this.patientEmail = null;
    this.router.navigate(['/']);
  }

  private clearAuthData() {
    localStorage.removeItem('patientToken');
    localStorage.removeItem('patientId');
    localStorage.removeItem('patientEmail');
  }

  autoAuthPatient() {
    const token = localStorage.getItem('patientToken');
    const patientId = localStorage.getItem('patientId');
    const patientEmail = localStorage.getItem('patientEmail');
    if (token) {
      this.authPatientStatusListener.next(true);
      this.isPatientAuthenticated = true;
      this.patientId = patientId;
      this.token = token;
      this.patientEmail = patientEmail;
    }
  }
}
