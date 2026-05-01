import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { RegisterComponent } from './modules/auth/pages/register/register.component';
import { WelcomeComponent } from './modules/auth/pages/welcome/welcome.component';
import { AddSampleComponent } from './modules/samples/pages/add-sample/add-sample';
import { ProfileComponent } from './pages/profile/profile';






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
  { path: 'add-sample', component: AddSampleComponent },
  { path: 'about', component: AboutComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'home', component: WelcomeComponent },
  { path: 'about', component: AboutComponent },

  //{ path: 'home', component: HomeComponent },
  
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