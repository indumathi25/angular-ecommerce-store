import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Default to true (protected) if not specified
  const requiresAuth = route.data['requiresAuth'] !== false;
  const isAuthenticated = authService.isAuthenticated();

  if (requiresAuth) {
    // Protected Route: Must be logged in
    if (isAuthenticated) {
      return true;
    }
    router.navigate(['/login']);
    return false;
  } else {
    // Guest Route: Login page
    if (isAuthenticated) {
      router.navigate(['/products']);
      return false;
    }
    return true;
  }
};
