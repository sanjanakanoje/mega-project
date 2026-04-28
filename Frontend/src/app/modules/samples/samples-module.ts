// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';

// import { SamplesRoutingModule } from './samples-routing-module';
// import { AddSampleComponent } from './pages/add-sample/add-sample';

// @NgModule({
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     SamplesRoutingModule,
//     AddSampleComponent
//   ]
// })
// export class SamplesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SampleListComponent } from './pages/sample-list/sample-list';
import { SampleDetailsComponent } from './pages/sample-details/sample-details';


const routes = [
  { path: '', component: SampleListComponent },
  { path: 'details/:id', component: SampleDetailsComponent }
];

// @NgModule({
//   declarations: [
//     SampleListComponent,
//     SampleDetailsComponent
//   ],
//   imports: [
//     CommonModule,
//     RouterModule.forChild(routes)
//   ]
// })
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
