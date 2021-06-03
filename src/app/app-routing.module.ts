import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './components/auth/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { CreateDoctorsComponent } from './components/doctors/create-doctors/create-doctors.component';
import { ListDoctorsComponent } from './components/doctors/list-doctors/list-doctors.component';
import { BookAppointmentsComponent } from './components/patients/book-appointments/book-appointments.component';
import { CreatePatientsComponent } from './components/patients/create-patients/create-patients.component';
import { ListPatientsComponent } from './components/patients/list-patients/list-patients.component';

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
    canActivate: [AuthGuard],
  },
  {
    path: 'create-patients',
    component: CreatePatientsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'list-patients',
    component: ListPatientsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'book-appointments',
    component: BookAppointmentsComponent,
  },
  {
    path: 'edit-patients/:patientId',
    component: BookAppointmentsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
