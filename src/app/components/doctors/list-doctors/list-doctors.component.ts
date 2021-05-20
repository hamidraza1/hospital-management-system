import { Component, OnDestroy, OnInit } from '@angular/core';
import { doctor } from '../doctor.model';
import { DoctorsService } from '../doctors.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-doctors',
  templateUrl: './list-doctors.component.html',
  styleUrls: ['./list-doctors.component.css'],
})
export class ListDoctorsComponent implements OnInit, OnDestroy {
  doctors: doctor[] = [];
  private postsSub: Subscription;
  private loading: boolean = false;

  constructor(private doctorsService: DoctorsService) {}

  ngOnInit() {
    //
    this.loading = true;
    this.doctorsService.getDoctors();
    this.postsSub = this.doctorsService
      .getDoctorsUpdateListener()
      .subscribe((doctors: doctor[]) => {
        //
        this.loading = false;
        this.doctors = doctors;
      });
  }

  onDeletedoctor(doctorId: string) {
    this.doctorsService.deletedoctor(doctorId);
  }

  ngOnDestroy() {
    //when we switch between pages, that subscription should be unsubscribed to prevent memory leak
    this.postsSub.unsubscribe();
  }
}
