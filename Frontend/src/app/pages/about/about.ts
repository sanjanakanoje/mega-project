import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="about-container">

      <h1>About Aretez</h1>

      <p>
        Aretez is a modern textile solutions company focused on improving
        production efficiency through smart technology.
      </p>

      <p>
        Our system helps textile industries manage, track, and optimize
        their operations in a simple and effective way.
      </p>

      <p>
        We aim to reduce manual work, improve productivity, and bring
        innovation into traditional textile processes.
      </p>

    </div>
  `,

  styles: [`
    .about-container {
      min-height: 100vh;
      padding: 100px 20px 40px;
      background: linear-gradient(135deg, #000000, #1a1a1a);
      color: white;
      text-align: center;
    }

    h1 {
      font-size: 38px;
      margin-bottom: 20px;
      color: orange;
    }

    p {
      max-width: 700px;
      margin: 10px auto;
      font-size: 18px;
      color: #ccc;
      line-height: 1.6;
    }
  `]
})
export class AboutComponent {}