
// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { ActivatedRoute, Router} from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { TestService } from '../../services/test.service';
// import { ReportService } from '../../../reports/services/report';

// @Component({
//   selector: 'app-test-screen',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './test-screen.html',
//   styleUrls: ['./test-screen.css']
// })



// export class TestScreenComponent implements OnInit {



//     hasReport(test: any): boolean {
//     if (!test) {
//       return false;
//     }

//     return !!(
//       test.hasReport ||
//       test.reportExists ||
//       test.report_id ||
//       test.reportId
//     );
//   }



//   testId: number | null = null;

//   test: any = null;

//   // Tests requested for this sample
//   testsRequired: string[] = [];

//   // Tests already completed
//   completedTests: string[] = [];

//   loading = true;
//   errorMessage = '';

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private testService: TestService,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {

//     this.testId = Number(
//       this.route.snapshot.paramMap.get('id')
//     );

//     if (!this.testId) {

//       this.errorMessage = 'Invalid Test ID';

//       this.loading = false;

//       return;
//     }

//     this.loadTest(this.testId);
//   }


//   // =====================================================
//   // LOAD TEST
//   // =====================================================

//   loadTest(id: number): void {

//     this.loading = true;

//     this.testService.getTestById(id)
//       .subscribe({

//         next: (res: any) => {

//           console.log('API Response:', res);

//           if (res.success) {

//             this.test = res.data;

//             // ---------------------------------------------
//             // TESTS REQUIRED
//             // ---------------------------------------------

//             this.testsRequired =
//               this.convertToArray(
//                 res.data.tests_required
//               );


//             // ---------------------------------------------
//             // COMPLETED TESTS
//             // ---------------------------------------------

//             this.completedTests =
//               this.convertToArray(
//                 res.data.completed_tests
//               );


//             console.log(
//               'Tests Required:',
//               this.testsRequired
//             );

//             console.log(
//               'Completed Tests:',
//               this.completedTests
//             );

//           } else {

//             this.errorMessage =
//               'No test data found';
//           }

//           this.loading = false;

//           this.cdr.detectChanges();
//         },

//         error: (err) => {

//           console.error(
//             'Load Test Error:',
//             err
//           );

//           this.errorMessage =
//             'Failed to load test';

//           this.loading = false;
//         }
//       });
//   }


//   // =====================================================
//   // CONVERT API DATA TO ARRAY
//   // =====================================================

//   private convertToArray(value: any): string[] {

//     // Already an array
//     if (Array.isArray(value)) {

//       return value.map(
//         item => String(item)
//       );
//     }


//     // Empty / null / undefined
//     if (
//       value === null ||
//       value === undefined ||
//       value === ''
//     ) {

//       return [];
//     }


//     // JSON string
//     if (typeof value === 'string') {

//       try {

//         const parsed = JSON.parse(value);

//         if (Array.isArray(parsed)) {

//           return parsed.map(
//             item => String(item)
//           );
//         }

//       } catch {

//         // If it is a normal string,
//         // treat it as one test
//         return [value];
//       }

//     }


//     // Object
//     if (typeof value === 'object') {

//       return Object.values(value).map(
//         item => String(item)
//       );
//     }


//     return [];
//   }


//   // =====================================================
//   // CHECK WHETHER TEST IS COMPLETED
//   // =====================================================

//   isCompleted(test: string): boolean {

//     return this.completedTests.includes(test);
//   }


//   // =====================================================
//   // TOGGLE TEST
//   // =====================================================

//   toggleTest(test: string): void {

//     /*
//       We do NOT remove completed tests here.

//       Clicking the checkbox only changes the UI selection.
//     */

//     console.log(
//       'Test selected:',
//       test
//     );
//   }


//   // =====================================================
//   // MARK TEST AS COMPLETED
//   // =====================================================

//   markDone(test: string): void {

//     if (!this.testId) {

//       console.error(
//         'Invalid Test ID'
//       );

//       return;
//     }


//     // Already completed
//     if (
//       this.completedTests.includes(test)
//     ) {

//       console.log(
//         'Test already completed:',
//         test
//       );

//       return;
//     }


//     // Add test to completed list
//     this.completedTests = [
//       ...this.completedTests,
//       test
//     ];


//     console.log(
//       'Completed Tests:',
//       this.completedTests
//     );


//     // Save to backend
//     this.testService
//       .updateCompletedTests(
//         this.testId,
//         this.completedTests
//       )
//       .subscribe({

//         next: (res) => {

//           console.log(
//             'Saved Successfully:',
//             res
//           );

//           // Reload from backend to make sure
//           // database and UI are synchronized
//           this.loadTest(this.testId!);
//         },

//         error: (err) => {

//           console.error(
//             'Save Failed:',
//             err
//           );

//           // Rollback UI if backend failed
//           this.completedTests =
//             this.completedTests.filter(
//               t => t !== test
//             );
//         }
//       });
//   }


//   addReport(test: any): void {

//   let testName = '';


//   // If test is a string
//   if (typeof test === 'string') {

//     testName = test;

//   }

//   // If test is an object
//   else {

//     testName =
//       test.test_name ||
//       test.name ||
//       test.testName ||
//       '';

//   }


//   if (!testName) {

//     alert(
//       'Test name not found'
//     );

//     return;

//   }

//   // Check whether test is completed
//   if (!this.isCompleted(testName)) {

//     alert(
//       'Your test is not completed. Please complete the test first.'
//     );

//     return;
//   }


//   console.log(
//     'Opening report for:',
//     this.testId,
//     testName
//   );


//   this.router.navigate(
//     ['/report-list'],
//     {
//       queryParams: {

//         sampleId:
//           this.testId,

//         testName:
//           testName

//       }
//     }
//   );

// }


// }



























import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestService } from '../../services/test.service';
import { ReportService } from '../../../reports/services/report';

