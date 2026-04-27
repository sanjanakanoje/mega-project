import { Routes } from '@angular/router';

import { LoginComponent } from './modules/auth/pages/login/login';
import { RegisterComponent } from './modules/auth/pages/register/register';

import { AddSampleComponent } from './modules/samples/pages/add-sample/add-sample';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

    {
    path: '',
    redirectTo: 'samples/add',
    pathMatch: 'full'
  },

  {
    path: 'samples/add',
    component: AddSampleComponent
  },

  {
    path: '**',
    redirectTo: 'samples/add'
  }

];