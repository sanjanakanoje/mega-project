import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Auth {
    baseUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  // login(data: any) {
  //   return this.http.post(`${this.baseUrl}/login`, data);
  // }
  login(data: any) {
  return this.http.post<any>('http://localhost:5000/api/auth/login', data)
    .pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.user.role);  // ✅ ADD THIS
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getUser() {
  return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getRole() {
    return this.getUser()?.role;
  }

  isLabStaff(): boolean {
    return this.getRole() === 'LabStaff';
  }
}
