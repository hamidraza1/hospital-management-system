import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class PermissionToSignUpService {
  public token: string;
  public isAdminDocReceptionistSignupAuthenticated = false;
  role: string;
  private responseStatusListener = new Subject<any>();

  constructor(private http: HttpClient, private router: Router) {}

  getResponseStatusListener() {
    return this.responseStatusListener.asObservable();
  }

  permissionRequest(email: string, password: string) {
    const authData = { email: email, password: password };
    this.http
      .post<{ token: string; fetchedAdminDocReceptionist: any }>(
        'http://localhost:3000/api/permission-request/login',
        authData,
        {
          observe: 'response',
        }
      )
      .subscribe(
        (response) => {
          this.token = response.body.token;

          if (this.token) {
            this.isAdminDocReceptionistSignupAuthenticated = true;
            this.role = response.body.fetchedAdminDocReceptionist.role;
            this.router.navigate(['/signup']);
          }
        },
        (error) => {
          this.responseStatusListener.next(error.status);
        }
      );
  }

  getIsAuth() {
    return this.isAdminDocReceptionistSignupAuthenticated;
  }
  getToken() {
    return this.token;
  }
  getRole() {
    return this.role;
  }
}
