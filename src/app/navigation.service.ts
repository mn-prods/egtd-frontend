import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavigationSettings } from './common/interfaces/navigation-settings.interface';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public settings = new BehaviorSubject<NavigationSettings>({
    toolbar: false,
    toolbarHeader: '',
    showSidenavBtn: false,
    showBackBtn: false,
    backBtnRoute: '..'
  });

  updateSetting(settings: Partial<NavigationSettings>) {
    this.settings.next({ ...this.settings.value, ...settings });
  }
}
