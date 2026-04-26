import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sample {
  id?: string;
  sampleName: string;
  customerName: string;
  barcode: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SampleService {

  private apiUrl = 'http://localhost:5000/api/samples';

  constructor(private http: HttpClient) {}

  addSample(sample: Sample): Observable<Sample> {
    return this.http.post<Sample>(this.apiUrl, sample);
  }

  getSamples(): Observable<Sample[]> {
    return this.http.get<Sample[]>(this.apiUrl);
  }
}