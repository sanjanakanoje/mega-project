// src/app/modules/samples/services/sample.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SampleService {

  // Backend API Base URL
  private apiUrl = 'http://localhost:5000/api/sample';

  constructor(private http: HttpClient) {}

  // Add New Sample
  addSample(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/add`,
      data
    );
  }

  // Get All Samples
  // getAllSamples(): Observable<any> {
  //   return this.http.get(
  //     `${this.apiUrl}/all`
  //   );
  // }
  getAllSamples() {
  return this.http.get<any[]>('http://localhost:5000/api/sample');
  }

  // // Get Sample By ID
  // getSampleById(id: number): Observable<any> {
  //   return this.http.get(
  //     `${this.apiUrl}/${id}`
  //   );
  // }

  // Update Sample Status
  updateSample(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/update/${id}`,
      data
    );
  }

  // Delete Sample
  deleteSample(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/delete/${id}`
    );
  }

  getSamples() {
  return this.http.get<any[]>('http://localhost:5000/api/sample');
}

  getSampleById(id: number) {
    return this.http.get<any>('http://localhost:5000/api/sample/' + id);
  }


  getSamplesByUser(userId: number) {
  return this.http.get<any[]>(`http://localhost:5000/api/samples/${userId}`);
  }


  getFullSample(id: number) {
  return this.http.get<any>(`http://localhost:5000/api/sample/full/${id}`);
  }

}