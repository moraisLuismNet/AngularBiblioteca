import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ILoginResponse } from '../biblioteca/interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router) {}

  isLoggedIn() {
    const user = sessionStorage.getItem('usuario');
    if (user) {
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }

  getUser(): string {
    const infoUser = sessionStorage.getItem('usuario');
    if (infoUser) {
      const userInfo: ILoginResponse = JSON.parse(infoUser);
      return userInfo.email;
    }
    return '';
  }

  getToken(): string {
    const infoUser = sessionStorage.getItem('usuario');
    if (infoUser) {
      const userInfo: ILoginResponse = JSON.parse(infoUser);
      return userInfo.token;
    }
    return '';
  }
}
