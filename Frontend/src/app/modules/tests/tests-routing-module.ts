// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';

// // Components
// import { CreateTestRequestComponent } from './pages/create-test-request/create-test-request';
// import { TestListComponent } from './pages/test-list/test-list.component'; // ✅ ADD THIS

// const routes: Routes = [

//   // ✅ Default route → /tests
//   {
//     path: '',
//     component: TestListComponent
//   },

//   // ✅ Create request → /tests/create-request
//   {
//     path: 'create-request',
//     component: CreateTestRequestComponent
//   },
//   {
//   path: ':id',
//   loadComponent: () =>
//     import('./pages/test-details/test-details')
//       .then(m => m.TestDetailsComponent)
//   },
//   {
//   path: ':id',
//   loadComponent: () =>
//     import('./pages/test-details/test-details')
//       .then(m => m.TestDetailsComponent)
//   }

//   // ✅ Optional → /tests/123
//   // {
//   //   path: ':id',
//   //   component: TestDetailsComponent
//   // }

// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class TestsRoutingModule {}

// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { TestListComponent } from './pages/test-list/test-list.component';
// import { CreateTestRequestComponent } from './pages/create-test-request/create-test-request';
// import { TestScreenComponent } from './pages/test-screen/test-screen';

// const routes: Routes = [

//   // ✅ LIST PAGE
//   {
//     path: '',
//     component: TestListComponent
//   },

//   // ✅ CREATE PAGE
//   {
//     path: 'create-request',
//     component: CreateTestRequestComponent
//   },

//   // ✅ DETAILS PAGE (FIXED PATH)
//   {
//     path: ':id',
//     loadComponent: () =>
//       import('./pages/test-details/test-details')
//         .then(m => m.TestDetailsComponent)
//   },

//   {
//     path: 'tests/test-screen/:id',
//     component: TestScreenComponent
//   }
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class TestsRoutingModule {}


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestListComponent } from './pages/test-list/test-list.component';
import { CreateTestRequestComponent } from './pages/create-test-request/create-test-request';
import { TestScreenComponent } from './pages/test-screen/test-screen';
import { TestDetailsComponent } from './pages/test-details/test-details';

const routes: Routes = [

  // =========================
  // LIST PAGE
  // =========================
  {
    path: '',
    component: TestListComponent
  },

  // =========================
  // CREATE REQUEST
  // =========================
  {
    path: 'create-request',
    component: CreateTestRequestComponent
  },

  // =========================
  // TEST DETAILS PAGE
  // =========================
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/test-details/test-details')
        .then(m => m.TestDetailsComponent)
  },

  // =========================
  // TEST SCREEN PAGE (MAIN FIX)
  // =========================
  {
    path: 'test-screen/:id',
    component: TestScreenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestsRoutingModule {}