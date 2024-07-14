import { Component, OnInit, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  auth = inject(Auth);
  private readonly router = inject(Router);

  authForm?: FormGroup;

  ngOnInit() {
    this.authForm = new FormGroup({
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(6)])
    });
  }

  async singIn() {
    let provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/calendar');

    const result = await signInWithPopup(this.auth, provider);
    console.log(result);

    await this.router.navigate(['.']);
  }
}
