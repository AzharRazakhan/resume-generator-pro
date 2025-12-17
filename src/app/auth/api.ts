import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {

  apiUrl = 'https://localhost:7185/api/User';
  constructor(private http: HttpClient) {
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data)
  }

  signup(data: any) {
    return this.http.post(`${this.apiUrl}/signup`, data)
  }

  getUser() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  isLogin() {
    return !!localStorage.getItem('user')
  }

  logout() {
    localStorage.removeItem('user')
  }


}
