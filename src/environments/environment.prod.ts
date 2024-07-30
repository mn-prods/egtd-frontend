import { firebase } from 'src/firebase.config';

export const environment = {
  appName: 'gtd',
  firebase,
  production: true,
  api: 'https://marnec.ddns.net',
  redirectUri: 'https://egtd-fef96.firebaseapp.com/oauth_callback'
};