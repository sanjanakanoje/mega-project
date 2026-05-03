import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  baseUrl = 'http://localhost:3000/api/tracking';

  constructor(private http: HttpClient) {}

  getTestsBySample(sampleId: string) {
    return this.http.get(`${this.baseUrl}/test/${sampleId}`);
  }
}