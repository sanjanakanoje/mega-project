


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
//     this.testId = Number(this.route.snapshot.paramMap.get('id'));

//     console.log('🔥 Test Screen ID:', this.testId);

//     if (!this.testId) {
//       this.loading = false;
//       this.errorMessage = 'Invalid Test ID';
//       return;
//     }

//     this.loadTest(this.testId);
//   }


//     //  LOAD TEST DATA

//   loadTest(id: number) {
//     this.loading = true;

//     this.testService.getTestById(id).subscribe({
//       next: (res: any) => {
//         console.log('API RESPONSE:', res);

//         if (res?.success) {
//           this.test = res.data;
//           this.testsRequired = res.data?.tests_required || [];
//         } else {
//           this.errorMessage = 'No data found';
//         }

//         this.loading = false;
//         this.cdr.detectChanges();
//       },

//       error: (err) => {
//         console.error(err);
//         this.errorMessage = 'Failed to load test data';
//         this.loading = false;
//       }
//     });
//   }


//     //  TOGGLE TEST (FIXED)
 
//   toggleTest(test: string) {
//     const exists = this.selectedTests.includes(test);

//     this.selectedTests = exists
//       ? this.selectedTests.filter(t => t !== test)
//       : [...this.selectedTests, test]; 
//     console.log('Selected Tests:', this.selectedTests);
//   }


//       //  MARK DONE (OPTIONAL FUTURE API)
//   markDone(test: string) {

//     if (!this.testId) {
//       console.error('Test ID missing');
//       return;
//     }

//     // Add only if not already completed
//     if (!this.selectedTests.includes(test)) {
//       this.selectedTests.push(test);
//     }

//     console.log('Completed Tests:', this.selectedTests);

//     this.testService
//       .updateCompletedTests(this.testId, this.selectedTests)
//       .subscribe({
//         next: (res) => {
//           console.log('Saved successfully', res);
//         },
//         error: (err) => {
//           console.error('Save failed', err);
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

  testsRequired: string[] = [];
  selectedTests: string[] = [];

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

  loadTest(id: number): void {

    this.loading = true;

    this.testService.getTestById(id)
      .subscribe({

        next: (res: any) => {

          console.log('API Response:', res);

          if (res.success) {

            this.test = res.data;

            this.testsRequired =
              res.data.tests_required || [];

            this.selectedTests =
              res.data.completed_tests || [];

            console.log(
              'Already Completed:',
              this.selectedTests
            );

          } else {

            this.errorMessage =
              'No test data found';
          }

          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(err);

          this.errorMessage =
            'Failed to load test';

          this.loading = false;
        }
      });
  }

  toggleTest(test: string): void {

    if (this.selectedTests.includes(test)) {

      this.selectedTests =
        this.selectedTests.filter(
          t => t !== test
        );

    } else {

      this.selectedTests.push(test);
    }
  }

  markDone(test: string): void {

    if (!this.testId) {
      return;
    }

    if (!this.selectedTests.includes(test)) {

      this.selectedTests.push(test);
    }

    this.testService
      .updateCompletedTests(
        this.testId,
        this.selectedTests
      )
      .subscribe({

        next: (res) => {

          console.log(
            'Saved Successfully',
            res
          );
        },

        error: (err) => {

          console.error(
            'Save Failed',
            err
          );
        }
      });
  }
}