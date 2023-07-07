import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
} from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { filter, first, switchMap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AngularFireAuth) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.auth.idToken.pipe(
      filter(Boolean),
      first(),
      switchMap((token) => {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );
        const authorizedRequest = req.clone({
          headers,
        });

        return next.handle(authorizedRequest);
      })
    );
  }
}
