// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';

// const routes: Routes = [];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class SamplesRoutingModule {}

import { AddSampleComponent } from './pages/add-sample/add-sample';

const routes: Routes = [
  { path: 'add', component: AddSampleComponent }
];