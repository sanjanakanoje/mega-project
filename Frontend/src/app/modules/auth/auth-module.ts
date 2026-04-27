// src/app/modules/auth/auth-module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing-module';

import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [

  ],

  imports: [

    CommonModule,
    FormsModule,

    LoginComponent,
    RegisterComponent,

    AuthRoutingModule,
    ReactiveFormsModule

  ]
})
export class AuthModule {}