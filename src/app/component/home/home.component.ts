import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AppointmentModalComponent } from '../appointment-modal/appointment-modal.component';
import { DataTableComponent } from '../data-table/data-table.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;
  showMenu: boolean = false;
  isEdit: boolean = false;
  loggedInUser: String = "";
  userRole: String = "";
  displayStyle = "none";
  selectedDate: any;
  formattedDate: any;
  currentDate: Date = new Date();

  constructor(private fb: FormBuilder,
    private tokenService: TokenStorageService,
    private router: Router, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    if (this.tokenService.getUser()) {
      this.loggedInUser = this.tokenService.getUser();
    } else {
      this.router.navigate(['/login']);
    }
    this.userRole = this.tokenService.getRole();
    this.formatDate();
  }

  onSelect(event: any) {
    this.formatDate(event);
  }

  formatDate(event?: any) {
    const date = event ? new Date(event) : new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    this.formattedDate = `${year}-${month}-${day}`;
  }

  createNewAppointment() {
    const dialogRef = this.dialog.open(AppointmentModalComponent, {
      data: {
        selectedDate: this.formattedDate,
      },
      height: '400px',
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataTable.getAllAppointments();
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  logout() {
    this.router.navigate(['/login']);
    this.tokenService.signOut();
  }
}

