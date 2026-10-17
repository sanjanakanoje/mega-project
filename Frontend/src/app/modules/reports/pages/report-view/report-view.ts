import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ReportService } from '../../services/report';

@Component({
  selector: 'app-report-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-view.html',
  styleUrls: ['./report-view.css']
})
export class ReportViewComponent implements OnInit {

  sampleId: number = 0;
  reports: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getSampleId();
  }

  private getSampleId(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      console.log('Report View Route ID:', id);

      if (
        id === null ||
        id === '' ||
        !Number.isInteger(Number(id)) ||
        Number(id) <= 0
      ) {
        this.errorMessage = 'Invalid sample ID.';
        this.loading = false;

        this.cdr.detectChanges();
        return;
      }

      this.sampleId = Number(id);

      console.log('Report View Sample ID:', this.sampleId);

      this.loadReports();
    });
  }

  private loadReports(): void {
    this.loading = true;
    this.errorMessage = '';
    this.reports = [];

    this.cdr.detectChanges();

    console.log('Loading reports for sample:', this.sampleId);

    this.reportService
      .getReportsBySample(this.sampleId)
      .pipe(
        finalize(() => {
          this.loading = false;

          console.log(
            'API completed. Loading:',
            this.loading
          );

          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('REPORT API RESPONSE:', response);

          if (response && Array.isArray(response.reports)) {
            this.reports = response.reports;
          } else {
            this.reports = [];
          }

          console.log('Reports:', this.reports);
          console.log('Reports count:', this.reports.length);

          this.cdr.detectChanges();
        },

        error: (error: any) => {
          console.error('REPORT API ERROR:', error);

          this.reports = [];

          this.errorMessage =
            error?.error?.message ||
            error?.message ||
            'Unable to load reports.';

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }

  getTestName(report: any): string {
    return (
      report?.test_name ||
      report?.testName ||
      report?.test ||
      'N/A'
    );
  }

  getTestMethod(report: any): string {
    return (
      report?.test_method ||
      report?.testMethod ||
      'N/A'
    );
  }

  getReportDate(report: any): string {
    const date =
      report?.test_date ||
      report?.testDate ||
      report?.created_at ||
      report?.createdAt;

    if (!date) {
      return 'N/A';
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getResult(report: any): string {
    return report?.result || 'N/A';
  }

  getObservation(report: any): string {
    return report?.observation || 'N/A';
  }

  getRemarks(report: any): string {
    return report?.remarks || 'N/A';
  }

  getNotes(report: any): string {
    return report?.notes || 'N/A';
  }

  printReport(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/customer-tracking', this.sampleId]);
  }
}