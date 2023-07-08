import { HttpHeaders } from "@angular/common/http";

export const ID_PLACEHOLDER = 'new';
export const URLPARAM_ID_KEY = 'id';
export const DEFAULT_DEBOUNCE = 300;

export const headers = new HttpHeaders().set('Content-Type', 'application/json')