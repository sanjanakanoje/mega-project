// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';

import { AddSampleComponent } from './pages/add-sample/add-sample';
// import { SampleListComponent } from './pages/sample-list/sample-list';
// import { SampleDetailsComponent } from './pages/sample-details/sample-details';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },

  // {
  //   path: 'list',
  //   component: SampleListComponent
  // },

  {
    path: 'add',
    component: AddSampleComponent
  },

  { path: '', component: SampleListComponent },
  { path: 'details/:id', component: SampleDetailsComponent }
  // {
  //   path: 'details/:id',
  //   component: SampleDetailsComponent
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SamplesRoutingModule { }
