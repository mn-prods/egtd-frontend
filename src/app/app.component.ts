import { Component, DestroyRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationSettings } from './common/interfaces/navigation-settings.interface';
import { RxdbProvider } from './common/services/db.provider';
import { NavigationService } from './navigation.service';
import 'zone.js/plugins/zone-patch-rxjs';
import { Auth } from '@angular/fire/auth';
import { FirebaseUser } from './common/interfaces/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  standalone: true,
  imports: [RouterModule, TranslateModule, MatSidenavModule, MatToolbar, MatIcon, MatIconButton]
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private readonly router = inject(Router);
  private readonly rxdbProvider = inject(RxdbProvider);
  private readonly navigation = inject(NavigationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly auth = inject(Auth);

  settings = signal<NavigationSettings | null>(null);

  user = signal<FirebaseUser | null>(null);

  navigate(route: string) {
    this.router.navigate(['/' + route]);
    this.sidenav.close();
  }

  ngOnInit() {
    this.rxdbProvider.initDB('gtd');

    this.navigation.settings.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(this.settings.set);

    this.auth.onAuthStateChanged((user) => this.user.set(user));
  }
}
