import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { googleClientId, googleScopes } from '../constants';

@Injectable({ providedIn: 'root', deps: [HttpClient] })
export class GoogleAuthService {
  http = inject(HttpClient);
  document = inject(DOCUMENT);

  api = 'https://accounts.google.com/o/oauth2';

  generateOAuth2RedirectUrl(): string {
    let params = new HttpParams()
      .set('client_id', googleClientId)
      .set('redirect_uri', environment.redirectUri)
      /**
       * JavaScript applications need to set the parameter's value to token.
       * This value instructs the Google Authorization Server to return the access token as a
       * name=value pair in the fragment identifier of the URI (#) to which the user is
       * redirected after completing the authorization process.
       */
      .set('response_type', 'token')
      .set('scope', googleScopes);

    return `${this.api}/v2/auth?${params.toString()}`;
  }

  redirectToOAuth2Url(): void {
    const url = this.generateOAuth2RedirectUrl();
    console.log(url);
    this.document.location.href = url;
  }
}
