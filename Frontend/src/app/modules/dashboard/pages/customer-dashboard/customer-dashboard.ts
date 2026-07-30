// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { TestService } from '../../../tests/services/test.service';

// @Component({
//   selector: 'app-customer-dashboard',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './customer-dashboard.html',
//   styleUrls: ['./customer-dashboard.css']
// })
// export class CustomerDashboardComponent implements OnInit {

//   customerEmail: string = '';
//   tests: any[] = [];

//   loading = true;

//   constructor(
//     private testService: TestService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {

//     // 👇 assume login stored email in localStorage
//     this.customerEmail = localStorage.getItem('email') || '';

//     if (!this.customerEmail) {
//       alert('Please login first');
//       return;
//     }

//     this.loadCustomerTests();
//   }

//   loadCustomerTests() {
//     this.loading = true;

//     this.testService.getCustomerTests(this.customerEmail).subscribe({
//       next: (res: any) => {
//         this.tests = res.data;
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error(err);
//         this.loading = false;
//       }
//     });
//   }

//   trackTest(id: number) {
//     this.router.navigate(['/tests/test-screen', id]);
//   }
// }