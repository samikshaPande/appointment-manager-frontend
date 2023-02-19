import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const ROLE_KEY = 'user-role';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(){
    window.sessionStorage.clear();
  }

  public setUser(token:string){
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY,token);
  } 

  public getUser(): any {
    return window.sessionStorage.getItem(USER_KEY);
  }

  public setToken(token:string){
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY,token);
  } 

  public getToken(): any {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public setRole(role:string){
    window.sessionStorage.removeItem(ROLE_KEY);
    window.sessionStorage.setItem(ROLE_KEY,role);
  } 

  public getRole(): any {
    return window.sessionStorage.getItem(ROLE_KEY);
  }
}
