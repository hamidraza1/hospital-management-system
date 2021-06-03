import { HostListener, ViewEncapsulation } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import AppointmentPicker from 'appointment-picker';
import { PatientsService } from '../patients.service';

@Component({
  selector: 'app-book-appointments',
  templateUrl: './book-appointments.component.html',
  styleUrls: ['./book-appointments.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BookAppointmentsComponent implements OnInit {
  unAvailableTimeSlots = [];
  isTimePickerDisabled: boolean = false;
  minDate = new Date();
  mode = 'create';
  patientId: string;
  public patient;

  @ViewChild('pickerInput', { static: true }) input: ElementRef;
  picker: AppointmentPicker;
  time: any;
  @HostListener('change.appo.picker', ['$event'])
  onChangeTime(event: any) {
    this.time = event.displayTime;
  }

  constructor(
    private patientsService: PatientsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('patientId')) {
        this.mode = 'edit';
        this.patientId = paramMap.get('patientId');
        this.patientsService
          .getPatient(this.patientId)
          .subscribe((patientDate) => {
            this.patientsService.datePicked(patientDate.patient.date);
            this.patient = {
              name: patientDate.patient.name,
              email: patientDate.patient.email,
              phone: patientDate.patient.phone,
              category: patientDate.patient.category,
              profession: patientDate.patient.profession,
              date: new Date(patientDate.patient.date),
              time: patientDate.patient.time,
              description: patientDate.patient.description,
            };
          });
      } else {
        this.mode = 'create';
        this.patientId = null;
      }
    });

    /*---------------- UnAvailable Time slots--------------------- */
    this.patientsService
      .getUnAvailableTimeSlots()
      .subscribe((filledTimeSlots) => {
        this.unAvailableTimeSlots = filledTimeSlots;
        this.isTimePickerDisabled = true;
        this.picker.destroy();
        this.picker = new AppointmentPicker(this.input.nativeElement, {
          startTime: 8,
          endTime: 20,
          interval: 30,
          disabled: this.unAvailableTimeSlots,
        });
      });
    /*---------------- Time Picker Config--------------------- */
    this.picker = new AppointmentPicker(this.input.nativeElement, {
      startTime: 8,
      endTime: 22,
      interval: 30,
      disabled: this.unAvailableTimeSlots,
    });
  }

  onDatePicked(event: any) {
    this.patientsService.datePicked(event.value.toLocaleDateString());
  }
  dateFilter(date: any) {
    if (date) {
      const day = date.getDay();
      return day !== 0 && day !== 6;
    }
  }
  onAddPatient(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form.value);
    if (this.mode === 'create') {
      const Date = form.value.date.toLocaleDateString();
      this.patientsService.addPatients(
        form.value.name,
        form.value.email,
        form.value.phone,
        form.value.category,
        form.value.profession,
        Date,
        form.value.time,
        form.value.description
      );
      form.resetForm();
    }
  }

  ngOnDestroy() {
    this.picker.destroy();
  }
}
