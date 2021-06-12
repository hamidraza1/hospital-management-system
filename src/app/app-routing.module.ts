import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './components/auth/auth.guard';
import { DocAuthGuard } from './components/auth/docAuth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { PatientAdminAuthGuard } from './components/auth/patient-adminAuth-guard';
import { ReceptionistAdminAuthGuard } from './components/auth/receptionist-adminAuth.guard';
import { SignupComponent } from './components/auth/signup/signup.component';
import { CreateDoctorsComponent } from './components/doctors/create-doctors/create-doctors.component';
import { ListDoctorsComponent } from './components/doctors/list-doctors/list-doctors.component';
import { PatientAuthGuard } from './components/patient-auth/patient-auth.guard';
import { PatientLoginComponent } from './components/patient-auth/patient-login/patient-login.component';
import { PatientSignupComponent } from './components/patient-auth/patient-signup/patient-signup.component';
import { BookAppointmentsComponent } from './components/patients/book-appointments/book-appointments.component';
import { ListPatientsComponent } from './components/patients/list-patients/list-patients.component';
import { PatientDetailsComponent } from './components/patients/patient-details/patient-details.component';
import { PermissionToSignUpComponent } from './components/permission-to-sign-up/permission-to-sign-up.component';
import { PermissionToSignUpServiceGuard } from './components/permission-to-sign-up/permission-to-sign-up.guard';

const routes: Routes = [
  {
    path: 'create-doctors',
    component: CreateDoctorsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'list-doctors',
    component: ListDoctorsComponent,
  },
  {
    path: 'edit-doctors/:doctorId',
    component: CreateDoctorsComponent,
    canActivate: [DocAuthGuard],
  },
  {
    path: 'list-patients',
    component: ListPatientsComponent,
    canActivate: [ReceptionistAdminAuthGuard],
  },
  {
    path: 'book-appointments',
    component: BookAppointmentsComponent,
    canActivate: [PatientAuthGuard],
  },
  {
    path: 'edit-patients/:patientId',
    component: BookAppointmentsComponent,
    canActivate: [PatientAdminAuthGuard],
  },
  {
    path: 'patient-details',
    component: PatientDetailsComponent,
    canActivate: [PatientAuthGuard],
  },
  {
    path: 'permission-for-admin-or-doctor/signup',
    component: PermissionToSignUpComponent,
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [PermissionToSignUpServiceGuard],
  },
  { path: 'patient-login', component: PatientLoginComponent },
  {
    path: 'patient-signup',
    component: PatientSignupComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
