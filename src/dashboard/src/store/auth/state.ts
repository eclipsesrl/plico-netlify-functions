import { User } from 'firebase';
import AuthService from '@/services/firebase/auth';

export type AuthState = {
  user?: User;
  authService?: AuthService;
  error?: string;
};

export const state: AuthState = {
  error: undefined,
  user: undefined,
  authService: undefined
};
