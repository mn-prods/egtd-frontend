import { Component, inject } from '@angular/core';
import { NavigationService } from 'src/app/navigation.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: []
})
export class HomePage {
  private readonly navigation = inject(NavigationService);
  constructor() {
    this.navigation.settings.next({
      toolbar: true,
      toolbarHeader: 'home.toolbar',
      showSidenavBtn: true
    });
  }
}
