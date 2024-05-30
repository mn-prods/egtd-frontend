import { Component, OnInit, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  auth = inject(Auth);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  authForm?: FormGroup;

  ngOnInit() {
    this.authForm = new FormGroup({
      email: new FormControl<string>("", [Validators.required, Validators.email]),
      password: new FormControl<string>("", [Validators.required, Validators.minLength(6)])
    });
  }

  async singIn() {
    if (!this.authForm?.valid) {
      return;
    }

    const { email, password } = this.authForm.value;
    await this.authService.signIn();
    
  }

 


}
