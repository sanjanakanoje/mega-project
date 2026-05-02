import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SampleService } from '../../services/sample';


@Component({
  selector: 'app-test-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-screen.html',
  styleUrls: ['./test-screen.css']
})
export class TestScreenComponent implements OnInit {

  sample: any = null;
  test: any = {};

  testsRequired: any[] = [];
  finishTypes: any[] = [];
  selectedFinish: string = '';

  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private sampleService: SampleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    console.log("Received ID:", id);

    if (!id) {
      this.loading = false;
      return;
    }

    this.sampleService.getFullSample(id).subscribe({
      next: (res) => {

        console.log("API RESPONSE:", res);

        // 🔥 Handles ALL response formats
        const root = res?.data || res?.result || res;

        this.sample = root?.sample || root;
        this.test = root?.test || {};

        this.testsRequired = this.test?.tests_required || [];
        this.finishTypes = this.test?.finish_type || [];

        this.loading = false;

        this.cdr.detectChanges(); // 🔥 force UI update
      },

      error: (err) => {
        console.error("API ERROR:", err);
        this.loading = false;
      }
    });
  }

  markTestDone(test: string) {
    console.log("Test completed:", test);

    // 👉 future: call API to update DB
  }
}