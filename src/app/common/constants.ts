import { HttpHeaders } from '@angular/common/http';
import { ActionType } from '../db/entities/action.entity';
import { environment } from 'src/environments/environment';

export const URLPARAM_ID_KEY = 'id';
export const DEFAULT_DEBOUNCE = 300;
export const PROJECT_NAME_MIN_LENGTH = 3;

export const headers = new HttpHeaders().set('Content-Type', 'application/json');

export const actionTypeIcons = {
  [ActionType.wait]: 'hourglass_top',
  [ActionType.schedule]: 'event',
  [ActionType.do]: 'exercise'
} as const;

export const KEYCHAIN = {
  googleAccessToken: `${environment.appName}__gOauthAccessToken`
} as const;

export const googleClientId =
  '968174945289-aipc44p9o7sqtri2jbp6vv2kk1qpi857.apps.googleusercontent.com';
export const googleScopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/calendar'
].join(' ');
