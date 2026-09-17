









// import { 
//   Component, 
//   OnInit, 
//   ChangeDetectorRef 
// } from '@angular/core'; 
 
// import { CommonModule } from '@angular/common'; 
// import { ActivatedRoute } from '@angular/router'; 
// import { TestService } from '../../../tests/services/test.service'; 
// import { Router } from '@angular/router'; 
 
// @Component({ 
//   selector: 'app-tracking-page', 
//   standalone: true, 
//   imports: [CommonModule], 
//   templateUrl: './tracking-page.html', 
//   styleUrls: ['./tracking-page.css'] 
// }) 
// export class TrackingComponent implements OnInit { 
 
//   sample: any = null; 
 
//   requiredTests: string[] = []; 
//   completedTests: string[] = []; 
//   pendingTests: string[] = []; 
 
//   progressPercentage = 0; 
//   loading = true; 
 
//   constructor( 
//     private route: ActivatedRoute, 
//     private testService: TestService, 
//     private cdr: ChangeDetectorRef,
//     private router: Router
//   ) {} 
 
//   ngOnInit(): void { 
 
//     const id = Number( 
//       this.route.snapshot.paramMap.get('id') 
//     ); 
 
//     console.log('Tracking ID:', id); 
 
//     if (!id) { 
//       this.loading = false; 
//       return; 
//     } 
 
//     this.loadTracking(id); 
//   } 
 
//   loadTracking(id: number): void { 
 
//     this.loading = true; 
 
//     this.testService.getTrackingDetails(id) 
//       .subscribe({ 
 
//         next: (res: any) => { 
 
//           console.log('API Response:', res); 
 
//           if (!res || !res.success) { 
//             this.loading = false; 
//             return; 
//           } 
 
//           this.sample = res.data; 
 
//           this.requiredTests = 
//             res.data.testsRequired || []; 
 
//           this.completedTests = 
//             res.data.completedTests || []; 
 
//           this.pendingTests = 
//             res.data.pendingTests || []; 
 
//           this.progressPercentage = 
//             this.requiredTests.length > 0 
//               ? Math.round( 
//                   (this.completedTests.length / 
//                     this.requiredTests.length) * 100 
//                 ) 
//               : 0; 
 
//           this.loading = false; 
 
//           console.log('Sample:', this.sample); 
//           console.log('Required:', this.requiredTests); 
//           console.log('Completed:', this.completedTests); 
//           console.log('Pending:', this.pendingTests); 
 
//           this.cdr.detectChanges(); 
//         }, 
 
//         error: (err) => { 
 
//           console.error(err); 
 
//           this.loading = false; 
 
//           this.cdr.detectChanges(); 
//         } 
//       }); 
//   }


//   // ================================
//   // VIEW REPORT
//   // ================================

//   viewReport(): void {

//     if (!this.sample || !this.sample.id) {
//       alert('Sample ID not found');
//       return;
//     }

//     if (this.pendingTests && this.pendingTests.length > 0) {

//       alert('This test is still pending');

//       return;
//     }

//     this.router.navigate([
//       '/report-view',
//       this.sample.id
//     ]);
//   }
 
// }



import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from '../../../tests/services/test.service';

@Component({
  selector: 'app-tracking-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracking-page.html',
  styleUrls: ['./tracking-page.css']
})
export class TrackingComponent implements OnInit {

  sample: any = null;

  requiredTests: string[] = [];
  completedTests: string[] = [];
  pendingTests: string[] = [];

  progressPercentage = 0;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    console.log('================================');
    console.log('Tracking ID:', id);
    console.log('================================');

    if (!id || isNaN(id)) {

      console.error('Invalid Tracking ID');

      this.loading = false;
      return;
    }

