import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AppointmentModalComponent } from '../appointment-modal/appointment-modal.component';


export interface Appointment {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  clientName: string;
  doctor: string;
  status: number;
  selectedDate: string;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {

  doctorList: any[] = [];
  displayedColumns: string[] = ['id', 'title', 'startTime', 'endTime', 'clientName', 'doctor', 'status'];
  dataSource!: MatTableDataSource<Appointment>;
  userRole: string = "";
  userId: string = "";
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() selectedDate!: String;
  @Input() role: String = 'DOCTOR'

  constructor(private httpService: HttpService,
    private tokenService: TokenStorageService,
    public dialog: MatDialog) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getAllAppointments();
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.userRole = this.tokenService.getRole();
    this.userId = this.tokenService.getUser();
    this.dataSource = new MatTableDataSource();
    this.getAllAppointments();
  }

  getAllAppointments() {
    if (!this.selectedDate) {
      console.log(this.selectedDate)
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      this.selectedDate = `${year}-${month}-${day}`;
    } else {
      console.log(this.selectedDate);
    }
    this.httpService.getAllAppointments(this.selectedDate).subscribe((res: any) => {
      if (res) {
        let responseData = res;
        res.forEach((element: Appointment) => {
          element.startTime = element.startTime.substring(11, 16);
          element.endTime = element.endTime.substring(11, 16);
        });
        if (this.userRole == 'DOCTOR') {
          responseData = res.filter((row: any) => row.doctor === this.userId)
        }
        this.dataSource = new MatTableDataSource(responseData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  editAppointment(row: any) {
    const dialogRef = this.dialog.open(AppointmentModalComponent, {
      data: {
        id: row.id,
        title: row.title,
        startTime: row.startTime,
        endTime: row.endTime,
        clientName: row.clientName,
        doctor: row.doctor,
        selectedDate: this.selectedDate,
      },
      height: '400px',
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAllAppointments();
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim(); // Remove whitespace
    this.dataSource.filter = filterValue.toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateStatus(index: number, status: number) {
    const appointmentData = this.dataSource.filteredData[index];
    appointmentData.status = status;
    this.httpService.updateStatus(appointmentData.id, appointmentData.status).subscribe((res) => {
      if (res) {
        console.log(res);
      }
    }, err => {
      console.log(err);
    })
  }

}


