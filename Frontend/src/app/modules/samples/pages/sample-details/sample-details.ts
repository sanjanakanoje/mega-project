import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SampleService } from '../../services/sample';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-sample-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sample-details.html',
  styleUrls: ['./sample-details.css']
})
export class SampleDetailsComponent implements OnInit {
  sample: any = null;
  role: string | null = '';

  // Reference to the SVG element in the HTML
  @ViewChild('barcodeElement') barcodeElement!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private sampleService: SampleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) this.loadSample(id);
    });
  }

  loadSample(id: number) {
    this.sampleService.getSampleById(id).subscribe({
      next: (res) => {
        const data = res.data || res.result || res;
        if (data) {
          this.sample = {
            ...data,
            customerName: data.customerName || `Customer-${data.sampleid}`,
            address: data.address || `Textile Area, City-${data.sampleid}`
          };
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error("API Error:", err)
    });
  }

  // This function now handles the generation only when clicked
  generateBarcode() {
    if (!this.sample || !this.sample.barcode) {
      alert("No barcode data found for this sample.");
      return;
    }

    if (this.barcodeElement) {
      JsBarcode(this.barcodeElement.nativeElement, this.sample.barcode, {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: true
      });
    } else {
      console.error("Barcode SVG element not found in DOM");
    }
  }

  printBarcode() {
    window.print();
  }
}