    this.loadTracking(id);
  }


  // ==========================================
  // LOAD TRACKING DATA
  // ==========================================

  loadTracking(id: number): void {

    this.loading = true;

    console.log('Loading tracking data for ID:', id);

    this.testService.getTrackingDetails(id)
      .subscribe({

        next: (res: any) => {

          console.log('Tracking API Response:', res);

          if (!res || !res.success || !res.data) {

            console.error('Invalid tracking response');

            this.sample = null;
            this.requiredTests = [];
            this.completedTests = [];
            this.pendingTests = [];

            this.loading = false;

            this.cdr.detectChanges();

            return;
          }


          // ==========================================
          // SAMPLE DATA
          // ==========================================

          this.sample = res.data;

          console.log('Sample Data:', this.sample);


          // ==========================================
          // REQUIRED TESTS
          // ==========================================

          this.requiredTests =
            this.convertToArray(
              res.data.testsRequired ??
              res.data.tests_required
            );


          // ==========================================
          // COMPLETED TESTS
          // ==========================================

          this.completedTests =
            this.convertToArray(
              res.data.completedTests ??
              res.data.completed_tests
            );


          // ==========================================
          // PENDING TESTS
          // ==========================================

          this.pendingTests =
            this.convertToArray(
              res.data.pendingTests ??
              res.data.pending_tests
            );


          // ==========================================
          // IF API DOES NOT SEND PENDING TESTS
          // CALCULATE THEM OURSELVES
          // ==========================================

          if (
            this.pendingTests.length === 0 &&
            this.requiredTests.length > 0
          ) {

            this.pendingTests =
              this.requiredTests.filter(
                test => !this.completedTests.includes(test)
              );
          }


          // ==========================================
          // PROGRESS
          // ==========================================

          this.progressPercentage =
            this.requiredTests.length > 0
              ? Math.round(
                  (
                    this.completedTests.length /
                    this.requiredTests.length
                  ) * 100
                )
              : 0;


          // Make sure progress never exceeds 100
          if (this.progressPercentage > 100) {
            this.progressPercentage = 100;
          }


          this.loading = false;


          console.log('--------------------------------');
          console.log('Sample:', this.sample);
          console.log('Required Tests:', this.requiredTests);
          console.log('Completed Tests:', this.completedTests);
          console.log('Pending Tests:', this.pendingTests);
          console.log('Progress:', this.progressPercentage);
          console.log('--------------------------------');


          this.cdr.detectChanges();
        },


        error: (err: any) => {

          console.error(
            'Tracking API Error:',
            err
          );

          this.sample = null;
          this.requiredTests = [];
          this.completedTests = [];
          this.pendingTests = [];

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }


  // ==========================================
  // CONVERT API VALUE TO ARRAY
  // ==========================================

  private convertToArray(value: any): string[] {

    if (Array.isArray(value)) {

      return value.map(
        item => String(item).trim()
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
            item => String(item).trim()
          );
        }

      } catch {

        // Normal string
      }


      return [value.trim()];
    }


    if (typeof value === 'object') {

      return Object.values(value).map(
        item => String(item).trim()
      );
    }


    return [];
  }


  // ==========================================
  // GET SAMPLE ID
  // ==========================================

  getSampleId(): number | null {

    if (!this.sample) {
      return null;
    }


    const id =
      this.sample.id ??
      this.sample.sample_id ??
      this.sample.sampleId;


    const numericId = Number(id);


    if (!numericId || isNaN(numericId)) {

      return null;
    }


    return numericId;
  }


  // ==========================================
  // VIEW REPORT
  // ==========================================

  viewReport(): void {

    const sampleId = this.getSampleId();


    console.log('View Report clicked');
    console.log('Sample ID:', sampleId);
    console.log('Required Tests:', this.requiredTests);
    console.log('Completed Tests:', this.completedTests);
    console.log('Pending Tests:', this.pendingTests);


    // ------------------------------------------
    // SAMPLE ID CHECK
    // ------------------------------------------

    if (!sampleId) {

      alert('Sample ID not found');

      return;
    }


    // ------------------------------------------
    // PENDING TEST CHECK
    // ------------------------------------------

    if (this.pendingTests.length > 0) {

      alert('This test is still pending');

      return;
    }


    // ------------------------------------------
    // EXTRA SAFETY CHECK
    // ------------------------------------------

    if (
      this.requiredTests.length > 0 &&
      this.completedTests.length <
      this.requiredTests.length
    ) {

      alert('This test is still pending');

      return;
    }


    // ------------------------------------------
    // ALL TESTS COMPLETED
    // ------------------------------------------

    console.log(
      'All tests completed. Opening report for:',
      sampleId
    );


    this.router.navigate([
      '/report-view',
      sampleId
    ]);
  }

}