import { Routes } from '@angular/router';
import { Login } from './auth/login';
import { Productlist } from './products/productlist';
import { ProductDetail } from './products/product-detail/product-detail';
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
    path: 'products/:id',
    canActivate: [AuthGuard],
    component: ProductDetail,
  },
  {
    path: '**',
    redirectTo: '/products',
  },
];
