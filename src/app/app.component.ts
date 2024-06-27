import { Component } from '@angular/core';
import 'zone.js/plugins/zone-patch-rxjs';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  standalone: true,
  imports: [LayoutComponent]
})
export class AppComponent {}
