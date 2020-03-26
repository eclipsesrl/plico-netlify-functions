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
  async login(
    { commit, dispatch, state },
    payload: { email: string; password: string; el: HTMLElement }
  ) {
    commit('removeError');
    try {
      await state.authService?.login(payload);
      payload.el.dispatchEvent(
        new CustomEvent('completed', { detail: { success: true } })
      );
      dispatch('router/changeRoute', { name: RouteName.HOME }, { root: true });
    } catch (e) {
      payload.el.dispatchEvent(
        new CustomEvent('completed', { detail: { success: false } })
      );
      dispatch('temporaryError', { message: 'Invalid Credentials' });
    }
  },
  temporaryError({ commit }, payload: { message: string; time?: number }) {
    commit('error', payload.message);
    setTimeout(() => {
      commit('removeError');
    }, payload.time || 3000);
  },
  async register(
    { commit, dispatch, state },
    payload: { name: string; email: string; password: string; el: HTMLElement }
  ) {
    commit('removeError');
    try {
      await state.authService?.register(payload);
      payload.el.dispatchEvent(
        new CustomEvent('completed', { detail: { success: true } })
      );
    } catch (e) {
      payload.el.dispatchEvent(
        new CustomEvent('completed', { detail: { success: false } })
      );
      dispatch('temporaryError', { message: e.message });
    }
  },
  async logout({ state }) {
    await state.authService?.logout();
  },
  async requestPasswordChange(
    { commit, dispatch, state },
    payload: { email: string; el: HTMLElement }
  ) {
    commit('removeError');
    try {
      await state.authService?.requestPasswordChange(payload.email);
      payload.el.dispatchEvent(
        new CustomEvent('completed', { detail: { success: true } })
      );
    } catch (e) {
      payload.el.dispatchEvent(
        new CustomEvent('completed', { detail: { success: false } })
      );
      dispatch('temporaryError', { message: e.message });
    }
  },
  async confirmPasswordChange({ commit, dispatch, state },
    payload: { password: string; code: string, el: HTMLElement }) {
      commit('removeError');
      try {
        await state.authService?.confirmPasswordChange(payload.password, payload.code);
        payload.el.dispatchEvent(
          new CustomEvent('completed', { detail: { success: true } })
        );
      } catch (e) {
        payload.el.dispatchEvent(
          new CustomEvent('completed', { detail: { success: false } })
        );
        dispatch('temporaryError', { message: e.message });
      }
    }
};
