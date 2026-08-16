

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private baseUrl = 'http://localhost:5000/api/auth';

  // =====================================================
  // LOGIN STATE
  // =====================================================

  private loggedInSubject =
    new BehaviorSubject<boolean>(
      this.hasValidToken()
    );

  loggedIn$ =
    this.loggedInSubject.asObservable();


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // LOGIN
  // =====================================================

  login(data: any): Observable<any> {

    return this.http
      .post<any>(
        `${this.baseUrl}/login`,
        data
      )
      .pipe(

        tap((res: any) => {

          console.log(
            'Login response:',
            res
          );

          // ---------------------------------------------
          // Save token
          // ---------------------------------------------

          if (res?.token) {

            localStorage.setItem(
              'token',
              res.token
            );

          }


          // ---------------------------------------------
          // Save user
          // ---------------------------------------------

          if (res?.user) {

            localStorage.setItem(
              'user',
              JSON.stringify(res.user)
            );

          }


          // ---------------------------------------------
          // Save user ID
          // ---------------------------------------------

          if (res?.user?.id) {

            localStorage.setItem(
              'userId',
              String(res.user.id)
            );

          }


          // ---------------------------------------------
          // Save role
          // ---------------------------------------------

          if (res?.user?.role) {

            localStorage.setItem(
              'role',
              res.user.role
            );

          }


          // ---------------------------------------------
          // Tell application user is logged in
          // ---------------------------------------------

          this.loggedInSubject.next(true);

        })

      );

  }


  // =====================================================
  // REGISTER
  // =====================================================

  register(data: any): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/register`,
      data
    );

  }


  // =====================================================
  // SAVE TOKEN
  // =====================================================

  saveToken(token: string): void {

    if (!token) {
      return;
    }

    localStorage.setItem(
      'token',
      token
    );

    this.loggedInSubject.next(true);

  }


  // =====================================================
  // GET TOKEN
  // =====================================================

  getToken(): string | null {

    return localStorage.getItem('token');

  }


  // =====================================================
  // CHECK LOGIN
  // =====================================================

  isLoggedIn(): boolean {

    return this.hasValidToken();

  }


  // =====================================================
  // VALID TOKEN CHECK
  // =====================================================

  private hasValidToken(): boolean {

    const token =
      localStorage.getItem('token');


    // No token
    if (!token) {

      return false;

    }


    try {

      // JWT format:
      // header.payload.signature

      const parts =
        token.split('.');


      if (parts.length !== 3) {

        return false;

      }


      // Decode payload

      const payload =
        JSON.parse(
          atob(
            parts[1]
              .replace(/-/g, '+')
              .replace(/_/g, '/')
          )
        );


      // Check expiry

      if (
        payload.exp &&
        payload.exp * 1000 <= Date.now()
      ) {

        console.log(
          'Token expired. Clearing session.'
        );

        this.clearSession();

        return false;

      }


      return true;

    }
    catch (error) {

      console.error(
        'Invalid JWT token:',
        error
      );

      this.clearSession();

      return false;

    }

  }


  // =====================================================
  // GET USER
  // =====================================================

  getUser(): any {

    const user =
      localStorage.getItem('user');


    if (!user) {

      return null;

    }


    try {

      return JSON.parse(user);

    }
    catch {

      return null;

    }

  }


  // =====================================================
  // GET ROLE
  // =====================================================

  getRole(): string | null {

    const user =
      this.getUser();


    if (user?.role) {

      return user.role;

    }


    return localStorage.getItem('role');

  }


  // =====================================================
  // LAB STAFF
  // =====================================================

  isLabStaff(): boolean {

    const role =
      this.getRole();


    return (
      role?.toLowerCase() === 'labstaff'
    );

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    console.log(
      'Logging out user...'
    );


    this.clearSession();


    // VERY IMPORTANT
    // Notify AI component
    this.loggedInSubject.next(false);

  }


  // =====================================================
  // CLEAR SESSION
  // =====================================================

  private clearSession(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    localStorage.removeItem('userId');

    localStorage.removeItem('role');

  }

}



