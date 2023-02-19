import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user = {
    fullName:'',
    userName: '',
    role:'',
    password: '',
    cnfPassword:''
  };

  constructor(private router: Router) {
  }

  register(formData:any){
    console.log(formData)
    this.router.navigate(['/login']);

    //need to add further lpogin
  }

  reload(){
    this.router.navigate(['/login']);
  }
}
