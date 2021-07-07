import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { EmailValidator } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public token: string;
  public role: string;
  public roleStatusListener = new Subject<any>();
  /*---------- For Admin --------------*/
  public isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private userId: string;

  /*---------- For Doctor --------------*/
  public isDoctorAuthenticated = false;
  private DoctorAuthStatusListener = new Subject<boolean>();
  private doctorId: string;
  private doctorEmail: string;
  /*---------- For Receptionist --------------*/
  public isReceptionistAuthenticated = false;
  private ReceptionistAuthStatusListener = new Subject<boolean>();
  private receptionistId: string;

  private responseStatusListener = new Subject<any>();

  constructor(private http: HttpClient, private router: Router) {}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getDoctorAuthStatusListener() {
    return this.DoctorAuthStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }
  getIsDoctorAuth() {
    return this.isDoctorAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getDoctorId() {
    return this.doctorId;
  }

  getDoctorEmail() {
    return this.doctorEmail;
  }
  getRole() {
    return this.role;
  }
  getIsRecptionistAuth() {
    return this.isReceptionistAuthenticated;
  }
  getRecptionistAuthStatusListener() {
    return this.ReceptionistAuthStatusListener.asObservable();
  }
  getRecptionistId() {
    return this.receptionistId;
  }

  getRoleStatusListener() {
    return this.roleStatusListener.asObservable();
  }
  getResponseStatusListener() {
    return this.responseStatusListener.asObservable();
  }

  createAdminDocReceptionist(email: string, password: string, role: string) {
    const authData = { email: email, password: password, role: role };
    this.http
      .post('http://localhost:3000/api/admin/signup', authData, {
        observe: 'response',
      })
      .subscribe(
        (response: any) => {
          this.router.navigate(['/login']);
        },
        (error) => {
          this.responseStatusListener.next(error.status);
        }
      );
  }

  loginAdmin(email: string, password: string, role: string) {
    const authData = { email: email, password: password, role: role };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        loggedInAs: string;
        doctorId: string;
        doctorEmail: string;
        receptionistId: string;
      }>('http://localhost:3000/api/admin/login', authData, {
        observe: 'response',
      })
      .subscribe(
        (response) => {
          //this token is needed to be attached to each outgoing request(in the auth.interceptor) from doctorsService
          const token = response.body.token;
          this.token = token;
          console.log(response);
          if (token && response.body.loggedInAs == 'Admin') {
            this.role = response.body.loggedInAs;
            this.roleStatusListener.next('Admin');
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.userId = response.body.userId;
            this.saveAuthData(token, this.userId, this.role, null);
            this.router.navigate(['/list-doctors']);
          } else if (token && response.body.loggedInAs == 'Doctor') {
            this.role = response.body.loggedInAs;
            this.roleStatusListener.next('Doctor');
            this.isDoctorAuthenticated = true;
            this.DoctorAuthStatusListener.next(true);
            this.doctorId = response.body.doctorId;
            this.doctorEmail = response.body.doctorEmail;
            this.saveAuthData(
              token,
              this.doctorId,
              this.role,
              this.doctorEmail
            );
            this.router.navigate(['/list-doctors']);
          } else if (token && response.body.loggedInAs == 'Receptionist') {
            this.role = response.body.loggedInAs;
            this.roleStatusListener.next('Receptionist');
            this.isReceptionistAuthenticated = true;
            this.ReceptionistAuthStatusListener.next(true);
            this.receptionistId = response.body.receptionistId;
            this.saveAuthData(token, this.receptionistId, this.role, null);
            this.router.navigate(['/list-patients']);
          }
        },
        (error) => {
          this.responseStatusListener.next(error.status);
        }
      );
  }

  getToken() {
    //so that this token can be attached to any outgoing request(in the auth.interceptor) e.g request ooutgoing from doctorsService
    return this.token;
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.isDoctorAuthenticated = false;
    this.isReceptionistAuthenticated = false;
    this.authStatusListener.next(false);
    this.DoctorAuthStatusListener.next(false);
    this.ReceptionistAuthStatusListener.next(false);
    this.role = null;
    this.roleStatusListener.next('');
    this.clearAuthData();
    this.userId = null;
    this.doctorId = null;
    this.receptionistId = null;
    this.router.navigate(['/']);
  }

  private saveAuthData(
    token: string,
    userId: string,
    role: string,
    docEmail: any
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);
    localStorage.setItem('docEmail', docEmail);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('docEmail');
  }

  autoAuthAdmin() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const docEmail = localStorage.getItem('docEmail');
    if (token && role == 'Admin') {
      this.authStatusListener.next(true);
      this.isAuthenticated = true;
      this.userId = userId;
      this.token = token;
      this.role = role;
      this.roleStatusListener.next('Admin');
    } else if (token && role == 'Doctor') {
      this.DoctorAuthStatusListener.next(true);
      this.isDoctorAuthenticated = true;
      this.doctorEmail = docEmail;
      this.userId = userId;
      this.token = token;
      this.role = role;
      this.roleStatusListener.next('Doctor');
    } else if (token && role == 'Receptionist') {
      this.ReceptionistAuthStatusListener.next(true);
      this.isReceptionistAuthenticated = true;
      this.userId = userId;
      this.token = token;
      this.role = role;
      this.roleStatusListener.next('Receptionist');
    }
  }
}
