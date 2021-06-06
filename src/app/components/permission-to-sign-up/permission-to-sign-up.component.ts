import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PermissionToSignUpService } from './permission-to-sign-up.service';

@Component({
  selector: 'app-permission-to-sign-up',
  templateUrl: './permission-to-sign-up.component.html',
  styleUrls: ['./permission-to-sign-up.component.css'],
})
export class PermissionToSignUpComponent implements OnInit {
  constructor(
    private permissionToSignUpService: PermissionToSignUpService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.logout();
    this.router.navigate(['permission-for-admin-or-doctor/signup']);
  }

  onPermissionRequest(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.permissionToSignUpService.permissionRequest(
      form.value.email,
      form.value.password
    );
  }
}
