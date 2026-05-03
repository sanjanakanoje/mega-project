
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-view-samples',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-samples.html',
  styleUrls: ['./view-samples.css']
})
export class ViewSamplesComponent implements OnInit {

  tests: any[] = [];

  constructor(
    private testService: TestService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTests();
  }

  loadTests(): void {
    const userId = Number(localStorage.getItem('userId'));

    console.log('Logged In User ID:', userId);

    if (!userId) {
      console.error('User ID not found');
      return;
    }

    this.testService.getAllTests(userId).subscribe({
      next: (response: any) => {
        console.log('Full API Response:', response);

        this.tests = Array.isArray(response)
          ? response
          : (response.data || []);

        console.log('Final Tests:', this.tests);
        console.log('Tests Length:', this.tests.length);

        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error fetching tests:', error);
      }
    });
  }



  trackSample(id: number): void {
      alert('Tracking Sample ID: ' + id);
    }

    parseArray(value: any): string {
      if (!value) return 'N/A';

      if (Array.isArray(value)) {
        return value.join(', ');
      }

      try {
        return JSON.parse(value).join(', ');
      } catch {
        return value.toString();
      }
    }
    
}