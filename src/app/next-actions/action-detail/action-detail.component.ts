import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  selector: 'app-action-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-detail.component.html',
  styleUrl: './action-detail.component.scss'
})
export class ActionDetailComponent {
  navigation = inject(NavigationService);

  constructor() {
    this.navigation.settings.next({
      showBackBtn: true,
      backBtnRoute: 'inbox',
      toolbar: true,
      toolbarHeader: ''
    });
  }
}
