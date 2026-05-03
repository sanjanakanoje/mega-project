import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SampleService } from '../../services/sample';
import JsBarcode from 'jsbarcode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sample-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sample-details.html',
  styleUrls: ['./sample-details.css']
})
export class SampleDetailsComponent implements OnInit {
  sample: any = null;
  test: any = null;
  testsRequired: any[] = [];
  finishTypes: any[] = [];
  selectedFinish: string = '';
  loading: boolean = true;
  errorMessage: string = '';
  isBarcodeView: boolean = false;

  @ViewChild('barcode') barcodeElement!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private sampleService: SampleService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadSample(id);
      } else {
        this.errorMessage = "Invalid Sample ID";
        this.loading = false;
      }
    });
  }

  loadSample(id: number) {
    this.loading = true;
    this.sampleService.getFullSample(id).subscribe({
      next: (res) => {
        // Handle varied API response structures (res, res.data, or res.result)
        const root = res?.data || res?.result || res;
        
        this.sample = root.sample || null;
        this.test = root.test || null;

        if (this.test) {
          // Mapping JSONB fields from your test_requests table
          this.testsRequired = Array.isArray(this.test.tests_required) ? this.test.tests_required : [];
          this.finishTypes = Array.isArray(this.test.finish_type) ? this.test.finish_type : [];
        }

        this.loading = false;
        this.cdr.detectChanges(); // Force update so *ngIf renders the SVG container
      },
      error: (err) => {
        console.error("API Error:", err);
        this.errorMessage = "Could not fetch sample details. Check console.";
        this.loading = false;
      }
    });
  }

  generateBarcode() {
    // Uses barcode from DB, or falls back to sampleid for scanning
    const barcodeValue = this.sample?.barcode || this.sample?.sampleid?.toString();

    if (!barcodeValue) {
      alert("No barcode data found.");
      return;
    }

    // Standard check to ensure the SVG is in the DOM
    if (this.barcodeElement) {
      try {
        JsBarcode(this.barcodeElement.nativeElement, barcodeValue, {
          format: "CODE128",
          width: 2,
          height: 70,
          displayValue: true
        });
      } catch (err) {
        console.error("JsBarcode failed:", err);
      }
    } else {
      alert("Barcode element not ready. Try clicking again.");
    }
  }

  printBarcode() {
    const printContent = document.getElementById('print-section')?.innerHTML;
    if (!printContent) return;

    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow?.document.write(`
      <html>
        <head><title>Print Barcode</title></head>
        <body style="text-align:center; padding: 20px; font-family: sans-serif;">
          <h2>Test Request: ${this.sample?.sampleid}</h2>
          ${printContent}
          <p>Company: ${this.test?.company_name || 'N/A'}</p>
        </body>
      </html>
    `);
    newWindow?.document.close();
    setTimeout(() => {
      newWindow?.print();
      newWindow?.close();
    }, 500);
  }

  onBarcodeClick() {
  if (!this.sample?.sampleid) return;

  this.router.navigate(['/test-screen', this.sample.sampleid]);
  }

  markTestDone(test: string) {
    console.log("Processing test:", test);
  }
}




















