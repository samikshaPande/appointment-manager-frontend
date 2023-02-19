import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {

  user = {
    userName: '',
    password: '',
    cnfPassword: ''
  };

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  changePassword(formData: any) {
    console.log(formData)
    this.router.navigate(['/login']);
    //login need to be added
  }

  reload(){
    this.router.navigate(['/login']);
  }
}
