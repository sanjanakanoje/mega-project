import { Routes } from '@angular/router';

import { WelcomeComponent } from './modules/auth/pages/welcome/welcome.component';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { RegisterComponent } from './modules/auth/pages/register/register.component';
// import { AddSampleComponent } from './modules/samples/pages/add-sample/add-sample';

export const routes: Routes = [

  {
    path: '',
    component: WelcomeComponent,
    pathMatch: 'full'
  },

  {
    path: 'auth/login',
    component: LoginComponent
  },

  {
    path: 'auth/register',
    component: RegisterComponent
  },
  {
    path: 'samples',
    loadChildren: () =>
      import('./modules/samples/samples-module')
      .then(m => m.SamplesModule)
  },

  // ✅ TEST ROUTES
  {
    path: 'tests/create-request',
    loadComponent: () =>
      import('./modules/tests/pages/create-test-request/create-test-request')
        .then(m => m.CreateTestRequestComponent)
  },

  // ✅ SAMPLE ROUTES
  {
    path: 'samples/add',
    loadComponent: () =>
      import('./modules/samples/pages/add-sample/add-sample')
        .then(m => m.AddSampleComponent)
  },

  {
    path: '**',
    redirectTo: ''
  }

];