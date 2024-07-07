import { Component } from '@angular/core';
import 'zone.js/plugins/zone-patch-rxjs';
import { GtdPageLayout } from './layout/layout.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  standalone: true,
  imports: [RouterModule]
})
export class AppComponent {}
