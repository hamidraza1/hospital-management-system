import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateDoctorsComponent } from './components/doctors/create-doctors/create-doctors.component';
import { ListDoctorsComponent } from './components/doctors/list-doctors/list-doctors.component';

const routes: Routes = [
  { path: 'create-doctors', component: CreateDoctorsComponent },
  { path: 'list-doctors', component: ListDoctorsComponent },
  { path: 'edit-doctors/:doctorId', component: CreateDoctorsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
