


import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-report-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-view.html',
  styleUrls: ['./report-view.css']
})
export class ReportViewComponent implements OnInit {

  // =========================================
  // VARIABLES
  // =========================================

  sampleId: number = 0;

  reports: any[] = [];

  loading: boolean = true;

  errorMessage: string = '';


  // =========================================
  // CONSTRUCTOR
  // =========================================

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================================
  // INIT
  // =========================================

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    console.log(
      'Report View Sample ID:',
      id
    );


    // -----------------------------------------
    // CHECK ID
    // -----------------------------------------

    if (!id) {

      this.errorMessage =
        'Sample ID not found';

      this.loading = false;

      this.cdr.detectChanges();

      return;
    }


    this.sampleId = Number(id);


    if (
      !this.sampleId ||
      isNaN(this.sampleId)
    ) {

      this.errorMessage =
        'Invalid Sample ID';

      this.loading = false;

      this.cdr.detectChanges();

      return;
    }


    // -----------------------------------------
    // LOAD REPORTS
    // -----------------------------------------

    this.loadReports();
  }


  // =========================================
  // LOAD ALL REPORTS
  // =========================================

  loadReports(): void {

    this.loading = true;

    this.errorMessage = '';

    this.reports = [];


    const url =
      `http://localhost:5000/api/reports/sample/${this.sampleId}`;


    console.log(
      'Getting reports from:',
      url
    );


    this.http.get<any>(url).subscribe({

      // =======================================
      // SUCCESS
      // =======================================

      next: (response: any) => {

        console.log(
          'ALL REPORTS RESPONSE:',
          response
        );


        // ---------------------------------------
        // HANDLE ARRAY RESPONSE
        // ---------------------------------------

        if (Array.isArray(response)) {

          this.reports = response;
        }


        // ---------------------------------------
        // HANDLE { data: [] }
        // ---------------------------------------

        else if (
          Array.isArray(response?.data)
        ) {

          this.reports = response.data;
        }


        // ---------------------------------------
        // HANDLE { reports: [] }
        // ---------------------------------------

        else if (
          Array.isArray(response?.reports)
        ) {

          this.reports = response.reports;
        }


        // ---------------------------------------
        // HANDLE { report: {} }
        // ---------------------------------------

        else if (response?.report) {

          this.reports = [
            response.report
          ];
        }


        // ---------------------------------------
        // NO DATA
        // ---------------------------------------

        else {

          this.reports = [];
        }


        // ---------------------------------------
        // REMOVE NULL / INVALID VALUES
        // ---------------------------------------

        this.reports =
          this.reports.filter(
            report => report != null
          );


        console.log(
          'Reports loaded:',
          this.reports
        );

        console.log(
          'Total reports:',
          this.reports.length
        );


        // ---------------------------------------
        // DEBUG FIRST REPORT
        // ---------------------------------------

        if (this.reports.length > 0) {

          const firstReport =
            this.reports[0];


          console.log(
            'FIRST REPORT:',
            firstReport
          );


          console.log(
            'Test Name:',
            firstReport.test_name
          );


          console.log(
            'Test Method:',
            firstReport.test_method
          );


          console.log(
            'Test Date:',
            firstReport.test_date
          );


          console.log(
            'Result:',
            firstReport.result
          );


          console.log(
            'Observation:',
            firstReport.observation
          );


          console.log(
            'Remarks:',
            firstReport.remarks
          );


          console.log(
            'Notes:',
            firstReport.notes
          );
        }


        this.loading = false;

        this.cdr.detectChanges();
      },


      // =======================================
      // ERROR
      // =======================================

      error: (error: any) => {

        console.error(
          'REPORT API ERROR:',
          error
        );


        this.reports = [];

        this.loading = false;


        this.errorMessage =
          'Failed to load reports';


        this.cdr.detectChanges();
      }

    });
  }


  // =========================================
  // FORMAT DATE
  // =========================================

  formatDate(date: any): string {

    // -----------------------------------------
    // If no test_date, use "-"
    // -----------------------------------------

    if (!date) {

      return '-';
    }


    const value =
      String(date);


    // -----------------------------------------
    // PostgreSQL DATE
    // YYYY-MM-DD
    // -----------------------------------------

    if (
      /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {

      const parts =
        value.split('-');


      return (
        `${parts[2]}-${parts[1]}-${parts[0]}`
      );
    }


    // -----------------------------------------
    // FULL DATE / TIME
    // -----------------------------------------

    const parsedDate =
      new Date(value);


    if (
      isNaN(
        parsedDate.getTime()
      )
    ) {

      return value;
    }


    const day =
      String(
        parsedDate.getDate()
      ).padStart(2, '0');


    const month =
      String(
        parsedDate.getMonth() + 1
      ).padStart(2, '0');


    const year =
      parsedDate.getFullYear();


    return (
      `${day}-${month}-${year}`
    );
  }


  // =========================================
  // GET DISPLAY DATE
  // =========================================

  getReportDate(report: any): string {

    // First preference = test_date
    if (report?.test_date) {

      return this.formatDate(
        report.test_date
      );
    }


    // If old report has no test_date,
    // use created_at

    if (report?.created_at) {

      return this.formatDate(
        report.created_at
      );
    }


    return '-';
  }


  // =========================================
  // PRINT REPORT
  // =========================================

  printReport(): void {

    console.log(
      'Printing Report...'
    );


    window.print();
  }


  // =========================================
  // BACK
  // =========================================

  goBack(): void {

    console.log(
      'Going back to tracking:',
      this.sampleId
    );


    this.router.navigate([
      '/customer-tracking',
      this.sampleId
    ]);
  }

}