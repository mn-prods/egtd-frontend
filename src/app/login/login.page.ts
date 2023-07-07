import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{

  constructor(public auth: AngularFireAuth, private router: Router) {
  }
  async login() {
    await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    await this.router.navigate(['home']);
  }
  
  logout() {
    this.auth.signOut();
  }

}
