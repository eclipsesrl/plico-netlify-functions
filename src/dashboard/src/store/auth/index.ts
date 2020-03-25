import { state, AuthState } from './state';
import { mutations } from './mutations';
import { actions } from './actions';
import { Module } from 'vuex';
import { RootState } from '..';
import { getters } from './getters';

export const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
