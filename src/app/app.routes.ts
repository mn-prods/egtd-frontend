import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes, UrlSegment } from '@angular/router';
import { TestComponent } from './pages/test-component/test.component';
import { LoginComponent } from './pages/login/login.page';

const redirectToHome = (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return redirectLoggedInTo(['/home']);
};

const redirectToLogin = (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return redirectUnauthorizedTo(['/login']);
};

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginComponent),
    data: { authGuardPipe: redirectToHome }
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin }
  },
  {
    path: 'user',
    loadComponent: () => import('./pages/user/user.page').then((m) => m.UserPage),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin }
  },
  {
    path: 'inbox',
    loadChildren: () => import('./pages/inbox/inbox.routes').then((mod) => mod.inboxRoutes),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin }
  },
  {
    path: 'actions',
    loadChildren: () => import('./pages/actions/action.routes').then((mod) => mod.actionItemRoutes),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin }
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./pages/projects/projects.routes').then((mod) => mod.projectsRoutes),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin }
  },
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: 'oauth_callback',
    component: LoginComponent
  },
  {
    path: '*',
    redirectTo: 'home'
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
