import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DoctorsAuthService } from '../doctors-auth.service';

@Component({
  selector: 'app-doctors-signup',
  templateUrl: './doctors-signup.component.html',
  styleUrls: ['./doctors-signup.component.css'],
})
export class DoctorsSignupComponent implements OnInit {
  constructor(private doctorsAuthService: DoctorsAuthService) {}

  ngOnInit(): void {}

  onDoctorSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.doctorsAuthService.signupDoctor(form.value.email, form.value.password);
  }
}
