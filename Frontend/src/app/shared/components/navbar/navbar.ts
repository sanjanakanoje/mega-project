import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {

  showLogout = false;

  constructor(private router: Router) {}

  ngOnInit(): void {

    this.checkNavbar();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkNavbar();
      });

  }

  checkNavbar() {

    const token = localStorage.getItem('token');
    const url = this.router.url;

    // Login page & Home page वर Logout नको
    if (
      !token ||
      url === '/' ||
      url === '/home' ||
      url === '/auth/login' ||
      url === '/auth/register'
    ) {
      this.showLogout = false;
    } else {
      this.showLogout = true;
    }
  }

  logout() {
    localStorage.clear();
    this.showLogout = false;
    this.router.navigate(['/auth/login']);
  }
}