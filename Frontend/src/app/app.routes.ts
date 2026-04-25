import { Routes } from '@angular/router';

import { LoginComponent } from './modules/auth/pages/login/login.component';
import { RegisterComponent } from './modules/auth/pages/register/register.component';
import { WelcomeComponent } from './modules/auth/pages/welcome/welcome.component';


export const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth-module').then(m => m.AuthModule)
  },


  // {5
  //   path: '',
  //   redirectTo: 'welcome',
  //   pathMatch: 'full'
  // },

  // {
  //     path: '',
  //     component: WelcomeComponent
  // },

  // {
  //   path: 'login',
  //   component: LoginComponent
  // },

  // {
  //   path: 'register',
  //   component: RegisterComponent
  // }

];