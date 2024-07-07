import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  standalone: true,
  styleUrl: './layout.component.scss',
  templateUrl: './layout.component.html',
  selector: 'page-layout',
  imports: [RouterModule, TranslateModule, MatSidenavModule, MatToolbar, MatIcon, MatIconButton]
})
export class GtdPageLayout implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private readonly router = inject(Router);
  private readonly navigation = inject(NavigationService);
  private readonly destroyRef = inject(DestroyRef);

  navigate(route: string) {
    this.router.navigate(['/' + route]);
    this.sidenav.close();
  }

  ngOnInit() {
    this.navigation.toggleSidenav.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.sidenav.toggle();
    });
  }
}
