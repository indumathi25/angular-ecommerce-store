import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Route guard to protect routes that require authentication.
 * It checks if the user is authenticated using AuthService.
 *
 * - If the route requires authentication (default) and the user is logged in, access is granted.
 * - If the route requires authentication and the user is NOT logged in, they are redirected to the login page.
 * - If the route is for guests (e.g., login page) and the user IS logged in, they are redirected to the products page.
 *
 * @param route The activated route snapshot.
 * @returns True if navigation is allowed, false otherwise.
 */
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
    if (isAuthenticated) {
      router.navigate(['/products']);
      return false;
    }
    return true;
  }
};
