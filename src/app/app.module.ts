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

import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthInterceptor } from './components/auth/auth.interceptor';
import { AuthGuard } from './components/auth/auth.guard';
import { CreatePatientsComponent } from './components/patients/create-patients/create-patients.component';
import { ListPatientsComponent } from './components/patients/list-patients/list-patients.component';
import { BookAppointmentsComponent } from './components/patients/book-appointments/book-appointments.component';
import { MatNativeDateModule } from '@angular/material/core';
/* import { AuthGuard } from './components/auth/auth.guard'; */

@NgModule({
  declarations: [
    AppComponent,
    CreateDoctorsComponent,
    ListDoctorsComponent,
    HeaderComponent,
    SignupComponent,
    LoginComponent,
    CreatePatientsComponent,
    ListPatientsComponent,
    BookAppointmentsComponent,
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
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
