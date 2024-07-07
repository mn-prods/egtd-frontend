import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { NavigationSettings } from './common/interfaces/navigation-settings.interface';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  toggleSidenav = new Subject<void>();
}
