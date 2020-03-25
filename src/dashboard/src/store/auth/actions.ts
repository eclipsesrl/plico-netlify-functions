import { ActionTree } from 'vuex';
import { AuthState } from './state';
import { RootState } from '..';
import { User } from 'firebase';
import { RouteName } from '@/router';

export const actions: ActionTree<AuthState, RootState> = {
  initialize({ commit, dispatch }) {
    import('@/services/firebase/auth').then(module => {
      const auth = new module.default(dispatch);
      commit('init', auth);
    });
  },
  changeState({ commit, dispatch }, payload?: User) {
    if (payload) {
      commit('login', payload);
      dispatch(
        'router/changeRouteIfHidden',
        { name: RouteName.HOME },
        { root: true }
      );
    } else {
      commit('logout');
      dispatch(
        'router/changeRouteIfPrivate',
        { name: RouteName.LOGIN },
        { root: true }
      );
    }

    dispatch('app/init', null, { root: true });
  },
  async login({ commit, dispatch, state }, payload) {
    commit('error', undefined);
    try {
      await state.authService?.login(payload);
      dispatch('router/changeRoute', { name: RouteName.HOME }, { root: true });
    } catch (e) {
      commit('error', e.message);
    }
  },
  async register({ commit, state }, payload) {
    commit('error', undefined);
    try {
      await state.authService?.register(payload);
    } catch (e) {
      commit('error', e.message);
    }
  },
  async logout({ dispatch, state }) {
    await state.authService?.logout();
  }
};
