import { Routes } from '@angular/router';

import { AboutComponent } from './pages/about/about';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { RegisterComponent } from './modules/auth/pages/register/register.component';
import { WelcomeComponent } from './modules/auth/pages/welcome/welcome.component';
import { AddSampleComponent } from './modules/samples/pages/add-sample/add-sample';
import { ProfileComponent } from './pages/profile/profile';
import { CustomerGuard } from './guards/customer.guard';





export const routes: Routes = [

  // =========================
  // DEFAULT
  // =========================
  {
    path: '',
    component: WelcomeComponent,
    pathMatch: 'full'
  },

  // =========================
  // AUTH
  // =========================
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'auth/register',
    component: RegisterComponent
  },

  // =========================
  // STATIC PAGES
  // =========================
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'home',
    component: WelcomeComponent
  },
  {
  path: 'ai-chat',
  loadComponent: () =>
    import('./pages/ai-chat/ai-chat')
      .then(m => m.AiChat)
  },

  // =========================
  // SAMPLES MODULE
  // =========================
  {
    path: 'samples',
    loadChildren: () =>
      import('./modules/samples/samples-module')
        .then(m => m.SamplesModule)
  },

  // =========================
  // TESTS MODULE (ONLY ENTRY POINT)
  // =========================
  {
    path: 'tests',
    loadChildren: () =>
      import('./modules/tests/tests-module')
        .then(m => m.TestsModule)
  },

  // ✅ SAMPLE ROUTES
  {
    path: 'samples/add',
    loadComponent: () =>
      import('./modules/samples/pages/add-sample/add-sample')
        .then(m => m.AddSampleComponent)
  },
  { path: 'about', component: AboutComponent },
  { path: 'home', component: WelcomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'about', component: AboutComponent },


    {
      path: 'dashboard',
      loadComponent: () =>
        import('./modules/dashboard/pages/dashboard-home/dashboard-home')
          .then(m => m.DashboardHome)
    },


  {
      path: 'view-samples',
      loadComponent: () =>
        import('./modules/tests/pages/view-samples/view-samples')
          .then(m => m.ViewSamplesComponent),
      canActivate: [CustomerGuard]
  },

  {
    path: 'tracking',
    loadChildren: () =>
      import('./modules/tracking/tracking-module')
        .then(m => m.TrackingModule)
  },

  {
  path: 'customer-tracking',
  loadChildren: () =>
    import('./modules/tracking/tracking-module')
      .then(m => m.TrackingModule)
},

  // =========================
  // FALLBACK
  // =========================
  {
    path: '**',
    redirectTo: ''
  }
];