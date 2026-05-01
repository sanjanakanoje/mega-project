import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { TestListComponent } from './pages/test-list/test-list';
import { CreateTestRequestComponent } from './pages/create-test-request/create-test-request';
// import { AssignTestComponent } from './pages/assign-test/assign-test';
// import { TestDetailsComponent } from './pages/test-details/test-details';
// import { UpdateTestStatusComponent } from './pages/update-test-status/update-test-status';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'test-list',
    pathMatch: 'full'
  },

  // {
  //   path: 'test-list',
  //   component: TestListComponent
  // },

  {
    path: 'create-request',
    component: CreateTestRequestComponent
  },

  // {
  //   path: 'assign-test/:id',
  //   component: AssignTestComponent
  // },

  // {
  //   path: 'details/:id',
  //   component: TestDetailsComponent
  // },

  // {
  //   path: 'update-status/:id',
  //   component: UpdateTestStatusComponent
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestsRoutingModule {}