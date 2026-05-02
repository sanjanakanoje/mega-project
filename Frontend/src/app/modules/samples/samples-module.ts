

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SampleListComponent } from './pages/sample-list/sample-list';
import { SampleDetailsComponent } from './pages/sample-details/sample-details';


const routes = [
  { path: '', component: SampleListComponent },
  { path: 'details/:id', component: SampleDetailsComponent }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    // ✅ IMPORT instead of DECLARE
    SampleListComponent,
    SampleDetailsComponent
  ],
})


export class SamplesModule {}
