import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

const redirectToHome = (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return redirectLoggedInTo(['/home']);
};

const redirectToLogin = (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return redirectUnauthorizedTo(['/login']);
};

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginComponent),
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
    loadComponent: () => import('./user/user.page').then((m) => m.UserPage),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin }
  },
  {
    path: 'inbox',
    loadChildren: () => import('./inbox/inbox.routes').then((mod) => mod.inboxRoutes),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin }
  },
  {
    path: 'actions',
    loadChildren: () => import('./next-actions/action.routes').then((mod) => mod.actionRoutes),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin }
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
