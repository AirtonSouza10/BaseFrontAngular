import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    // usuário não está logado → redireciona para login
    router.navigate(['/login']);
    return false;
  }

  // usuário logado → permite acesso
  return true;
};
