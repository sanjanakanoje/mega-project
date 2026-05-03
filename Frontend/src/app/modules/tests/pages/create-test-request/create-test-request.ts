import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { TestService } from '../../services/test';

@Component({
  selector: 'app-create-test-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-test-request.html',
  styleUrls: ['./create-test-request.css']
})
export class CreateTestRequestComponent implements OnInit {

  form!: FormGroup;

  finishTypes = [
    'Regular Finish',
    'Peach Finish',
    'Garment Wash',
    'Over Dyed',
    'Other'
  ];

  divisions = [
    'Kids Wear',
    'Mens Wear',
    'Womens Wear',
    'Womens Indian Wear',
    'Inner Wear'
  ];

  packageTypes = [
    'Woven Fabric Package',
    'Knit Fabric Package',
    'Woven Garment Package',
    'Knit Garment Package',
    'Denim Garment Package'
  ];

  tests = [
    'After Home Laundering',
    'Dimensional Stability',
    'Color Fastness Wash',
    'Color Fastness Rubbing',
    'Color Fastness Perspiration',
    'Color Fastness Water',
    'Seam Slippage',
    'Bursting Strength',
    'Pilling Resistance',
    'Fabric Weight',
    'Yarn Count',
    'Fabric Construction',
    'Tensile Strength',
    'Tear Strength',
    'pH Value',
    'Fiber Content'
  ];

  constructor(
    private fb: FormBuilder,
    private testService: TestService
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      companyName: ['', Validators.required],
      submittedBy: [''],
      merchantName: [''],
      brandLabelName: [''],
      vendorCode: [''],
      email: [''],
      phoneNo: [''],

      sampleDescription: [''],
      styleNo: [''],
      season: [''],
      fiberContent: [''],
      fabricWeight: [''],
      countNo: [''],
      color: [''],
      construction: [''],
      endUse: [''],

      washInstruction: [''],
      washCode: [''],
      priority: ['Regular'],

      finishTypes: this.buildArray(this.finishTypes),
      divisions: this.buildArray(this.divisions),
      packageTypes: this.buildArray(this.packageTypes),
      testsRequired: this.buildArray(this.tests)
    });

  }

  buildArray(data: string[]): FormArray {
    return this.fb.array(data.map(() => false));
  }

  getSelected(names: string[], values: boolean[]) {
    return names.filter((_, i) => values[i]);
  }

  submitForm() {

  alert('Submit Clicked');

  if (this.form.invalid) {
    alert('Form Invalid');
    return;
  }


  const value = this.form.value;

  const payload = {
    ...value,
    customerId: Number(localStorage.getItem('userId')),
    finishTypes: this.getSelected(this.finishTypes, value.finishTypes),
    divisions: this.getSelected(this.divisions, value.divisions),
    packageTypes: this.getSelected(this.packageTypes, value.packageTypes),
    testsRequired: this.getSelected(this.tests, value.testsRequired)
  };

  console.log('Submitting Payload:',payload);

  this.testService.createRequest(payload).subscribe({

    next: (res: any) => {
      console.log('SUCCESS', res);
      alert('Saved Successfully');
    },

    error: (err: any) => {
      console.log('ERROR', err);
      alert('API Error');
    }

  });

}

}




