import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="about-container">

      <h1>About Smart Textile System</h1>

      <p class="intro">
        The Smart Textile Management System is designed to simplify textile
        operations, manage fabric samples, and improve overall efficiency.
      </p>

      <div class="card">
        <h2>🎯 Our Objective</h2>
        <p>
          To provide a digital platform that helps textile industries manage
          data easily, reduce manual work, and increase productivity.
        </p>
      </div>

      <div class="card">
        <h2>⚙️ Features</h2>
        <ul>
          <li>✔ Add and manage textile samples</li>
          <li>✔ User login and registration</li>
          <li>✔ Profile management</li>
          <li>✔ Easy navigation system</li>
        </ul>
      </div>

      <div class="card">
        <h2>💻 Technology Used</h2>
        <ul>
          <li>Angular (Frontend)</li>
          <li>Node.js (Backend)</li>
          <li>MySQL (Database)</li>
        </ul>
      </div>

      <div class="card">
        <h2>🏭 About Industry</h2>
        <p>
          Textile industry plays an important role in manufacturing and economy.
          This system helps modernize traditional processes using technology.
        </p>
      </div>

    </div>
  `,

  styles: [`
    .about-container {
      min-height: 100vh;
      padding: 60px;
      background: linear-gradient(135deg, #000000, #1a1a1a);
      color: white;
    }

    h1 {
      text-align: center;
      font-size: 40px;
      margin-bottom: 20px;
      color: orange;
    }

    .intro {
      text-align: center;
      font-size: 18px;
      color: #ccc;
      margin-bottom: 40px;
    }

    .card {
      background: rgba(255,255,255,0.05);
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 10px;
      transition: 0.3s;
    }

    .card:hover {
      transform: scale(1.02);
      background: rgba(255,255,255,0.08);
    }

    h2 {
      color: orange;
      margin-bottom: 10px;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      margin: 8px 0;
    }
  `]
})
export class AboutComponent {}