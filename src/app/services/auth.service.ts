import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

const AUTH_API = 'http://localhost:8080/'

const httpOptions = {
  headers : new HttpHeaders({'content-type':'application/json'})
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(userObj: any){    
    return this.http.post(AUTH_API +"auth", userObj, httpOptions);
  }

  public register(userObj: any){    
    return this.http.post(AUTH_API +"sub", userObj, httpOptions);
  }

  
}
