import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import 'zone.js/plugins/zone-patch-rxjs';
import { RxdbProvider } from './common/services/db.provider';
import { NavigationService } from './navigation.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationSettings } from './common/interfaces/navigation-settings.interface';

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

  settings?: NavigationSettings;

  navigate(route: string) {
    this.router.navigate(['/' + route]);
    this.sidenav.close();
  }

  ngOnInit() {
    this.rxdbProvider.initDB('gtd');

    this.navigation.settings
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((settings) => (this.settings = settings));
  }
}
