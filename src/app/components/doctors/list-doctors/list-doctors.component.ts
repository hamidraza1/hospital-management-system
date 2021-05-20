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
  a;

  constructor(private doctorsService: DoctorsService) {}

  ngOnInit() {
    this.doctors = this.doctorsService.getDoctors();
    this.postsSub = this.doctorsService
      .getDoctorsUpdateListener()
      .subscribe((doctors: doctor[]) => {
        this.doctors = doctors;
        this.a = doctors;
      });
  }
  ngAfterViewInit() {
    console.log(this.a);
  }

  ngOnDestroy() {
    //when we switch between pages, that subscription should be unsubscribed to prevent memory leak
    this.postsSub.unsubscribe();
  }
}
