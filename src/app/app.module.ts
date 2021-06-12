import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateDoctorsComponent } from './components/doctors/create-doctors/create-doctors.component';
import { ListDoctorsComponent } from './components/doctors/list-doctors/list-doctors.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/Paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { MatSelectModule } from '@angular/material/select';
/* import { MatOptionModule } from '@angular/material/option'; */

import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthInterceptor } from './components/auth/auth.interceptor';
import { AuthGuard } from './components/auth/auth.guard';
import { ListPatientsComponent } from './components/patients/list-patients/list-patients.component';
import { BookAppointmentsComponent } from './components/patients/book-appointments/book-appointments.component';
import { MatNativeDateModule } from '@angular/material/core';
import { PermissionToSignUpComponent } from './components/permission-to-sign-up/permission-to-sign-up.component';
import { PermissionToSignUpServiceGuard } from './components/permission-to-sign-up/permission-to-sign-up.guard';
import { PermissionToSignUpInterceptor } from './components/permission-to-sign-up/permission-to-sign-up.interceptor';
import { DocAuthGuard } from './components/auth/docAuth.guard';
import { PatientLoginComponent } from './components/patient-auth/patient-login/patient-login.component';
import { PatientSignupComponent } from './components/patient-auth/patient-signup/patient-signup.component';
import { PatientDetailsComponent } from './components/patients/patient-details/patient-details.component';
import { PatientAuthGuard } from './components/patient-auth/patient-auth.guard';
import { PatientAuthInterceptor } from './components/patient-auth/patient-auth.interceptor';
import { PatientAdminAuthGuard } from './components/auth/patient-adminAuth-guard';
import { ReceptionistAdminAuthGuard } from './components/auth/receptionist-adminAuth.guard';

@NgModule({
  declarations: [
    AppComponent,
    CreateDoctorsComponent,
    ListDoctorsComponent,
    HeaderComponent,
    SignupComponent,
    LoginComponent,
    ListPatientsComponent,
    BookAppointmentsComponent,
    PermissionToSignUpComponent,
    PatientLoginComponent,
    PatientSignupComponent,
    PatientDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatSelectModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PermissionToSignUpInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PatientAuthInterceptor,
      multi: true,
    },
    AuthGuard,
    DocAuthGuard,
    PermissionToSignUpServiceGuard,
    PatientAuthGuard,
    PatientAdminAuthGuard,
    ReceptionistAdminAuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
