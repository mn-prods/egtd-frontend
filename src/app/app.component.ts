import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import 'zone.js/plugins/zone-patch-rxjs';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  standalone: true,
  imports: [RouterModule]
})
export class AppComponent {}
