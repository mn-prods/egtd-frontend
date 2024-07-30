import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { googleClientId, googleScopes, headers, KEYCHAIN } from '../constants';
import { GoogleAuthService } from './google-auth.service';

export type GoogleTokens = {
  accessToken: string;
  idToken?: string;
};

declare var google: any;

@Injectable({ providedIn: 'root', deps: [HttpClient] })
export class AuthService {
  auth = inject(Auth);
  google = inject(GoogleAuthService);
  http = inject(HttpClient);

  client: any;
  clientState = 'idontknow';

  constructor() {
    this.initClient();
  }
  initClient() {
    this.client = google.accounts.oauth2.initCodeClient({
      client_id: googleClientId,
      scope: googleScopes,
      ux_mode: 'redirect',
      redirect_uri: environment.redirectUri,
      state: this.clientState
    });
  }

  login() {
    this.client.requestCode();
  }

  exchangeCodeForTokens(code: string) {
    let params = new HttpParams().set('code', code);

    return this.http.get<GoogleTokens>(`${environment.api}/auth/tokens`, { params, headers });
  }

  refreshAccessToken() {
    return this.http.patch<GoogleTokens>(`${environment.api}/auth/tokens`, {
      accessToken: localStorage.getItem(KEYCHAIN.googleAccessToken),
      email: this.auth.currentUser?.email
    });
  }
}
