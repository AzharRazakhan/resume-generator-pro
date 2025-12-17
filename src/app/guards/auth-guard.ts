import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Api } from '../auth/api';

export const authGuard: CanActivateFn = (route, state) => {
  const apiServie = inject(Api);
  const router = inject(Router);

  if (apiServie.isLogin()) {
    return true
  } else {
    router.navigate(['/login'])
    return false
  }
};
