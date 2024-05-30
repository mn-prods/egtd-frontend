import { Injectable, inject } from "@angular/core";
import { Auth, GoogleAuthProvider, UserCredential, signInWithPopup } from "@angular/fire/auth";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly auth = inject(Auth);

    get user() {
        return this.auth.currentUser;
    }

    signIn(): Promise<UserCredential> {
        return signInWithPopup(
            this.auth,
            new GoogleAuthProvider()
        );
    }
}