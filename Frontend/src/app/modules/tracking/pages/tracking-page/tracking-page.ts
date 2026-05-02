import { Component } from '@angular/core';
import { TrackingService } from '../../services/tracking';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, ZXingScannerModule],
  templateUrl: './tracking-page.html'
})
export class TrackingPage {

  scannedId: string = '';
  testList: any[] = [];

  constructor(private service: TrackingService) {}

  // 📷 CAMERA SCAN EVENT
  onScanSuccess(result: string) {
    this.scannedId = result;

    this.service.getTestsBySample(result)
      .subscribe({
        next: (res: any) => {
          this.testList = res.data.tests_required;
        },
        error: () => {
          this.testList = [];
          alert("No tests found for this sample");
        }
      });
  }
}