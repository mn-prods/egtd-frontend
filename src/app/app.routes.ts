import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard'


const redirectToHome = (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return redirectLoggedInTo(['/home']);
};

const redirectToLogin = (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return redirectUnauthorizedTo(['/login']);
};

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginComponent),
    data: { authGuardPipe: redirectToHome }
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin }
  },
  {
    path: 'user',
    loadComponent: () => import('./user/user.page').then(m => m.UserPage),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin }
  },
  {
    path: 'inbox',
    loadComponent: () => import('./inbox/inbox.page').then(m => m.InboxPage),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin }
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
