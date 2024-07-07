import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FirebaseUser } from 'src/app/common/interfaces/user.interface';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  standalone: true,
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  imports: [MatToolbarModule, MatIconModule, RouterModule, TranslateModule, MatButtonModule]
})
export class ToolbarComponent implements OnInit {
  header = input<string>('');
  backBtn = input<boolean>();
  backRoute = input<string>('../');
  menuBtn = input<boolean>();

  user = signal<FirebaseUser | null>(null);

  private readonly navigation = inject(NavigationService);
  private readonly auth = inject(Auth);

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => this.user.set(user));
  }

  toggleSideNav() {
    this.navigation.toggleSidenav.next();
  }
}
