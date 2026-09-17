import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ReportService } from '../../services/report';

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
  // REPORT
  // =====================================================

  report: any = {
    testMethod: '',
    testDate: '',
    observation: '',
    result: '',
    remarks: '',
    notes: ''
  };

  // Existing report ID
  selectedReportId: number | null = null;

  // true = Update
  // false = Save
  reportExists: boolean = false;

  // Saving status
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

      this.testName = params['testName'] || '';

      console.log('=================================');
      console.log('REPORT LIST OPENED');
      console.log('Sample ID:', this.sampleId);
      console.log('Test Name:', this.testName);
      console.log('=================================');

      if (this.sampleId && this.testName) {
        this.loadReport();
      }
    });
  }

  // =====================================================
  // LOAD EXISTING REPORT
  // =====================================================

  loadReport(): void {

    if (!this.sampleId || !this.testName) {

      console.error(
        'Sample ID or Test Name is missing'
      );

      return;
    }

    console.log(
      'Loading reports for:',
      this.sampleId,
      this.testName
    );

    this.reportService
      .getReportsByTest(
        this.sampleId,
        this.testName
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            '================================='
          );

          console.log(
            'FULL REPORT API RESPONSE:',
            response
          );

          console.log(
            '================================='
          );

          const reports =
            this.extractReports(response);

          console.log(
            'REPORTS ARRAY:',
            reports
          );

          // =================================================
          // EXISTING REPORT FOUND
          // =================================================

          if (reports.length > 0) {

            /*
             * Take the latest report.
             *
             * Backend normally returns reports ordered by
             * created_at ASC, so last item is latest.
             */

            const latestReport =
              reports[reports.length - 1];

            console.log(
              'LATEST SAVED REPORT:',
              latestReport
            );

            // -----------------------------------------------
            // Existing report ID
            // -----------------------------------------------

            this.selectedReportId =
              this.getReportId(latestReport);

            // -----------------------------------------------
            // Update mode
            // -----------------------------------------------

            this.reportExists = true;

            // -----------------------------------------------
            // Fill complete form
            // -----------------------------------------------

            this.fillForm(latestReport);

            console.log(
              '================================='
            );

            console.log(
              'FORM AFTER LOADING REPORT:',
              this.report
            );

            console.log(
              'Test Method:',
              this.report.testMethod
            );

            console.log(
              'Test Date:',
              this.report.testDate
            );

            console.log(
              'Observation:',
              this.report.observation
            );

            console.log(
              'Result:',
              this.report.result
            );

            console.log(
              'Remarks:',
              this.report.remarks
            );

            console.log(
              'Notes:',
              this.report.notes
            );

            console.log(
              '================================='
            );

          }

          // =================================================
          // NO REPORT FOUND
          // =================================================

          else {

            console.log(
              'No existing report found.'
            );

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

          /*
           * If API returns 404, simply treat it as
           * no existing report.
           */

          if (error?.status === 404) {

            this.clearForm();

            this.selectedReportId = null;
            this.reportExists = false;

            return;
          }

          /*
           * For other errors also keep form available
           * for creating a new report.
           */

          this.clearForm();

          this.selectedReportId = null;
          this.reportExists = false;
        }
      });
  }

  // =====================================================
  // EXTRACT REPORTS FROM API RESPONSE
  // =====================================================

  private extractReports(response: any): any[] {

    if (!response) {
      return [];
    }

    // -----------------------------------------------
    // API directly returns array
    // -----------------------------------------------

    if (Array.isArray(response)) {
      return response;
    }

    // -----------------------------------------------
    // { data: [...] }
    // -----------------------------------------------

    if (Array.isArray(response.data)) {
      return response.data;
    }

    // -----------------------------------------------
    // { reports: [...] }
    // -----------------------------------------------

    if (Array.isArray(response.reports)) {
      return response.reports;
    }

    // -----------------------------------------------
    // { result: [...] }
    // -----------------------------------------------

    if (Array.isArray(response.result)) {
      return response.result;
    }

    // -----------------------------------------------
    // { rows: [...] }
    // -----------------------------------------------

    if (Array.isArray(response.rows)) {
      return response.rows;
    }

    // -----------------------------------------------
    // { report: {...} }
    // -----------------------------------------------

    if (response.report) {
      return [response.report];
    }

    // -----------------------------------------------
    // { data: {...} }
    // -----------------------------------------------

    if (
      response.data &&
      typeof response.data === 'object' &&
      !Array.isArray(response.data)
    ) {
      return [response.data];
    }

    // -----------------------------------------------
    // Single report object
    // -----------------------------------------------

    if (
      typeof response === 'object' &&
      (
        response.id ||
        response.test_method ||
        response.testMethod ||
        response.test_name ||
        response.testName
      )
    ) {
      return [response];
    }

    return [];
  }

  // =====================================================
  // GET REPORT ID
  // =====================================================

  private getReportId(reportData: any): number | null {

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
  // FILL COMPLETE FORM
  // =====================================================

  fillForm(reportData: any): void {

    console.log(
      'FILLING FORM FROM:',
      reportData
    );

    // ===================================================
    // TEST METHOD
    // ===================================================

    const testMethod =
      reportData?.test_method ??
      reportData?.testMethod ??
      reportData?.method ??
      reportData?.standard ??
      '';

    // ===================================================
    // TEST DATE
    // ===================================================

    const rawDate =
      reportData?.test_date ??
      reportData?.testDate ??
      reportData?.date ??
      '';

    const testDate =
      this.formatDateForInput(rawDate);

    // ===================================================
    // OBSERVATION
    // ===================================================

    const observation =
      reportData?.observation ??
      reportData?.Observation ??
      '';

    // ===================================================
    // RESULT
    // ===================================================

    const result =
      reportData?.result ??
      reportData?.Result ??
      '';

    // ===================================================
    // REMARKS
    // ===================================================

    const remarks =
      reportData?.remarks ??
      reportData?.Remarks ??
      '';

    // ===================================================
    // NOTES
    // ===================================================

    const notes =
      reportData?.notes ??
      reportData?.Notes ??
      '';

    // ===================================================
    // SET FORM
    // ===================================================

    this.report = {
      testMethod: String(testMethod ?? ''),
      testDate: testDate,
      observation: String(observation ?? ''),
      result: String(result ?? ''),
      remarks: String(remarks ?? ''),
      notes: String(notes ?? '')
    };

    console.log(
      'FORM FILLED:',
      this.report
    );
  }

  // =====================================================
  // FORMAT DATE FOR HTML INPUT TYPE DATE
  // =====================================================

  private formatDateForInput(value: any): string {

    if (!value) {
      return '';
    }

    // -----------------------------------------------
    // Convert to string
    // -----------------------------------------------

    const valueString =
      String(value).trim();

    if (!valueString) {
      return '';
    }

    // -----------------------------------------------
    // Already YYYY-MM-DD
    // -----------------------------------------------

    const yyyyMmDd =
      valueString.match(
        /^(\d{4})-(\d{2})-(\d{2})/
      );

    if (yyyyMmDd) {

      return `${yyyyMmDd[1]}-${yyyyMmDd[2]}-${yyyyMmDd[3]}`;
    }

    // -----------------------------------------------
    // Handle DD-MM-YYYY
    // -----------------------------------------------

    const ddMmYyyy =
      valueString.match(
        /^(\d{2})-(\d{2})-(\d{4})$/
      );

    if (ddMmYyyy) {

      return `${ddMmYyyy[3]}-${ddMmYyyy[2]}-${ddMmYyyy[1]}`;
    }

    // -----------------------------------------------
    // Handle DD/MM/YYYY
    // -----------------------------------------------

    const ddSlashMmSlashYyyy =
      valueString.match(
        /^(\d{2})\/(\d{2})\/(\d{4})$/
      );

    if (ddSlashMmSlashYyyy) {

      return `${ddSlashMmSlashYyyy[3]}-${ddSlashMmSlashYyyy[2]}-${ddSlashMmSlashYyyy[1]}`;
    }

    // -----------------------------------------------
    // Handle normal JavaScript date
    // -----------------------------------------------

    const date =
      new Date(valueString);

    if (isNaN(date.getTime())) {

      console.warn(
        'Unable to format date:',
        value
      );

      return '';
    }

    /*
     * Use local date values instead of toISOString()
     * so timezone conversion does not move the date
     * one day backwards.
     */

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        date.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // =====================================================
  // CLEAR FORM
  // =====================================================

    private clearForm(): void {

      const today = new Date();

      const year = today.getFullYear();

      const month = String(
        today.getMonth() + 1
      ).padStart(2, '0');

      const day = String(
        today.getDate()
      ).padStart(2, '0');

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
      
    // -----------------------------------------------
    // VALIDATE SAMPLE
    // -----------------------------------------------

    if (!this.sampleId) {

      alert(
        'Sample ID is required'
      );

      return;
    }

    // -----------------------------------------------
    // VALIDATE TEST NAME
    // -----------------------------------------------

    if (!this.testName) {

      alert(
        'Test name is required'
      );

      return;
    }

    // -----------------------------------------------
    // PREVENT DOUBLE CLICK
    // -----------------------------------------------

    if (this.saving) {
      return;
    }

    this.saving = true;

    // =================================================
    // REQUEST BODY
    // =================================================

    const reportData: any = {

      sample_id:
        this.sampleId,

      test_name:
        this.testName,

      test_method:
        this.report.testMethod || null,

      test_date:
        this.report.testDate || null,

      result:
        this.report.result || null,

      observation:
        this.report.observation || null,

      remarks:
        this.report.remarks || null,

      notes:
        this.report.notes || null,

      created_by:
        this.getCreatedBy()
    };

    // =================================================
    // UPDATE EXISTING REPORT
    // =================================================

    if (
      this.reportExists &&
      this.selectedReportId
    ) {

      reportData.id =
        this.selectedReportId;
    }

    console.log(
      '================================='
    );

    console.log(
      this.reportExists
        ? 'UPDATING REPORT'
        : 'SAVING NEW REPORT'
    );

    console.log(
      'REQUEST BODY:',
      reportData
    );

    console.log(
      '================================='
    );

    // =================================================
    // SAVE API
    // =================================================

    this.reportService
      .saveReport(reportData)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Report Saved Successfully:',
            response
          );

          this.saving = false;

          alert(
            this.reportExists
              ? 'Report updated successfully'
              : 'Report saved successfully'
          );

          // -------------------------------------------
          // RETURN TO TEST SCREEN
          // -------------------------------------------

          if (this.sampleId) {

            this.router.navigate([
              'tests/test-screen',
              this.sampleId
            ]);

          }
        },

        error: (error: any) => {

          console.error(
            'Save Report Error:',
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
  // GET LOGGED IN USER ID
  // =====================================================

  private getCreatedBy(): number | null {

    try {

      const userId =
        localStorage.getItem('userId');

      if (userId) {

        const parsedUserId =
          Number(userId);

        if (!isNaN(parsedUserId)) {
          return parsedUserId;
        }
      }

    } catch (error) {

      console.error(
        'Error getting user ID:',
        error
      );
    }

    return null;
  }

  // =====================================================
  // BACK
  // =====================================================

  goBack(): void {

    if (this.saving) {
      return;
    }

    if (this.sampleId) {

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