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
        console.log('Login Response:', res);

        this.auth.saveToken(res.token);

        const user = res.user?.user || res.user;
        const role = user?.role?.trim().toLowerCase();

        if (!user || !role) {
          alert('Invalid response from server');
          console.error('User or role missing:', res);
          return;
        }

        localStorage.setItem('userId', user.id.toString());
        localStorage.setItem('role', role);

        console.log('User:', user);
        console.log('Role:', role);

        alert('Login Successful');

        if (role === 'labstaff') {
          this.router.navigate(['/samples']);
        } 
        else if (role === 'customer') {
          this.router.navigate(['/view-samples']);
        } 
        else if (role === 'admin') {
          this.router.navigate(['/home']);
        } 
        else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Login Error:', err);
        alert(err.error?.message || 'Invalid Email or Password');
      }



    });

  }

}