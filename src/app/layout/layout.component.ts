import { Component, DestroyRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth } from '@angular/fire/auth';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationSettings } from 'src/app/common/interfaces/navigation-settings.interface';
import { FirebaseUser } from 'src/app/common/interfaces/user.interface';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  standalone: true,
  styleUrl: './layout.component.scss',
  templateUrl: './layout.component.html',
  selector: 'app-layout',
  imports: [RouterModule, TranslateModule, MatSidenavModule, MatToolbar, MatIcon, MatIconButton]
})
export class LayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private readonly router = inject(Router);
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
    this.navigation.settings.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(this.settings.set);

    this.auth.onAuthStateChanged((user) => this.user.set(user));
  }
}
