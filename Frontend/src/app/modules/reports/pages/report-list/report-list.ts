import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  ReportService
} from '../../services/report';


@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './report-list.html',
  styleUrls: ['./report-list.css']
})
export class ReportListComponent implements OnInit {

  // =====================================================
  // SAMPLE / TEST DETAILS
  // =====================================================

  sampleId: number | null = null;

  testName: string = '';


  // =====================================================
  // REPORT FORM
  // =====================================================

  report: any = {
    testMethod: '',
    testDate: '',
    observation: '',
    result: '',
    remarks: '',
    notes: ''
  };


  // =====================================================
  // EXISTING REPORT DETAILS
  // =====================================================

  selectedReportId: number | null = null;

  reportExists: boolean = false;

  saving: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {

      this.sampleId = params['sampleId']
        ? Number(params['sampleId'])
        : null;

      this.testName =
        params['testName'] || '';

      console.log('=================================');
      console.log('REPORT LIST OPENED');
      console.log('Sample/Test Request ID:', this.sampleId);
      console.log('Test Name:', this.testName);
      console.log('=================================');

      if (
        this.sampleId !== null &&
        this.sampleId > 0 &&
        this.testName.trim()
      ) {
        this.loadReport();
      } else {
        this.clearForm();
      }
    });
  }


  // =====================================================
  // LOAD EXISTING REPORT
  // =====================================================

  loadReport(): void {
    if (
      this.sampleId === null ||
      !this.testName.trim()
    ) {
      return;
    }

    this.reportService
      .getReportsByTest(
        this.sampleId,
        this.testName
      )
      .subscribe({
        next: (response: any) => {

          console.log(
            'FULL REPORT API RESPONSE:',
            response
          );

          const reports =
            this.extractReports(response);

          if (reports.length > 0) {

            const latestReport =
              reports[reports.length - 1];

            this.selectedReportId =
              this.getReportId(latestReport);

            this.reportExists =
              this.selectedReportId !== null;

            this.fillForm(latestReport);

          } else {

            this.clearForm();

            this.selectedReportId = null;

            this.reportExists = false;
          }
        },

        error: (error: any) => {

          console.error(
            'Load Report Error:',
            error
          );

          this.clearForm();

          this.selectedReportId = null;

          this.reportExists = false;
        }
      });
  }


  // =====================================================
  // EXTRACT REPORTS
  // =====================================================

  private extractReports(
    response: any
  ): any[] {

    if (!response) {
      return [];
    }

    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response.reports)) {
      return response.reports;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (Array.isArray(response.rows)) {
      return response.rows;
    }

    if (response.report) {
      return [response.report];
    }

    if (
      response.data &&
      typeof response.data === 'object'
    ) {
      return [response.data];
    }

    if (
      response.id ||
      response.test_method ||
      response.test_name
    ) {
      return [response];
    }

    return [];
  }


  // =====================================================
  // GET REPORT ID
  // =====================================================

  private getReportId(
    reportData: any
  ): number | null {

    if (!reportData) {
      return null;
    }

    if (
      reportData.id !== undefined &&
      reportData.id !== null
    ) {
      return Number(reportData.id);
    }

    if (
      reportData.report_id !== undefined &&
      reportData.report_id !== null
    ) {
      return Number(reportData.report_id);
    }

    if (
      reportData.reportId !== undefined &&
      reportData.reportId !== null
    ) {
      return Number(reportData.reportId);
    }

    return null;
  }


  // =====================================================
  // FILL FORM
  // =====================================================

  fillForm(reportData: any): void {

    const testMethod =
      reportData?.test_method ??
      reportData?.testMethod ??
      '';

    const rawDate =
      reportData?.test_date ??
      reportData?.testDate ??
      '';

    this.report = {
      testMethod: String(testMethod || ''),

      testDate:
        this.formatDateForInput(rawDate),

      observation: String(
        reportData?.observation || ''
      ),

      result: String(
        reportData?.result || ''
      ),

      remarks: String(
        reportData?.remarks || ''
      ),

      notes: String(
        reportData?.notes || ''
      )
    };
  }


  // =====================================================
  // FORMAT DATE
  // =====================================================

  private formatDateForInput(
    value: any
  ): string {

    if (!value) {
      return '';
    }

    const valueString =
      String(value).trim();

    const yyyyMmDd =
      valueString.match(
        /^(\d{4})-(\d{2})-(\d{2})/
      );

    if (yyyyMmDd) {
      return `${yyyyMmDd[1]}-${yyyyMmDd[2]}-${yyyyMmDd[3]}`;
    }

    const date =
      new Date(valueString);

    if (isNaN(date.getTime())) {
      return '';
    }

    const year =
      date.getFullYear();

    const month =
      String(date.getMonth() + 1)
        .padStart(2, '0');

    const day =
      String(date.getDate())
        .padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  // =====================================================
  // CLEAR FORM
  // =====================================================

  private clearForm(): void {

    const today =
      new Date();

    const year =
      today.getFullYear();

    const month =
      String(today.getMonth() + 1)
        .padStart(2, '0');

    const day =
      String(today.getDate())
        .padStart(2, '0');

    this.report = {
      testMethod: '',
      testDate: `${year}-${month}-${day}`,
      observation: '',
      result: '',
      remarks: '',
      notes: ''
    };
  }


  // =====================================================
  // SAVE / UPDATE REPORT
  // =====================================================

  saveReport(): void {

    if (
      this.sampleId === null ||
      this.sampleId <= 0
    ) {
      alert('Sample/Test Request ID is required');
      return;
    }

    if (!this.testName.trim()) {
      alert('Test name is required');
      return;
    }

    if (
      !this.report.testMethod ||
      !this.report.testMethod.trim()
    ) {
      alert('Test method / standard is required');
      return;
    }

    if (this.saving) {
      return;
    }

    this.saving = true;


    // =================================================
    // REQUEST BODY
    // =================================================
    /*
      created_by intentionally removed.
      Backend will get user ID from JWT token.
    */

    const reportData: any = {

      sample_id:
        this.sampleId,

      test_name:
        this.testName.trim(),

      test_method:
        this.report.testMethod.trim(),

      test_date:
        this.report.testDate || null,

      result:
        this.report.result || null,

      observation:
        this.report.observation || null,

      remarks:
        this.report.remarks || null,

      notes:
        this.report.notes || null
    };


    // =================================================
    // UPDATE MODE
    // =================================================

    if (
      this.reportExists &&
      this.selectedReportId !== null
    ) {
      reportData.id =
        this.selectedReportId;
    }


    console.log(
      'REPORT REQUEST BODY:',
      reportData
    );


    // =================================================
    // API CALL
    // =================================================

    this.reportService
      .saveReport(reportData)
      .subscribe({

        next: (response: any) => {

          console.log(
            'REPORT SAVED:',
            response
          );

          this.saving = false;

          alert(
            this.reportExists
              ? 'Report updated successfully'
              : 'Report saved successfully'
          );

          if (this.sampleId !== null) {
            this.router.navigate([
              '/tests/test-screen',
              this.sampleId
            ]);
          }
        },

        error: (error: any) => {

          console.error(
            'SAVE REPORT ERROR:',
            error
          );

          this.saving = false;

          alert(
            error?.error?.message ||
            'Failed to save report'
          );
        }
      });
  }


  // =====================================================
  // BACK
  // =====================================================

  goBack(): void {

    if (this.saving) {
      return;
    }

    if (this.sampleId !== null) {

      this.router.navigate([
        '/tests/test-screen',
        this.sampleId
      ]);

    } else {

      this.router.navigate([
        '/samples'
      ]);
    }
  }
}