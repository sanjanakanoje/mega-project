// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class TestService {

//   private apiUrl = 'http://localhost:5000/api/tests';

//   constructor(private http: HttpClient) {}

//   createRequest(data: any) {
//     return this.http.post(`${this.apiUrl}/create`, data);
//   }

//   // ✅ ADD THIS METHOD
//   getAllRequests() {
//     return this.http.get<any>('http://localhost:5000/api/tests');
//   }
//   getSingleTest(id: string) {
//   return this.http.get<any>(`${this.apiUrl}/${id}`);
//   }
//   getTestRequirements(id: string | number) {
//     return this.http.get(
//       `http://localhost:5000/api/tracking/test/${id}`
//     );
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiUrl = 'http://localhost:5000/api/tests';
  private trackingUrl = 'http://localhost:5000/api/tracking';

  constructor(private http: HttpClient) {}

  // =========================
  // CREATE TEST REQUEST
  // =========================
  createRequest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  // =========================
  // GET ALL TEST REQUESTS
  // =========================
  getAllRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // =========================
  // GET SINGLE TEST BY ID
  // (USED IN TEST-SCREEN)
  // =========================
  getSingleTest(id: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // (OPTIONAL ALIAS - safer for your component)
  getTestById(id: string | number): Observable<any> {
    return this.getSingleTest(id);
  }

  // =========================
  // GET TEST REQUIREMENTS
  // =========================
  getTestRequirements(id: string | number): Observable<any> {
    return this.http.get(`${this.trackingUrl}/test/${id}`);
  }

  getAllTests(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`);
  }

}