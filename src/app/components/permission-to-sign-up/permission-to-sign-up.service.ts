import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PermissionToSignUpService {
  public token: string;
  public isAdminDocReceptionistSignupAuthenticated = false;
  role: string;
  constructor(private http: HttpClient, private router: Router) {}

  permissionRequest(email: string, password: string) {
    const authData = { email: email, password: password };
    this.http
      .post<{ token: string; fetchedAdminDocReceptionist: any }>(
        'http://localhost:3000/api/permission-request/login',
        authData
      )
      .subscribe((response) => {
        this.token = response.token;

        if (this.token) {
          this.isAdminDocReceptionistSignupAuthenticated = true;
          this.role = response.fetchedAdminDocReceptionist.role;
          this.router.navigate(['/signup']);
        }
      });
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
