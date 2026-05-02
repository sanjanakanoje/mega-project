// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { TestService } from '../../services/test.service';

// @Component({
//   selector: 'app-test-screen',
//   templateUrl: './test-screen.html',
//   styleUrls: ['./test-screen.css']
// })
// export class TestScreenComponent implements OnInit {

//   testId: string | null = null;

//   loading = false;
//   errorMessage = '';

//   companyName = '';
//   testsRequired: string[] = [];

//   test: any = null;

//   constructor(
//     private route: ActivatedRoute,
//     private testService: TestService
//   ) {}

//   ngOnInit(): void {
//     this.route.paramMap.subscribe(params => {
//       this.testId = params.get('id');

//       if (this.testId) {
//         this.loadTest(this.testId);
//       } else {
//         this.errorMessage = 'Invalid Test ID';
//       }
//     });
//   }

//   /* =========================
//      LOAD TEST DETAILS
//   ========================= */
//   loadTest(id: string) {
//     this.loading = true;
//     this.errorMessage = '';

//     this.testService.getTestById(id).subscribe({
//       next: (res: any) => {
//         console.log('TEST SCREEN API:', res);

//         if (res?.success) {
//           this.test = res.data;

//           this.companyName = res.data.company_name;
//           this.testsRequired = res.data.tests_required || [];
//         } else {
//           this.errorMessage = 'No data found';
//         }

//         this.loading = false;
//       },
//       error: (err) => {
//         console.error(err);
//         this.errorMessage = 'Failed to load test details';
//         this.loading = false;
//       }
//     });
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
    this.testId = Number(this.route.snapshot.paramMap.get('id'));

    console.log('🔥 Test Screen ID:', this.testId);

    if (!this.testId) {
      this.loading = false;
      this.errorMessage = 'Invalid Test ID';
      return;
    }

    this.loadTest(this.testId);
  }

  /* =========================
     LOAD TEST DATA
  ========================= */
  loadTest(id: number) {
    this.loading = true;

    this.testService.getTestById(id).subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);

        if (res?.success) {
          this.test = res.data;
          this.testsRequired = res.data?.tests_required || [];
        } else {
          this.errorMessage = 'No data found';
        }

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load test data';
        this.loading = false;
      }
    });
  }

  /* =========================
     SELECT / UNSELECT TEST
  ========================= */
  toggleTest(test: string) {
    if (this.selectedTests.includes(test)) {
      this.selectedTests = this.selectedTests.filter(t => t !== test);
    } else {
      this.selectedTests.push(test);
    }

    console.log('Selected Tests:', this.selectedTests);
  }

  /* =========================
     MARK DONE (FUTURE API)
  ========================= */
  markDone(test: string) {
    console.log('Completed:', test);
  }
}