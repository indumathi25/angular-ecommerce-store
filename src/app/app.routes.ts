import { Routes } from '@angular/router';
import { Login } from './auth/login';
import { Productlist } from './products/productlist';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'products',
    component: Productlist,
  },
];
