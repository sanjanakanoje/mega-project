// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class App {
//   protected readonly title = signal('Frontend');
// }
import { NavbarComponent } from './shared/components/navbar/navbar';

import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { AiChat } from './pages/ai-chat/ai-chat';

// @Component({
//   selector: 'app-root',
//   standalone: true,

//   imports: [
//     RouterOutlet
//   ],

//   templateUrl: './app.html',
//   styleUrls: ['./app.css']
// })
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    AiChat  // ✅ REQUIRED
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {

  title = 'Aretez Lab';

}