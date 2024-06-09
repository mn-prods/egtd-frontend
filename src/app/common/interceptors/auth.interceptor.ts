import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';

import { filter, first, from, of, switchMap } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(Auth);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return from(this.auth.currentUser?.getIdToken() || of(null)).pipe(
      filter(Boolean),
      first(),
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
