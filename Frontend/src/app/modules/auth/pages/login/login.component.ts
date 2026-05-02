

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  formData = {
    email: '',
    password: ''
  };

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  loginUser() {

    if (!this.formData.email || !this.formData.password) {
      alert('Please enter email and password');
      return;
    }

    this.auth.login(this.formData).subscribe({

      next: (res: any) => {

        // Save token
        this.auth.saveToken(res.token);

        // Save role
        localStorage.setItem('role', res.user.role);

        alert('Login Successful');

        // Role based redirect
        if (res.user.role === 'LabStaff') {
          this.router.navigate(['/samples']);
        } else {
          this.router.navigate(['/']);
        }

      },

      error: (err: any) => {
        console.log(err);
        alert('Invalid Email or Password');
      }

    });

  }

}