import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [AuthGuard],
    data: { requiresAuth: false },
    loadComponent: () => import('./auth/login').then((m) => m.Login),
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    loadComponent: () => import('./products/productlist').then((m) => m.Productlist),
  },
  {
    path: 'products/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./products/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: '**',
    redirectTo: '/products',
  },
];
