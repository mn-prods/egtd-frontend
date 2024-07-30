import { HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { catchError, switchMap, tap, throwError } from 'rxjs';
import { KEYCHAIN } from '../constants';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GoogleApisInterceptor implements HttpInterceptor {
  authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!req.url.includes('googleapis')) return next.handle(req);

    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 401) {
          return this.authService.refreshAccessToken().pipe(
            tap((tokens) => localStorage.setItem(KEYCHAIN.googleAccessToken, tokens.accessToken)),
            switchMap((tokens) => {
              const headers = new HttpHeaders().set(
                'Authorization',
                `Bearer ${tokens.accessToken}`
              );
              const authorizedRequest = req.clone({
                headers
              });

              return next.handle(authorizedRequest);
            })
          );
        }

        return throwError(() => err);
      })
    );
  }
}
