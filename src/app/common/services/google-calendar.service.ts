import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { KEYCHAIN } from '../constants';
import { GoogleCalendarEvents } from '../types/google.type';


@Injectable({ providedIn: 'root' })
export class GoogleCalendarService {
  http = inject(HttpClient);
  auth = inject(Auth);

  baseUrl = 'https://www.googleapis.com/calendar';

  getCalendars() {
    return this.http.get(`${this.baseUrl}/v3/users/me/calendarList`, {
      headers: { Authorization: `Bearer ${localStorage.getItem(KEYCHAIN.googleAccessToken)}` }
    });
  }

  getEvents(calendarId: string, from?: Date, to?: Date) {
    let params = new HttpParams();

    if (from) params = params.set('timeMin', from.toISOString());

    if (to) params = params.set('timeMax', to.toISOString());

    return this.http.get<GoogleCalendarEvents>(
      `${this.baseUrl}/v3/calendars/${calendarId}/events`,
      {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem(KEYCHAIN.googleAccessToken)}` }
      }
    );
  }
}
