import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorsAuthService {
  public token: string;
  public isDoctorAuthenticated = false;
  private DoctorAuthStatusListener = new Subject<boolean>();
  private doctorId: string;

  constructor(private http: HttpClient, private router: Router) {}

  signupDoctor(email: string, password: string) {
    const authData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/doctorAuth/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  loginDoctor(email: string, password: string) {
    const authData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; doctorId: string }>(
        'http://localhost:3000/api/doctorAuth/login',
        authData
      )
      .subscribe((response) => {
        console.log(response);
        //this token is needed to be attached to each outgoing request(in the doctors-auth.interceptor) from doctors-auth.Service
        const token = response.token;
        this.token = token;

        if (token) {
          this.isDoctorAuthenticated = true;
          this.DoctorAuthStatusListener.next(true);
          this.doctorId = response.doctorId;
          /* this.saveAuthData(token, this.userId);
          this.router.navigate(['/list-doctors']); */
        }
      });
  }

  getToken() {
    //so that this token can be attached to any outgoing request(in the doctors-auth.interceptor) e.g request ooutgoing from doctors-auth.Service
    return this.token;
  }
}
