import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NavigationService } from '../../navigation.service';
import { GtdPageLayout } from 'src/app/layout/layout.component';
import { ToolbarComponent } from 'src/app/layout/toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [GtdPageLayout, ToolbarComponent, MatButtonModule]
})
export class UserPage {
  auth = inject(Auth);
  router = inject(Router);

  async logout() {
    await this.auth.signOut();
    await this.router.navigate(['.']);
  }
}
