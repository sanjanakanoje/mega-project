import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',   
  styleUrls: ['./navbar.css']     
})
export class NavbarComponent {

  constructor(private router: Router) {}
logout() {
  localStorage.clear();   // remove user data

  this.router.navigateByUrl('/auth/login');   
}
}