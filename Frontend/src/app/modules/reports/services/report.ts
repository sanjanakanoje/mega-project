// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ReportService {

//   private apiUrl = 'http://localhost:5000/api/reports';


//   constructor(
//     private http: HttpClient
//   ) {}


//   // ==========================================
//   // SAVE REPORT
//   // ==========================================
//   saveReport(data: any): Observable<any> {

//     return this.http.post(
//       this.apiUrl,
//       data
//     );

//   }


//   // ==========================================
//   // GET SINGLE REPORT
//   // ==========================================
//   getReport(
//     sampleId: number,
//     testName: string
//   ): Observable<any> {

//     return this.http.get(
//       `${this.apiUrl}/${sampleId}/${encodeURIComponent(testName)}`
//     );

//   }


//   // ==========================================
//   // GET ALL REPORTS
//   // ==========================================
//   getReportsBySample(
//     sampleId: number
//   ): Observable<any[]> {

//     return this.http.get<any[]>(
//       `${this.apiUrl}/sample/${sampleId}`
//     );

//   }

// }
























// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ReportService {

//   private apiUrl = 'http://localhost:5000/api/reports';

//   constructor(
//     private http: HttpClient
//   ) {}


//   // ==========================================
//   // SAVE NEW / UPDATE EXISTING REPORT
//   // ==========================================

//   saveReport(data: any): Observable<any> {

//     return this.http.post(
//       this.apiUrl,
//       data
//     );

//   }


//   // ==========================================
//   // GET ALL REPORTS FOR SAME SAMPLE + TEST
//   // ==========================================

//   getReportsByTest(
//     sampleId: number,
//     testName: string
//   ): Observable<any[]> {

//     return this.http.get<any[]>(
//       `${this.apiUrl}/test/${sampleId}/${encodeURIComponent(testName)}`
//     );

//   }


//   // ==========================================
//   // GET SINGLE REPORT BY REPORT ID
//   // ==========================================

//   getReportById(
//     reportId: number
//   ): Observable<any> {

//     return this.http.get<any>(
//       `${this.apiUrl}/id/${reportId}`
//     );

//   }


//   // ==========================================
//   // OLD METHOD
//   // Keep this so other pages don't break
//   // ==========================================

//   getReport(
//     sampleId: number,
//     testName: string
//   ): Observable<any> {

//     return this.http.get(
//       `${this.apiUrl}/${sampleId}/${encodeURIComponent(testName)}`
//     );

//   }


//   // ==========================================
//   // GET ALL REPORTS FOR SAMPLE
//   // ==========================================

//   getReportsBySample(
//     sampleId: number
//   ): Observable<any[]> {

//     return this.http.get<any[]>(
//       `${this.apiUrl}/sample/${sampleId}`
//     );

//   }

// }















import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  // SAVE / UPDATE REPORT
  // =====================================================

  saveReport(reportData: any): Observable<any> {

    console.log(
      'ReportService - Save/Update:',
      reportData
    );

    return this.http.post(
      this.apiUrl,
      reportData
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

    return this.http.get(url);
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

    return this.http.get(url);
  }

  // =====================================================
  // GET ALL REPORTS FOR SAMPLE
  // =====================================================

  getReportsBySample(
    sampleId: number
  ): Observable<any> {

    const url =
      `${this.apiUrl}/sample/${sampleId}`;

    console.log(
      'ReportService - Get Reports By Sample:',
      url
    );

    return this.http.get(url);
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

    return this.http.get(url);
  }
}
