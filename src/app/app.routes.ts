import { Routes } from '@angular/router';
import { Login } from './auth/login';
import { Productlist } from './products/productlist';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    component: Productlist,
  },
  {
    path: '**',
    redirectTo: '/products',
  },
];
