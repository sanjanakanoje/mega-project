// src/app/modules/samples/pages/add-sample/add-sample.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SampleService } from '../../services/sample';

@Component({
  selector: 'app-add-sample',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './add-sample.html',
  styleUrls: ['./add-sample.css']
})
export class AddSampleComponent {

  sampleForm!: FormGroup;

  barcode: string = '';

  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private sampleService: SampleService
  ) {}

  ngOnInit(): void {
    this.generateBarcode();
    this.createForm();
  }

  createForm() {
    this.sampleForm = this.fb.group({
      userid: [1, Validators.required],
      samplename: ['', Validators.required],
      sampletype: ['', Validators.required],
      quantity: ['', Validators.required],
      priority: ['Normal', Validators.required],
      predictedcompletiontime: ['', Validators.required]
    });
  }

  generateBarcode() {
    const random = Math.floor(Math.random() * 9000) + 1000;
    this.barcode = 'SMP-' + random;
  }

  submitSample() {

    if (this.sampleForm.invalid) {
      this.sampleForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const data = {
      ...this.sampleForm.value,
      barcode: this.barcode
    };

    this.sampleService.addSample(data).subscribe({
      next: (res: any) => {
        alert('Sample Added Successfully');

        this.loading = false;
        this.sampleForm.reset({
          userid: 1,
          priority: 'Normal'
        });

        this.generateBarcode();
      },

      error: (err) => {
        console.log(err);
        this.loading = false;
        alert('Failed to Add Sample');
      }
    });
  }
}