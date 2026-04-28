// import { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const role = localStorage.getItem('role');

  if (role === 'LabStaff') {
    return true;   // ✅ allow access
  } else {
    router.navigate(['/auth/login']); // ❌ block
    return false;
  }
};