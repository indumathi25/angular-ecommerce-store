import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

/**
 * Route guard to protect routes that require authentication.
 * It checks if the user is authenticated using AuthService.
 *
 * Token Handling Approach:
 * - AuthGuard uses the AuthService to allow or block routes based on the token stored in the cookie.
 */
export const AuthGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Default to true (protected) if not specified
  const requiresAuth = route.data['requiresAuth'] !== false;

  return authService.checkAuth().pipe(
    map((isAuthenticated) => {
      if (requiresAuth) {
        // Protected Route: Must be logged in
        if (isAuthenticated) {
          return true;
        }
        // Only redirect if we are in the browser to avoid SSR redirect loops
        if (typeof window !== 'undefined') {
          router.navigate(['/login']);
        }
        return false;
      } else {
        // Guest Route (e.g. Login): Must NOT be logged in
        if (isAuthenticated) {
          router.navigate(['/products']);
          return false;
        }
        return true;
      }
    })
  );
};
