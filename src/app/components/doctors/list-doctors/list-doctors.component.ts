import { Component, OnDestroy, OnInit } from '@angular/core';
import { doctor } from '../doctor.model';
import { DoctorsService } from '../doctors.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/Paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-list-doctors',
  templateUrl: './list-doctors.component.html',
  styleUrls: ['./list-doctors.component.css'],
})
export class ListDoctorsComponent implements OnInit, OnDestroy {
  doctors: doctor[] = [];

  //for pagination
  totalDoctors = 0;
  doctorsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  public loading: boolean = false;
  public adminIsAuthenticated = false;

  constructor(
    private doctorsService: DoctorsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    //
    this.loading = true;
    this.doctorsService.getDoctors(this.doctorsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.doctorsService
      .getDoctorsUpdateListener()
      .subscribe((doctorsData: { doctors: doctor[]; doctorCount: number }) => {
        //
        this.loading = false;
        this.totalDoctors = doctorsData.doctorCount;
        this.doctors = doctorsData.doctors;
      });
    this.adminIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.adminIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDeletedoctor(doctorId: string) {
    this.loading = true;
    this.doctorsService.deletedoctor(doctorId).subscribe(() => {
      this.doctorsService.getDoctors(this.doctorsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.loading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.doctorsPerPage = pageData.pageSize;
    this.doctorsService.getDoctors(this.doctorsPerPage, this.currentPage);
  }
  ngOnDestroy() {
    //when we switch between pages, that subscription should be unsubscribed to prevent memory leak
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
