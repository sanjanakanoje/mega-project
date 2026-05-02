import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [    CommonModule,FormsModule,RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  formData = {
    name: '',
    email: '',
    password: '',
    role: 'Customer'
  };

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  registerUser() {

    this.auth.register(this.formData).subscribe({

      next: () => {

        alert('Registration Successful');

        this.router.navigate(['/login']);
      },

      error: () => {

        alert('Registration Failed');
      }

    });

  }


}