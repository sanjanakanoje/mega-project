


// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { TestService } from '../../services/test.service';

// @Component({
//   selector: 'app-test-screen',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './test-screen.html',
//   styleUrls: ['./test-screen.css']
// })
// export class TestScreenComponent implements OnInit {

//   testId: number | null = null;

//   test: any = null;

//   testsRequired: string[] = [];
//   selectedTests: string[] = [];

//   loading = true;
//   errorMessage = '';

//   constructor(
//     private route: ActivatedRoute,
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

//   loadTest(id: number): void {

//     this.loading = true;

//     this.testService.getTestById(id)
//       .subscribe({

//         next: (res: any) => {

//           console.log('API Response:', res);

//           if (res.success) {

//             this.test = res.data;

//             this.testsRequired =
//               res.data.tests_required || [];

//             this.selectedTests =
//               res.data.completed_tests || [];

//             console.log(
//               'Already Completed:',
//               this.selectedTests
//             );

//           } else {

//             this.errorMessage =
//               'No test data found';
//           }

//           this.loading = false;
//           this.cdr.detectChanges();
//         },

//         error: (err) => {

//           console.error(err);

//           this.errorMessage =
//             'Failed to load test';

//           this.loading = false;
//         }
//       });
//   }

//   toggleTest(test: string): void {

//     if (this.selectedTests.includes(test)) {

//       this.selectedTests =
//         this.selectedTests.filter(
//           t => t !== test
//         );

//     } else {

//       this.selectedTests.push(test);
//     }
//   }

//   markDone(test: string): void {

//     if (!this.testId) {
//       return;
//     }

//     if (!this.selectedTests.includes(test)) {

//       this.selectedTests.push(test);
//     }

//     this.testService
//       .updateCompletedTests(
//         this.testId,
//         this.selectedTests
//       )
//       .subscribe({

//         next: (res) => {

//           console.log(
//             'Saved Successfully',
//             res
//           );
//         },

//         error: (err) => {

//           console.error(
//             'Save Failed',
//             err
//           );
//         }
//       });
//   }
// }








import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-test-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-screen.html',
  styleUrls: ['./test-screen.css']
})
export class TestScreenComponent implements OnInit {

  testId: number | null = null;

  test: any = null;

  // Tests requested for this sample
  testsRequired: string[] = [];

  // Tests already completed
  completedTests: string[] = [];

  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
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


  // =====================================================
  // LOAD TEST
  // =====================================================

  loadTest(id: number): void {

    this.loading = true;

    this.testService.getTestById(id)
      .subscribe({

        next: (res: any) => {

          console.log('API Response:', res);

          if (res.success) {

            this.test = res.data;

            // ---------------------------------------------
            // TESTS REQUIRED
            // ---------------------------------------------

            this.testsRequired =
              this.convertToArray(
                res.data.tests_required
              );


            // ---------------------------------------------
            // COMPLETED TESTS
            // ---------------------------------------------

            this.completedTests =
              this.convertToArray(
                res.data.completed_tests
              );


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


  // =====================================================
  // CONVERT API DATA TO ARRAY
  // =====================================================

  private convertToArray(value: any): string[] {

    // Already an array
    if (Array.isArray(value)) {

      return value.map(
        item => String(item)
      );
    }


    // Empty / null / undefined
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {

      return [];
    }


    // JSON string
    if (typeof value === 'string') {

      try {

        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {

          return parsed.map(
            item => String(item)
          );
        }

      } catch {

        // If it is a normal string,
        // treat it as one test
        return [value];
      }

    }


    // Object
    if (typeof value === 'object') {

      return Object.values(value).map(
        item => String(item)
      );
    }


    return [];
  }


  // =====================================================
  // CHECK WHETHER TEST IS COMPLETED
  // =====================================================

  isCompleted(test: string): boolean {

    return this.completedTests.includes(test);
  }


  // =====================================================
  // TOGGLE TEST
  // =====================================================

  toggleTest(test: string): void {

    /*
      We do NOT remove completed tests here.

      Clicking the checkbox only changes the UI selection.
    */

    console.log(
      'Test selected:',
      test
    );
  }


  // =====================================================
  // MARK TEST AS COMPLETED
  // =====================================================

  markDone(test: string): void {

    if (!this.testId) {

      console.error(
        'Invalid Test ID'
      );

      return;
    }


    // Already completed
    if (
      this.completedTests.includes(test)
    ) {

      console.log(
        'Test already completed:',
        test
      );

      return;
    }


    // Add test to completed list
    this.completedTests = [
      ...this.completedTests,
      test
    ];


    console.log(
      'Completed Tests:',
      this.completedTests
    );


    // Save to backend
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

          // Reload from backend to make sure
          // database and UI are synchronized
          this.loadTest(this.testId!);
        },

        error: (err) => {

          console.error(
            'Save Failed:',
            err
          );

          // Rollback UI if backend failed
          this.completedTests =
            this.completedTests.filter(
              t => t !== test
            );
        }
      });
  }
}