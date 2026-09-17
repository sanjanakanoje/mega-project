
// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { TestService } from '../../services/test.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-view-samples',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './view-samples.html',
//   styleUrls: ['./view-samples.css']
// })
// export class ViewSamplesComponent implements OnInit {

//   tests: any[] = [];

//   constructor(
//     private testService: TestService,
//     private router: Router,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.loadTests();
//   }

//   loadTests(): void {
//     const userId = Number(localStorage.getItem('userId'));

//     console.log('Logged In User ID:', userId);

//     if (!userId) {
//       console.error('User ID not found');
//       return;
//     }

//     this.testService.getAllTests(userId).subscribe({
//       next: (response: any) => {
//         console.log('Full API Response:', response);

//         this.tests = Array.isArray(response)
//           ? response
//           : (response.data || []);

//         console.log('Final Tests:', this.tests);
//         console.log('Tests Length:', this.tests.length);

//         this.cdr.detectChanges();
//       },
//       error: (error: any) => {
//         console.error('Error fetching tests:', error);
//       }
//     });
//   }


//   // trackSample(id: number): void {
//   //   this.router.navigate(['/tracking', id]);
//   // }

//     parseArray(value: any): string {
//       if (!value) return 'N/A';

//       if (Array.isArray(value)) {
//         return value.join(', ');
//       }

//       try {
//         return JSON.parse(value).join(', ');
//       } catch {
//         return value.toString();
//       }
//     }

//   registerSample() {
//       this.router.navigate(['/tests/create-request']);
//   }

//   trackSample(id: number): void {
//     this.router.navigate(['/customer-tracking', id]);
//   }
  
    
// }


import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { TestService } from '../../services/test.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-samples',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-samples.html',
  styleUrls: ['./view-samples.css']
})
export class ViewSamplesComponent implements OnInit {

  tests: any[] = [];

  loading = true;


  constructor(
    private testService: TestService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  ngOnInit(): void {

    this.loadTests();

  }


  // ==========================================
  // LOAD CUSTOMER TESTS
  // ==========================================

  loadTests(): void {

    this.loading = true;


    const userId =
      Number(
        localStorage.getItem('userId')
      );


    console.log(
      'Logged In User ID:',
      userId
    );


    if (!userId || isNaN(userId)) {

      console.error(
        'User ID not found'
      );

      this.tests = [];

      this.loading = false;

      this.cdr.detectChanges();

      return;
    }


    this.testService
      .getAllTests(userId)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Full API Response:',
            response
          );


          // ==================================
          // HANDLE DIFFERENT API RESPONSES
          // ==================================

          if (Array.isArray(response)) {

            this.tests = response;

          }

          else if (
            response &&
            Array.isArray(response.data)
          ) {

            this.tests = response.data;

          }

          else if (
            response &&
            Array.isArray(response.tests)
          ) {

            this.tests = response.tests;

          }

          else {

            this.tests = [];

          }


          console.log(
            'Final Tests:',
            this.tests
          );

          console.log(
            'Tests Length:',
            this.tests.length
          );


          this.loading = false;

          this.cdr.detectChanges();
        },


        error: (error: any) => {

          console.error(
            'Error fetching tests:',
            error
          );

          this.tests = [];

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }


  // ==========================================
  // PARSE JSON ARRAY
  // ==========================================

  parseArray(value: any): string {

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {

      return 'N/A';
    }


    // Already array

    if (Array.isArray(value)) {

      return value.join(', ');
    }


    // JSON string

    if (typeof value === 'string') {

      try {

        const parsed =
          JSON.parse(value);


        if (Array.isArray(parsed)) {

          return parsed.join(', ');
        }


        return String(parsed);

      }

      catch {

        return value;
      }
    }


    return String(value);
  }


  // ==========================================
  // REGISTER SAMPLE
  // ==========================================

  registerSample(): void {

    this.router.navigate([
      '/tests/create-request'
    ]);
  }


  // ==========================================
  // TRACK SAMPLE
  // ==========================================

  trackSample(id: number): void {

    console.log(
      'Track Sample clicked:',
      id
    );


    if (!id) {

      console.error(
        'Invalid sample ID'
      );

      alert(
        'Sample ID not found'
      );

      return;
    }


    this.router.navigate([
      '/customer-tracking',
      id
    ]);
  }

}