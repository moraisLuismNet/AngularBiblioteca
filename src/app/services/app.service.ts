import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ILogin, ILoginResponse } from '../biblioteca/interfaces/login.interface';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  urlAPI: string;

  constructor(private http: HttpClient) {
    this.urlAPI = environment.urlAPI;
  }

  login(credenciales: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.urlAPI}auth/login`, credenciales);
  }

}
