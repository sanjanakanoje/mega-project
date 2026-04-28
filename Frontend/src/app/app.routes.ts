import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

import { LoginComponent } from './modules/auth/pages/login/login.component';
import { RegisterComponent } from './modules/auth/pages/register/register.component';
import { WelcomeComponent } from './modules/auth/pages/welcome/welcome.component';
import { AddSampleComponent } from './modules/samples/pages/add-sample/add-sample';
import { SampleListComponent } from './modules/samples/pages/sample-list/sample-list';
import { SampleDetailsComponent } from './modules/samples/pages/sample-details/sample-details';

export const routes: Routes = [

  { path: '', component: WelcomeComponent, pathMatch: 'full' },

  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  // ✅ DIRECT COMPONENT ROUTING (NO MODULE)
  {
    path: 'samples',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/samples/pages/sample-list/sample-list')
            .then(m => m.SampleListComponent)
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('./modules/samples/pages/sample-details/sample-details')
            .then(m => m.SampleDetailsComponent)
      },
      {
        path: 'add',
        loadComponent: () =>
          import('./modules/samples/pages/add-sample/add-sample')
            .then(m => m.AddSampleComponent)
      }
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];



