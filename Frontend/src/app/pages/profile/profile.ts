import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">

      <div class="card">

        <!-- Profile Title -->
        <h1>My Profile</h1>

        <!-- Profile Image -->
        <div class="image-section">

          <img
            [src]="imageUrl"
            class="profile-img"
            alt="Profile Photo"
          >

          <!-- Change Photo -->
          <label class="photo-btn">
            📷 Change Photo
            <input
              type="file"
              accept="image/*"
              (change)="changePhoto($event)"
              hidden
            >
          </label>

        </div>

        <!-- User Information -->
        <div class="profile-info">

          <!-- Name -->
          <div class="info-item">
            <label>👤 Name</label>

            <input
              *ngIf="editing"
              type="text"
              [(ngModel)]="name"
            >

            <p *ngIf="!editing">
              {{ name }}
            </p>
          </div>

          <!-- Email -->
          <div class="info-item">
            <label>📧 Email</label>

            <input
              *ngIf="editing"
              type="email"
              [(ngModel)]="email"
            >

            <p *ngIf="!editing">
              {{ email }}
            </p>
          </div>

          <!-- Role -->
          <div class="info-item">
            <label>🏷️ Role</label>

            <p>
              {{ role }}
            </p>
          </div>

        </div>

        <!-- Buttons -->
        <div class="buttons">

          <button
            *ngIf="!editing"
            class="edit-btn"
            (click)="editProfile()"
          >
            ✏️ Edit Profile
          </button>

          <button
            *ngIf="editing"
            class="save-btn"
            (click)="saveProfile()"
          >
            💾 Save Profile
          </button>

          <button
            *ngIf="editing"
            class="cancel-btn"
            (click)="cancelEdit()"
          >
            ❌ Cancel
          </button>

        </div>

      </div>

    </div>
  `,

  styles: [`
    .profile-container {
      min-height: 100vh;
      background: black;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      padding: 30px 20px;
      box-sizing: border-box;
    }

    .card {
      background: #111;
      padding: 35px;
      border-radius: 18px;
      width: 380px;
      max-width: 100%;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      border: 1px solid #222;
    }

    h1 {
      color: #ff7a1a;
      margin-bottom: 25px;
      font-size: 28px;
    }

    .image-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 25px;
    }

    .profile-img {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 15px;
      border: 3px solid #ff7a1a;
      background: #222;
    }

    .photo-btn {
      background: #222;
      color: #ff7a1a;
      padding: 9px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      border: 1px solid #ff7a1a;
      transition: 0.3s;
    }

    .photo-btn:hover {
      background: #ff7a1a;
      color: black;
    }

    .profile-info {
      text-align: left;
      margin-top: 20px;
    }

    .info-item {
      margin-bottom: 20px;
    }

    .info-item label {
      display: block;
      color: #ff7a1a;
      font-weight: bold;
      margin-bottom: 7px;
      font-size: 15px;
    }

    .info-item p {
      margin: 0;
      padding: 10px 12px;
      background: #1a1a1a;
      border-radius: 8px;
      color: #fff;
      border: 1px solid #333;
    }

    .info-item input {
      width: 100%;
      padding: 10px 12px;
      box-sizing: border-box;
      background: #1a1a1a;
      color: white;
      border: 1px solid #ff7a1a;
      border-radius: 8px;
      outline: none;
    }

    .buttons {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 25px;
      flex-wrap: wrap;
    }

    button {
      border: none;
      padding: 11px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: 0.3s;
    }

    .edit-btn {
      background: #ff7a1a;
      color: black;
    }

    .edit-btn:hover {
      background: #ff982f;
    }

    .save-btn {
      background: #4caf50;
      color: white;
    }

    .save-btn:hover {
      background: #45a049;
    }

    .cancel-btn {
      background: #444;
      color: white;
    }

    .cancel-btn:hover {
      background: #555;
    }

    @media (max-width: 500px) {
      .card {
        padding: 25px 20px;
      }

      .profile-img {
        width: 110px;
        height: 110px;
      }
    }
  `]
})
export class ProfileComponent {

  name = '';
  email = '';
  role = '';

  imageUrl = '';

  editing = false;

  oldName = '';
  oldEmail = '';

  constructor() {

    // Get logged-in user
    const userData = localStorage.getItem('user');

    if (userData) {

      try {

        const user = JSON.parse(userData);

        this.name =
          user.name ||
          localStorage.getItem('userName') ||
          'User Name';

        this.email =
          user.email ||
          localStorage.getItem('userEmail') ||
          'user@email.com';

        this.role =
          user.role ||
          localStorage.getItem('role') ||
          'Customer';

      } catch (error) {

        console.error('Error reading user data:', error);

        this.loadUserFromLocalStorage();
      }

    } else {

      this.loadUserFromLocalStorage();
    }

    // Profile image
    this.imageUrl =
      localStorage.getItem('userImage') ||
      'https://via.placeholder.com/130';
  }


  // Load user data from localStorage
  loadUserFromLocalStorage(): void {

    this.name =
      localStorage.getItem('userName') ||
      'User Name';

    this.email =
      localStorage.getItem('userEmail') ||
      'user@email.com';

    this.role =
      localStorage.getItem('role') ||
      'Customer';
  }


  // Edit Profile
  editProfile(): void {

    this.oldName = this.name;
    this.oldEmail = this.email;

    this.editing = true;
  }


  // Save Profile
  saveProfile(): void {

    // Save name and email
    localStorage.setItem('userName', this.name);
    localStorage.setItem('userEmail', this.email);

    // Update user object also
    const userData = localStorage.getItem('user');

    if (userData) {

      try {

        const user = JSON.parse(userData);

        user.name = this.name;
        user.email = this.email;

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        );

      } catch (error) {

        console.error(
          'Error updating user data:',
          error
        );
      }
    }

    this.editing = false;

    alert('Profile updated successfully!');
  }


  // Cancel Editing
  cancelEdit(): void {

    this.name = this.oldName;
    this.email = this.oldEmail;

    this.editing = false;
  }


  // Change Profile Photo
  changePhoto(event: any): void {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      this.imageUrl =
        reader.result as string;

      localStorage.setItem(
        'userImage',
        this.imageUrl
      );
    };

    reader.readAsDataURL(file);
  }

}