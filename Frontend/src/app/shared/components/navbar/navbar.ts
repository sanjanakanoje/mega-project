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

showLogout: boolean = false;

constructor(private router: Router) {}

ngOnInit(): void {
this.checkNavbar();


this.router.events
  .pipe(
    filter(event => event instanceof NavigationEnd)
  )
  .subscribe(() => {
    this.checkNavbar();
  });


}

checkNavbar(): void {
const token = localStorage.getItem('token');
const url = this.router.url;


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

goToLogin(): void {
this.router.navigate(['/auth/login']);
}

logout(): void {
localStorage.clear();
this.showLogout = false;
this.router.navigate(['/auth/login']);
}
}
