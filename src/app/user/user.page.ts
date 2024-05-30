import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: []
})
export class UserPage {
  auth = inject(Auth);
  router = inject(Router);

  constructor() { }

  async logout() {
    await this.auth.signOut();
    await this.router.navigate(['.'])
  }
}
