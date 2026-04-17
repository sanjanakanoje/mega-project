import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
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