

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing-module';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    // LoginComponent,
    // RegisterComponent,
    // WelcomeComponent   
  ],

  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    LoginComponent, 
    RegisterComponent,

    AuthRoutingModule,
    ReactiveFormsModule

  ]
})
export class AuthModule {}