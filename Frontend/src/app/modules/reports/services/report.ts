import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl =
    'http://localhost:5000/api/reports';

  constructor(
    private http: HttpClient
  ) {}

  // =====================================================
  // AUTH HEADERS
  // =====================================================

  private getHeaders(): HttpHeaders {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('authToken');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set(
        'Authorization',
        `Bearer ${token}`
      );
    }

    return headers;
  }


  // =====================================================
  // SAVE / UPDATE REPORT
  // =====================================================

  saveReport(reportData: any): Observable<any> {
    console.log(
      'ReportService - Save/Update:',
      reportData
    );

    return this.http.post(
      this.apiUrl,
      reportData,
      {
        headers: this.getHeaders()
      }
    );
  }


  // =====================================================
  // GET ALL REPORTS FOR SAMPLE + TEST
  // =====================================================

  getReportsByTest(
    sampleId: number,
    testName: string
  ): Observable<any> {

    const url =
      `${this.apiUrl}/test/${sampleId}/${encodeURIComponent(testName)}`;

    console.log(
      'ReportService - Get Reports By Test:',
      url
    );

    return this.http.get(
      url,
      {
        headers: this.getHeaders()
      }
    );
  }


  // =====================================================
  // GET SINGLE REPORT BY ID
  // =====================================================

  getReportById(
    reportId: number
  ): Observable<any> {

    const url =
      `${this.apiUrl}/id/${reportId}`;

    console.log(
      'ReportService - Get Report By ID:',
      url
    );

    return this.http.get(
      url,
      {
        headers: this.getHeaders()
      }
    );
  }


  // =====================================================
  // GET ALL REPORTS FOR SAMPLE
  // =====================================================
getReportsBySample(sampleId: number): Observable<any> {
  const url = `${this.apiUrl}/sample/${sampleId}`;

  console.log('Reports API URL:', url);

  return this.http.get(url, {
    headers: this.getHeaders()
  });
}


  // =====================================================
  // OLD GET SINGLE REPORT
  // =====================================================

  getReport(
    sampleId: number,
    testName: string
  ): Observable<any> {

    const url =
      `${this.apiUrl}/${sampleId}/${encodeURIComponent(testName)}`;

    console.log(
      'ReportService - Get Report:',
      url
    );

    return this.http.get(
      url,
      {
        headers: this.getHeaders()
      }
    );
  }
}