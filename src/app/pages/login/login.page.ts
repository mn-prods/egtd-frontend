import { AfterViewInit, Component, inject } from '@angular/core';
import { Auth, GoogleAuthProvider } from '@angular/fire/auth';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { signInWithCredential } from 'firebase/auth';
import { first, switchMap } from 'rxjs';
import { KEYCHAIN } from 'src/app/common/constants';
import { AuthService } from 'src/app/common/services/auth.service';
import { GtdPageLayout } from 'src/app/layout/layout.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [GtdPageLayout, MatButtonModule, TranslateModule]
})
export class LoginComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly auth = inject(Auth);

  authForm?: FormGroup;

  ngAfterViewInit() {
    this.checkForAuthCode();
  }

  singIn() {
    this.authService.login();
    // await this.router.navigate(['.']);
  }

  private async checkForAuthCode() {
    const fragment = new URL(window.location.href);
    const params = new URLSearchParams(fragment.search);

    let state = params.get('state');

    if (!state) return;

    console.assert(
      state === this.authService.clientState,
      `Randomly generated state sent from this 
      client (${this.authService.clientState}) during 
      authentication is different from state received by OAuth callback (${state}).  
      This indicates a CRSF attack`
    );

    let code = params.get('code') as string;

    console.assert(!!code, `Authorization code received (${code}) is invalid`);

    this.authService
      .exchangeCodeForTokens(code)
      .pipe(
        first(),
        switchMap(({ accessToken, idToken }) => {
          localStorage.setItem(KEYCHAIN.googleAccessToken, accessToken);
          let credential = GoogleAuthProvider.credential(idToken, accessToken);
          return signInWithCredential(this.auth, credential);
        })
      )
      .subscribe(() => {
        this.router.navigate(['/'])
      });
  }
}
