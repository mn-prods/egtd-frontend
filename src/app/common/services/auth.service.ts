import { inject, Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  auth = inject(Auth);

  getGoogleOAuth2Token() {
    // Assuming the user is already linked with Google provider
    this.auth.currentUser
      ?.getIdToken(true)
      .then((idToken) => {
        console.log('Firebase ID Token:', idToken);
        // Now, retrieve the Google access token
        const user = this.auth.currentUser;
        user!.reload().then(() => {
          let credential = GoogleAuthProvider.credential(idToken);
          console.log(credential)
        });
      })
      .catch((error) => {
        console.error('Error getting Firebase ID Token:', error);
      });
  }
}
