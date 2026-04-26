// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { SampleService, Sample } from '../../services/sample';
// import { BarcodeService } from '../../../../core/services/barcode';
// import { ViewChild, ElementRef } from '@angular/core';
// import JsBarcode from 'jsbarcode';

// @Component({
//   selector: 'app-add-sample',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './add-sample.html',
//   styleUrls: ['./add-sample.css']
// })
// export class AddSampleComponent {

//   @ViewChild('barcodeSvg') barcodeSvg!: ElementRef;
//   sample: Sample = {
//     sampleName: '',
//     customerName: '',
//     barcode: ''
//   };

//   generatedBarcode: string = '';
//   message: string = '';

//   constructor(
//     private sampleService: SampleService,
//     private barcodeService: BarcodeService
//   ) {}

//   generateBarcode() {

//   if (
//     !this.sample.sampleName?.trim() ||
//     !this.sample.customerName?.trim()
//   ) {
//     this.message = 'Please fill all fields before generating barcode';
//     return;
//   }

//   const code = this.barcodeService.generateBarcode();

//   this.generatedBarcode = code;
//   this.sample.barcode = code;

//  setTimeout(() => {
//   JsBarcode('#barcode', code, {
//     format: 'CODE128',
//     width: 2,
//     height: 60,
//     displayValue: true
//   });
//   }, 200); 
//   }

//   submitSample() {

//   console.log("Submitting:", this.sample);

//   if (
//     !this.sample.sampleName ||
//     !this.sample.customerName
//   ) {
//     this.message = 'Please fill all fields';
//     return;
//   }

//   if (!this.sample.barcode) {
//     this.message = 'Please generate barcode first';
//     return;
//   }

//   this.sampleService.addSample(this.sample).subscribe({
//     next: () => {
//       this.message = 'Saved Successfully!';
//       this.resetForm();
//     },
//     error: () => {
//       this.message = 'Error saving sample';
//     }
//   });
//   }

//   resetForm() {
//   this.sample = {
//     sampleName: '',
//     customerName: '',
//     barcode: ''
//   };

//   this.generatedBarcode = '';

//   const svg = document.getElementById('barcode');
//   if (svg) svg.innerHTML = '';
//   }
// }


import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SampleService, Sample } from '../../services/sample';
import { BarcodeService } from '../../../../core/services/barcode';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-add-sample',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-sample.html',
  styleUrls: ['./add-sample.css']
})
export class AddSampleComponent {

  sample: Sample = {
    sampleName: '',
    customerName: '',
    barcode: ''
  };

  generatedBarcode = '';
  message = '';

  constructor(
    private sampleService: SampleService,
    private barcodeService: BarcodeService
  ) {}

  // ✅ Generate Barcode
  generateBarcode() {

    if (!this.sample.sampleName || !this.sample.customerName) {
      this.message = 'Fill all fields first';
      return;
    }

    const code = this.barcodeService.generateBarcode();

    this.generatedBarcode = code;
    this.sample.barcode = code;

    // render barcode
    setTimeout(() => {
      const svg = document.getElementById('barcode');
      if (svg) {
        JsBarcode(svg, code, {
          format: 'CODE128',
          width: 2,
          height: 60,
          displayValue: true
        });
      }
    }, 100);
  }

  // ✅ Submit (MAIN FIX HERE)
  submitSample(form: NgForm) {

    console.log('Submitting:', this.sample);

    if (form.invalid) {
      this.message = 'Please fill all fields';
      return;
    }

    if (!this.sample.barcode) {
      this.message = 'Generate barcode first';
      return;
    }

    this.sampleService.addSample(this.sample).subscribe({
      next: () => {
        this.message = 'Sample Saved Successfully!';
        form.resetForm();   // ✅ correct reset
        this.generatedBarcode = '';

        const svg = document.getElementById('barcode');
        if (svg) svg.innerHTML = '';
      },
      error: () => {
        this.message = 'Error saving sample';
      }
    });
  }
}