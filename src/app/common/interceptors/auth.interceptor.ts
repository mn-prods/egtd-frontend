import { HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Auth } from '@angular/fire/auth';
import { filter, from, of, switchMap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(Auth);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.includes('googleapis')) return next.handle(req);

    if (req.url.includes('/auth')) return next.handle(req);

    return from(this.auth.currentUser?.getIdToken() || of(null)).pipe(
      filter(Boolean),
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const authorizedRequest = req.clone({
          headers
        });

        return next.handle(authorizedRequest);
      })
    );
  }
}
