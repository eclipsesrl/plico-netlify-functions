import { GetterTree } from 'vuex';
import { AuthState } from './state';
import { RootState } from '..';

export const getters: GetterTree<AuthState, RootState> = {
  isLoggedIn(state) {
    return !!state.user;
  },
  error(state) {
    return state.error;
  }
};
