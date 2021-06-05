import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PermissionToSignUpService } from './permission-to-sign-up.service';

@Component({
  selector: 'app-permission-to-sign-up',
  templateUrl: './permission-to-sign-up.component.html',
  styleUrls: ['./permission-to-sign-up.component.css'],
})
export class PermissionToSignUpComponent implements OnInit {
  constructor(private permissionToSignUpService: PermissionToSignUpService) {}

  ngOnInit(): void {}

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
