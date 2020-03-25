import { AuthState } from './state';
import { User } from 'firebase';
import AuthService from '@/services/firebase/auth';
import { MutationTree } from 'vuex';

export const mutations: MutationTree<AuthState> = {
  init(state, payload: AuthService) {
    state.authService = payload;
  },
  login(state, payload: User) {
    state.user = payload;
  },
  logout(state) {
    state.user = undefined;
  },
  error(state, payload) {
      state.error = payload;
  },
  removeError(state) {
    state.error = undefined;
  }
};
