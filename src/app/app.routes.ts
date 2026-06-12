import { Routes } from '@angular/router';
import { authGuard }  from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '',         redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',     loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'menu',     loadComponent: () => import('./features/menu/menu.component').then(m => m.MenuComponent) },
  { path: 'cart',     loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent) },
  { path: 'tracking', loadComponent: () => import('./features/tracking/tracking.component').then(m => m.TrackingComponent) },
  { path: 'profile',  loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'login',    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
  { path: 'success',  loadComponent: () => import('./features/success/success.component').then(m => m.SuccessComponent), canActivate: [authGuard] },
  { path: 'admin',    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent), canActivate: [authGuard, adminGuard] },
  { path: '**',       redirectTo: 'home' },
];
