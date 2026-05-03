import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CustomerGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
  const role = localStorage.getItem('role')?.trim().toLowerCase();

  if (role === 'customer') {
    return true;
  }

  this.router.navigate(['/home']);
  return false;
}
}