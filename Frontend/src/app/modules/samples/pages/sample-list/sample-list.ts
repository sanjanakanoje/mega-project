
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { SampleService } from '../../services/sample';
// import { Router } from '@angular/router';
// import { ChangeDetectorRef } from '@angular/core';

// @Component({
//   selector: 'app-sample-list',
//   standalone: true,   
//   imports: [CommonModule],  
//   templateUrl: './sample-list.html',
//   styleUrls: ['./sample-list.css']
// })
// export class SampleListComponent implements OnInit {

//   samples: any[] = [];
//   loading = true;

//   constructor(
//     private sampleService: SampleService,
//     private router: Router,
//     private cd: ChangeDetectorRef
//   ) {}

//   ngOnInit() {
//     this.sampleService.getAllSamples().subscribe({
//       next: (res) => {
//         console.log("DATA:", res);
//         this.samples = res;
//         this.loading = false;
//         this.cd.detectChanges();
//       },
//       error: (err) => {
//         console.error("Error loading samples:", err);
//         this.loading = false;
//       }
//     });
//   }

//   viewDetails(id: number) {
//   console.log("Clicked ID:", id); // DEBUG
//   this.router.navigate(['/samples/details', id]);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestService } from '../../../tests/services/test.service';

@Component({
  selector: 'app-sample-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sample-list.html',
  styleUrls: ['./sample-list.css']
})
export class SampleListComponent implements OnInit {

  // ✅ store API data
  requests: any[] = [];

  // ✅ loading state (optional but useful)
  loading: boolean = false;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  // ✅ fetch data from backend
  loadRequests(): void {

    this.loading = true;

    this.testService.getAllRequests().subscribe({

      next: (res: any) => {
        console.log('API RESPONSE:', res);

        // ✅ safe assignment
        this.requests = res?.data || [];

        this.loading = false;
      },

      error: (err: any) => {
        console.error('API ERROR:', err);

        this.loading = false;
      }

    });
  }

}