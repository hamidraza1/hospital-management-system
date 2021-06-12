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

  createPatient(email: string, password: string) {
    const authData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/patientAuth/signup', authData)
      .subscribe((response) => {
        console.log(response);
        /* this.router.navigate(['/patientAuth/login']); */
      });
  }

  loginPatient(email: string, password: string) {
    const authData = { email: email, password: password };
    this.http
      .post<{ token: string; patientId: string; patient: any }>(
        'http://localhost:3000/api/patientAuth/login',
        authData
      )
      .subscribe((response) => {
        const token = response.token;
        this.token = token;

        if (response.token) {
          this.isPatientAuthenticated = true;
          this.authPatientStatusListener.next(true);
          this.patientId = response.patientId;
          this.patientEmail = response.patient.email;
          this.saveAuthData(token, this.patientId, this.patientEmail);
          this.router.navigate(['/patient-details']);
        }
      });
  }
  private saveAuthData(token: string, patientId: string, patientEmail: string) {
    localStorage.setItem('token', token);
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
    localStorage.removeItem('token');
    localStorage.removeItem('patientId');
    localStorage.removeItem('patientEmail');
  }

  autoAuthPatient() {
    const token = localStorage.getItem('token');
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
