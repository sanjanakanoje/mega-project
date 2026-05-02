// import { Component, OnInit } from '@angular/core';
// import { SampleService } from '../../services/sample';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common'; 

// @Component({
//   selector: 'app-sample-list',
//   standalone: true,            
//   imports: [CommonModule],
//   templateUrl: './sample-list.html',
//   styleUrls: ['./sample-list.css']   // optional but good practice
// })
// export class SampleListComponent implements OnInit {

//   samples: any[] = [];
//   loading: boolean = false;
//   error: string = '';

//   constructor(
//     private sampleService: SampleService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.loadSamples();
//   }

//   loadSamples(): void {
//     this.loading = true;

//     this.sampleService.getAllSamples().subscribe({
//       next: (res: any[]) => {
//         console.log("DATA:", res);
//         this.samples = res;
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Error loading samples:', err);
//         this.error = 'Failed to load samples';
//         this.loading = false;
//       }
//     });
//   }

//   viewDetails(id: number): void {
//     if (!id) return;  // safety check
//     this.router.navigate(['/samples/details', id]);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleService } from '../../services/sample';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sample-list',
  standalone: true,   
  imports: [CommonModule],  
  templateUrl: './sample-list.html',
  styleUrls: ['./sample-list.css']
})
export class SampleListComponent implements OnInit {

  samples: any[] = [];
  loading = true;

  constructor(
    private sampleService: SampleService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.sampleService.getAllSamples().subscribe({
      next: (res) => {
        console.log("DATA:", res);
        this.samples = res;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Error loading samples:", err);
        this.loading = false;
      }
    });
  }

  viewDetails(id: number) {
  console.log("Clicked ID:", id); // DEBUG
  this.router.navigate(['/samples/details', id]);
  }
}