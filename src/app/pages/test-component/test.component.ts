import { Component, inject } from '@angular/core';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  standalone: true,
  templateUrl: './test.component.html'
})
export class TestComponent {
  navigation = inject(NavigationService);

  constructor() {
    this.navigation.settings.next({ toolbar: true });
  }
}
