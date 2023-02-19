import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  user = {
    userName: '',
    password: ''
  };

  constructor(private router: Router,
    private tokenStorage: TokenStorageService,
    private authService: AuthService) {
  }

  login(formData: any) {
    this.authService.login(formData).subscribe((res: any) => {
      this.tokenStorage.setToken(res.token);
      this.tokenStorage.setUser(res.userName);
      this.tokenStorage.setRole(res.role)
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.router.navigate(['/home']);
    },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      })
  }
}
