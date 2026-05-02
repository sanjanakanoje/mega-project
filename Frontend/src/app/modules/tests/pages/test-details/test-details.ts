


// import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { TestService } from '../../services/test.service';
// import JsBarcode from 'jsbarcode';

// @Component({
//   selector: 'app-test-details',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './test-details.html',
//   styleUrls: ['./test-details.css']
// })
// export class TestDetailsComponent implements OnInit {

//   test: any = null;
//   loading: boolean = true;

//   @ViewChild('barcode', { static: false }) barcodeElement!: ElementRef;

//   constructor(
//     private route: ActivatedRoute,
//     private testService: TestService,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.route.paramMap.subscribe(params => {
//       const id = params.get('id');
//       if (id) {
//         this.loadTest(id);
//       }
//     });
//   }

//   loadTest(id: string) {
//     this.loading = true;

//     this.testService.getSingleTest(id).subscribe({
//       next: (res: any) => {
//         this.test = res?.data ?? res;

//         this.loading = false;

//         // 🔥 wait for DOM then generate barcode
//         setTimeout(() => {
//           this.generateBarcode();
//         }, 300);

//         this.cdr.detectChanges();
//       },
//       error: (err) => {
//         console.error(err);
//         this.loading = false;
//       }
//     });
//   }

//   // ✅ GENERATE BARCODE
//   generateBarcode() {
//     const value = this.test?.id?.toString();

//     if (!value || !this.barcodeElement) return;

//     JsBarcode(this.barcodeElement.nativeElement, value, {
//       format: 'CODE128',
//       width: 2,
//       height: 60,
//       displayValue: true
//     });
//   }

//   // ✅ PRINT FUNCTION
//   printBarcode() {
//     const printContent = document.getElementById('print-area')?.innerHTML;

//     const win = window.open('', '', 'width=800,height=600');

//     win?.document.write(`
//       <html>
//         <head>
//           <title>Print Barcode</title>
//         </head>
//         <body style="text-align:center;font-family:Arial;">
//           ${printContent}
//         </body>
//       </html>
//     `);

//     win?.document.close();
//     win?.print();
//   }
// }

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TestService } from '../../services/test.service';
import { Router } from '@angular/router';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-test-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-details.html',
  styleUrls: ['./test-details.css']
})
export class TestDetailsComponent implements OnInit {

  test: any = null;
  loading = true;
  errorMessage = '';

  @ViewChild('barcode', { static: false }) barcodeElement!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🔥 Test Details Loaded');

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.loadTest(id);
      } else {
        this.errorMessage = 'Invalid ID';
        this.loading = false;
      }
    });
  }

  /* =========================
     LOAD TEST DATA
  ========================= */
  loadTest(id: string) {
    this.loading = true;
    this.errorMessage = '';

    this.testService.getTestRequirements(id).subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);

        if (res?.success) {
          this.test = res.data;
        } else {
          this.test = null;
          this.errorMessage = 'No data found';
        }

        this.loading = false;

        this.cdr.detectChanges();

        // wait for DOM update before barcode
        setTimeout(() => {
          this.generateBarcode();
        }, 0);
      },

      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load data';
        this.loading = false;
      }
    });
  }

  /* =========================
     CLICK BARCODE → RELOAD
  ========================= */
  onBarcodeClick(id: number) {
    if (!id) return;
    this.loadTest(String(id));
  }

  /* =========================
     GENERATE BARCODE
  ========================= */
  generateBarcode() {
    if (!this.test?.id || !this.barcodeElement) return;

    JsBarcode(this.barcodeElement.nativeElement, String(this.test.id), {
      format: 'CODE128',
      width: 2,
      height: 60,
      displayValue: true
    });
  }

  /* =========================
     PRINT BARCODE
  ========================= */
  printBarcode() {
    const printContent = document.getElementById('print-area')?.innerHTML;

    const win = window.open('', '', 'width=800,height=600');

    win?.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
        </head>
        <body style="text-align:center;font-family:Arial;">
          ${printContent}
        </body>
      </html>
    `);

    win?.document.close();
    win?.print();
  }


  goToTestScreen(id: number) {
    console.log('CLICKED ID:', id);
    this.router.navigate(['/tests/test-screen', id]);
  }
}