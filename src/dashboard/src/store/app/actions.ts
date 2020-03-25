import { ActionTree } from 'vuex';
import { AppState } from './state';
import { RootState } from '..';

export const actions: ActionTree<AppState, RootState> = {
  init({ commit, state }) {
    if (!state.inited) {
      commit('init');
    }
  },
  bootstrap({ dispatch }) {
    dispatch('auth/initialize', null, { root: true });
  }
};
