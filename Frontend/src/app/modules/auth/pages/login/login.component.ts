import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
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

    this.auth.login(this.formData).subscribe({

      next: (res: any) => {

        this.auth.saveToken(res.token);

        alert('Login Successful');

        this.router.navigate(['/dashboard']);
      },

      error: () => {

        alert('Invalid Email or Password');
      }

    });

  }

}