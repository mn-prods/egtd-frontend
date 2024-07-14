import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class GoogleCalendarService {
  http = inject(HttpClient);
  authService = inject(AuthService);

  baseUrl = 'https://www.googleapis.com/calendar';

  getCalendars() {
    this.authService.getGoogleOAuth2Token()
    return this.http.get(`${this.baseUrl}/v3/users/me/calendarList`);
  }
}
