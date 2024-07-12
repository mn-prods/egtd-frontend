import { HttpHeaders } from '@angular/common/http';
import { ActionType } from '../db/entities/action.entity';

export const URLPARAM_ID_KEY = 'id';
export const DEFAULT_DEBOUNCE = 300;
export const PROJECT_NAME_MIN_LENGTH = 3;

export const headers = new HttpHeaders().set('Content-Type', 'application/json');

export const actionTypeIcons = {
  [ActionType.wait]: 'hourglass_top',
  [ActionType.schedule]: 'event',
  [ActionType.do]: 'exercise'
} as const;
