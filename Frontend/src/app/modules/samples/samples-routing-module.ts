import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [

  // default → list page
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },

  // ✅ Sample List (Test Requests List)
  {
    path: 'list',
    loadComponent: () =>
      import('./pages/sample-list/sample-list')
        .then(m => m.SampleListComponent)
  },

  // ✅ Add Sample
  {
    path: 'add',
    loadComponent: () =>
      import('./pages/add-sample/add-sample')
        .then(m => m.AddSampleComponent)
  },

  // ✅ Details Page
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./pages/sample-details/sample-details')
        .then(m => m.SampleDetailsComponent)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SamplesRoutingModule {}