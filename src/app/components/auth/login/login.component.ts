import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loading = false;
  roles = ['Admin', 'Doctor', 'Receptionist'];
  responseStatus: any;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.loginAdmin(
      form.value.email,
      form.value.password,
      form.value.role
    );
    this.authService
      .getResponseStatusListener()
      .subscribe((status) => (this.responseStatus = status));
  }
}
