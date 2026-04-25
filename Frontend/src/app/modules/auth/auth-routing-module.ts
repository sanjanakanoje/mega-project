// // src/app/modules/auth/auth-routing-module.ts

// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';

// import { LoginComponent } from './pages/login/login';
// import { RegisterComponent } from './pages/register/register';
// import { WelcomeComponent } from './pages/welcome/welcome'; 


// const routes: Routes = [


//     {
//     path: '',
//     redirectTo: 'welcome',
//     pathMatch: 'full'
//   },

//   {
//     path: 'welcome',
//     component: WelcomeComponent
//   },


//   {
//     path: '',
//     redirectTo: 'login',
//     pathMatch: 'full'
//   },

//   {
//     path: 'login',
//     component: LoginComponent
//   },

//   {
//     path: 'register',
//     component: RegisterComponent
//   }



// ];

// @NgModule({
//   imports: [
//     RouterModule.forChild(routes)
//   ],
//   exports: [
//     RouterModule
//   ]
// })
// export class AuthRoutingModule {}



// src/app/modules/auth/auth-routing-module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { WelcomeComponent } from './pages/welcome/welcome.component'; 

// const routes: Routes = [

//   {
//     path: '',
//     component: WelcomeComponent
//   },

//   {
//     path: 'login',
//     component: LoginComponent
//   },

//   {
//     path: 'register',
//     component: RegisterComponent
//   }

// ];



const routes: Routes = [

  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },

  {
    path: 'welcome',
    component: WelcomeComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  }

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}