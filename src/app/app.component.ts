import { Component, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule],
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav

  private readonly router = inject(Router)


  navigate(route: string) {
    this.router.navigate(['/' + route])
    this.sidenav.close();

  }
}
