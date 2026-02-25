import { UserInputs } from '../utils/calculations';

export interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  joinedAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  metrics: UserInputs;
}

export interface UserAuth {
  username: string;
  salt: string;
  passwordHash: string; // PBKDF2 derived key
}

export interface DatabaseUser {
  profile: UserProfile;
  auth: UserAuth;
}
