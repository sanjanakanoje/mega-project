// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-welcome',
//   imports: [],
//   templateUrl: './welcome.html',
//   styleUrl: './welcome.css',
// })
// export class WelcomeComponent {}


import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css'],   
})
export class WelcomeComponent {}