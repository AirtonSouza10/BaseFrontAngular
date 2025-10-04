import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn & CanActivateChildFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken'); // mesma chave usada no login

  if (!token) {
    // usuário não logado → redireciona para login
    router.navigate(['/login']);
    return false;
  }

  // usuário logado → permite acesso
  return true;
};
