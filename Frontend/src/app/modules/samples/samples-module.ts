import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SamplesRoutingModule } from './samples-routing-module';
import { AddSampleComponent } from './pages/add-sample/add-sample';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SamplesRoutingModule,
    AddSampleComponent
  ]
})
export class SamplesModule { }