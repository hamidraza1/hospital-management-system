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
  private token: string;
  public isAuthenticated = false;
  tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createAdmin(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/admin/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  loginAdmin(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/admin/login',
        authData
      )
      .subscribe((response) => {
        //this token is needed to be attached to each outgoing request(in the auth.interceptor) from doctorsService
        const token = response.token;
        this.token = token;

        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          const expiresInDuration = response.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresInDuration * 1000);
          this.router.navigate(['/list-doctors']);
        }
      });
  }

  getToken() {
    //so that this token can be attached to any outgoing request(in the auth.interceptor) e.g request ooutgoing from doctorsService
    return this.token;
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }
}
