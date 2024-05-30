export interface FirebaseUser {
  apiKey?: string;
  appName?: string;
  createdAt?: string;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  lastLoginAt?: string;
  phoneNumber: string | null;
  photoURL: string | null;
  uid: string;
}

export interface User {
  uid: string;

  email?: string;

  userName?: string;

  avatar?: string;

  created: Date;

  modified: Date;

}
