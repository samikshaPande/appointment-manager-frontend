import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { Appointment } from '../data-table/data-table.component';

@Component({
  selector: 'appointment-modal',
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss']
})
export class AppointmentModalComponent implements OnInit {

  modalTitle:string = "Create"
  doctorList: any[] = [];
  disableDoctorSelect: boolean = true;
  appointmentForm = new FormGroup({
    "title": new FormControl("", Validators.required),
    "startTime": new FormControl("", Validators.required),
    "endTime": new FormControl("", Validators.required),
    "clientName": new FormControl("", Validators.required),
    "doctor": new FormControl("", Validators.required),
  });

  constructor(
    private httpService: HttpService,
    public dialogRef: MatDialogRef<AppointmentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Appointment,
  ) { }

  ngOnInit(): void {
    this.initData();    
    this.getListOfDoctors();
  }

  initData() {
    this.appointmentForm.controls['title'].setValue(this.data.title);
    this.appointmentForm.controls['startTime'].setValue(this.data.startTime);
    this.appointmentForm.controls['endTime'].setValue(this.data.endTime);
    this.appointmentForm.controls['clientName'].setValue(this.data.clientName);
    this.appointmentForm.controls['doctor'].setValue(this.data.doctor);
    this.modalTitle = this.data.id ? "Edit":"Create";
  }

  getListOfDoctors() {
    const startTime = this.appointmentForm.controls['startTime'].value;
    const endTime = this.appointmentForm.controls['endTime'].value;
    if (startTime != null && endTime != null) {
      const startDateTime = this.data.selectedDate + 'T' + startTime;
      const endDateTime = this.data.selectedDate + 'T' + endTime;
      this.httpService.getFreeDoctors(startDateTime, endDateTime).subscribe((res: any) => {
        if (res) {
          this.disableDoctorSelect = false;
          this.doctorList = res;
        }
      }, err => {
        this.disableDoctorSelect = false;
        console.log(err);
      })
    }
  }
 
  createEditAppointment(id: any) {

    if(this.appointmentForm.valid){
      const appointmentObj = {
        title: this.appointmentForm.controls['title'].value,
        startTime: this.data.selectedDate + 'T' + this.appointmentForm.controls['startTime'].value,
        endTime: this.data.selectedDate + 'T' + this.appointmentForm.controls['endTime'].value,
        clientName: this.appointmentForm.controls['clientName'].value,
        doctor: this.appointmentForm.controls['doctor'].value,
      } 
      id?this.editAppointment(appointmentObj, id):this.createAppointment(appointmentObj);
    }    
  }

  createAppointment(appointmentObj: any) {
    this.httpService.createAppointment(appointmentObj).subscribe((res: any) => {
        this.dialogRef.close();
    }, err => {
      console.log(err);
    })
  }
  editAppointment(appointmentObj: any, id:number) {
    this.httpService.updateAppointment(appointmentObj, id).subscribe((res: any) => {
      if (res) {
        this.dialogRef.close();
      }
    }, err => {
      console.log(err);
    })
  }

  isNullorEmpty(value: any) {
    return (!value || value != "")
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeDoctor(event: Event) {
    console.log(this.appointmentForm.controls['doctor'].value)
  }

}
