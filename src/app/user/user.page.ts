import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NavigationService } from '../navigation.service';

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
  navigation = inject(NavigationService);

  constructor() {
    this.navigation.settings.next({
      toolbar: true, 
      showSidenavBtn: true
    });

   }

  async logout() {
    await this.auth.signOut();
    await this.router.navigate(['.'])
  }
}
