import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PermissionToSignUpService } from '../../permission-to-sign-up/permission-to-sign-up.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  role: string;
  loading = false;
  responseStatus: any;
  constructor(
    public authService: AuthService,
    private permissionToSignUpService: PermissionToSignUpService
  ) {}

  ngOnInit(): void {
    this.role = this.permissionToSignUpService.getRole();
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.createAdminDocReceptionist(
      form.value.email,
      form.value.password,
      this.role
    );
    this.authService
      .getResponseStatusListener()
      .subscribe((status) => (this.responseStatus = status));
  }
}
