import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">

      <div class="card">

        <!-- Profile Image -->
        <img [src]="imageUrl" class="profile-img">

        <h2>{{ name }}</h2>
        <p>{{ email }}</p>

      </div>

    </div>
  `,
  styles: [`
    .profile-container {
      min-height:100vh;
      background:black;
      display:flex;
      justify-content:center;
      align-items:center;
      color:white;
    }

    .card {
      background:#111;
      padding:30px;
      border-radius:15px;
      width:350px;
      text-align:center;
      box-shadow:0 10px 25px rgba(0,0,0,0.5);
    }

    .profile-img {
      width:120px;
      height:120px;
      border-radius:50%;
      object-fit:cover;
      margin-bottom:15px;
      border:3px solid #ff7a1a;
    }

    h2 {
      margin-bottom:5px;
    }

    p {
      color:#ccc;
    }
  `]
})
export class ProfileComponent {

  name = '';
  email = '';
  imageUrl = '';

  constructor(){
    this.name = localStorage.getItem('userName') || 'User Name';
    this.email = localStorage.getItem('userEmail') || 'user@email.com';
    this.imageUrl = localStorage.getItem('userImage') || 'https://via.placeholder.com/120';
  }

}