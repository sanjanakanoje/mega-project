import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TestService } from '../../../tests/services/test.service';

@Component({
  selector: 'app-tracking-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracking-page.html',
  styleUrls: ['./tracking-page.css']
})
export class TrackingComponent implements OnInit {

  sample: any = null;

  requiredTests: string[] = [];
  completedTests: string[] = [];
  pendingTests: string[] = [];

  progressPercentage = 0;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    console.log('Tracking ID:', id);

    if (!id) {
      this.loading = false;
      return;
    }

    this.loadTracking(id);
  }

  loadTracking(id: number): void {

    this.loading = true;

    this.testService.getTrackingDetails(id)
      .subscribe({

        next: (res: any) => {

          console.log('API Response:', res);

          if (!res || !res.success) {
            this.loading = false;
            return;
          }

          this.sample = res.data;

          this.requiredTests =
            res.data.testsRequired || [];

          this.completedTests =
            res.data.completedTests || [];

          this.pendingTests =
            res.data.pendingTests || [];

          this.progressPercentage =
            this.requiredTests.length > 0
              ? Math.round(
                  (this.completedTests.length /
                    this.requiredTests.length) * 100
                )
              : 0;

          this.loading = false;

          console.log('Sample:', this.sample);
          console.log('Required:', this.requiredTests);
          console.log('Completed:', this.completedTests);
          console.log('Pending:', this.pendingTests);

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(err);

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }
}