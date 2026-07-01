import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Acceso',
    loadComponent: () =>
      import('./auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'auth/callback',
    title: 'Validando acceso',
    loadComponent: () =>
      import('./auth/callback/auth-callback.page').then(
        (m) => m.AuthCallbackPage,
      ),
  },
  {
    path: 'home',
    title: 'Menorca AI Agent',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
