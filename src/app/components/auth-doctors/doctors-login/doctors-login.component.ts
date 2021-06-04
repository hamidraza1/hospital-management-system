import { Component, OnInit } from '@angular/core';
import { DoctorsAuthService } from '../doctors-auth.service';

@Component({
  selector: 'app-doctors-login',
  templateUrl: './doctors-login.component.html',
  styleUrls: ['./doctors-login.component.css'],
})
export class DoctorsLoginComponent implements OnInit {
  constructor(private doctorsAuthService: DoctorsAuthService) {}

  ngOnInit(): void {}

  onLogin(form) {
    if (form.invalid) {
      return;
    }
    this.doctorsAuthService.loginDoctor(form.value.email, form.value.password);
  }
}
