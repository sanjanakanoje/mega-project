// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router'; 
// import { TestService } from '../../services/test.service';

// @Component({
//   selector: 'app-test-list',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './test-list.component.html',
//   styleUrls: ['./test-list.component.css']
// })
// export class TestListComponent implements OnInit {

//   requests: any[] = [];

//   constructor(private testService: TestService) {}

//   ngOnInit(): void {
//     console.log('COMPONENT LOADED'); // ✅ debug
//     this.loadTests();
//   }

//   loadTests() {
//     console.log('CALLING API...'); // ✅ debug

//     this.testService.getAllRequests().subscribe({
//       next: (res: any) => {
//         console.log('API RESPONSE:', res);

//         // ✅ IMPORTANT FIX
//         this.requests = res?.data || [];

//         console.log('FINAL DATA:', this.requests);
//       },
//       error: (err) => {
//         console.error('API ERROR:', err);
//       }
//     });
//   }

//   viewTest(id: number) {
//     console.log('Navigating to test:', id);
//     this.router.navigate(['/tests', id]);
//   }

// }


import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css']
})
export class TestListComponent implements OnInit {

  requests: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private testService: TestService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('✅ COMPONENT LOADED');
    this.loadTests();
  }

  loadTests() {
    console.log('📡 CALLING API...');
    this.loading = true;

    this.testService.getAllRequests().subscribe({
      next: (res: any) => {
        console.log('✅ API RESPONSE:', res);

        this.requests = res?.data || [];

        console.log('📦 FINAL DATA:', this.requests);

        this.loading = false;

        // ✅ force UI update fix
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('❌ API ERROR:', err);
        this.errorMessage = 'Failed to load test requests';
        this.loading = false;
      }
    });
  }

  viewTest(id: number) {
    console.log('➡️ Navigating to:', id);
    this.router.navigate(['/tests', id]);
  }
}