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

      // next: (res: any) => {

      //   this.auth.saveToken(res.token);

      //   alert('Login Successful');

      //   this.router.navigate(['/dashboard']);
      // },
      next: (res: any) => {

        // save token
        this.auth.saveToken(res.token);

        // ✅ SAVE ROLE (IMPORTANT)
        localStorage.setItem('role', res.user.role);

        alert('Login Successful');

        // ✅ ROLE BASED REDIRECT
        if (res.user.role === 'LabStaff') {
          this.router.navigate(['/samples']);   // 👨‍🔬 lab staff
        } else {
          this.router.navigate(['/']);          // 👤 customer
        }

      },
      error: () => {

        alert('Invalid Email or Password');
      }

    });

  }

}