@Component({
  selector: 'app-test-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-screen.html',
  styleUrls: ['./test-screen.css']
})
export class TestScreenComponent implements OnInit {

  // =========================================================
  // CHECK WHETHER REPORT EXISTS FOR A TEST
  // =========================================================
  hasReport(test: any): boolean {
    const testName =
      typeof test === 'string'
        ? test
        : test?.test_name ||
          test?.name ||
          test?.testName ||
          '';

    if (!testName) {
      return false;
    }

    return !!this.reportStatus[testName];
  }

  testId: number | null = null;
  test: any = null;

  // Tests requested for this sample
  testsRequired: string[] = [];

  // Tests already completed
  completedTests: string[] = [];

  // Reports already saved for each test
  reportStatus: { [testName: string]: boolean } = {};

  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.testId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!this.testId) {
      this.errorMessage = 'Invalid Test ID';
      this.loading = false;
      return;
    }

    this.loadTest(this.testId);
  }

  loadTest(id: number): void {
    this.loading = true;

    this.testService.getTestById(id)
      .subscribe({
        next: (res: any) => {
          console.log('API Response:', res);

          if (res.success) {
            this.test = res.data;

            this.testsRequired =
              this.convertToArray(
                res.data.tests_required
              );

            this.completedTests =
              this.convertToArray(
                res.data.completed_tests
              );

            // Check which tests already have reports
            this.checkReports();

            console.log(
              'Tests Required:',
              this.testsRequired
            );

            console.log(
              'Completed Tests:',
              this.completedTests
            );

          } else {
            this.errorMessage =
              'No test data found';
          }

          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(
            'Load Test Error:',
            err
          );

          this.errorMessage =
            'Failed to load test';

          this.loading = false;
        }
      });
  }

  // =========================================================
  // CHECK REPORTS FOR ALL TESTS
  // =========================================================
  checkReports(): void {
    this.reportStatus = {};

    if (!this.testId) {
      return;
    }

    this.testsRequired.forEach((testName: string) => {

      this.reportService
        .getReportsByTest(
          this.testId!,
          testName
        )
        .subscribe({
          next: (response: any) => {

            let reports: any[] = [];

            if (Array.isArray(response)) {
              reports = response;

            } else if (Array.isArray(response?.data)) {
              reports = response.data;

            } else if (Array.isArray(response?.reports)) {
              reports = response.reports;

            } else if (response?.report) {
              reports = [response.report];
            }

            this.reportStatus[testName] =
              reports.length > 0;

            console.log(
              'Report status:',
              testName,
              this.reportStatus[testName]
            );

            this.cdr.detectChanges();
          },

          error: (error) => {

            if (error?.status === 404) {

              this.reportStatus[testName] = false;

            } else {

              console.error(
                'Report check failed:',
                testName,
                error
              );

              this.reportStatus[testName] = false;
            }

            this.cdr.detectChanges();
          }
        });
    });
  }

  // =========================================================
  // CONVERT VALUE TO ARRAY
  // =========================================================
  private convertToArray(value: any): string[] {

    if (Array.isArray(value)) {
      return value.map(
        item => String(item)
      );
    }

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return [];
    }

    if (typeof value === 'string') {

      try {

        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
          return parsed.map(
            item => String(item)
          );
        }

      } catch {

        return [value];

      }
    }

    if (typeof value === 'object') {

      return Object.values(value).map(
        item => String(item)
      );
    }

    return [];
  }

  // =========================================================
  // CHECK TEST COMPLETED OR NOT
  // =========================================================
  isCompleted(test: string): boolean {
    return this.completedTests.includes(test);
  }

  toggleTest(test: string): void {

    console.log(
      'Test selected:',
      test
    );
  }

  // =========================================================
  // MARK TEST AS COMPLETED
  // =========================================================
  markDone(test: string): void {

    if (!this.testId) {

      console.error(
        'Invalid Test ID'
      );

      return;
    }

    if (
      this.completedTests.includes(test)
    ) {

      console.log(
        'Test already completed:',
        test
      );

      return;
    }

    this.completedTests = [
      ...this.completedTests,
      test
    ];

    console.log(
      'Completed Tests:',
      this.completedTests
    );

    this.testService
      .updateCompletedTests(
        this.testId,
        this.completedTests
      )
      .subscribe({

        next: (res) => {

          console.log(
            'Saved Successfully:',
            res
          );

          this.loadTest(this.testId!);
        },

        error: (err) => {

          console.error(
            'Save Failed:',
            err
          );

          this.completedTests =
            this.completedTests.filter(
              t => t !== test
            );
        }
      });
  }

  // =========================================================
  // OPEN REPORT
  // =========================================================
  addReport(test: any): void {

    let testName = '';

    if (typeof test === 'string') {

      testName = test;

    } else {

      testName =
        test.test_name ||
        test.name ||
        test.testName ||
        '';
    }

    if (!testName) {

      alert(
        'Test name not found'
      );

      return;
    }

    // Test must be completed before adding/updating report
    if (!this.isCompleted(testName)) {

      alert(
        'Your test is not completed. Please complete the test first.'
      );

      return;
    }

    console.log(
      'Opening report for:',
      this.testId,
      testName
    );

    this.router.navigate(
      ['/report-list'],
      {
        queryParams: {
          sampleId:
            this.testId,

          testName:
            testName
        }
      }
    );
  }
}