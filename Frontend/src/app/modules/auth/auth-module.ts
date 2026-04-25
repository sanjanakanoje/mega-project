// // src/app/modules/auth/auth-module.ts

// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';

// import { AuthRoutingModule } from './auth-routing-module';

// import { LoginComponent } from './pages/login/login';
// import { RegisterComponent } from './pages/register/register';
// import { WelcomeComponent } from './pages/welcome/welcome';


// @NgModule({
//   declarations: [

//   ],

//   imports: [

//     CommonModule,
//     FormsModule,

//     WelcomeComponent,
//     RouterModule,

//     LoginComponent,
//     RegisterComponent,

//     AuthRoutingModule

//   ]
// })
// export class AuthModule {}


// src/app/modules/auth/auth.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing-module';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

@NgModule({
  declarations: [
    // LoginComponent,
    // RegisterComponent,
    // WelcomeComponent   // ✅ HERE
  ],

  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    LoginComponent, 
    RegisterComponent,
    WelcomeComponent
  ]
})
export class AuthModule {}