import { actions } from './actions';
import { Module } from 'vuex';
import { RootState } from '..';


export const router: Module<{}, RootState> = {
    namespaced: true,
    actions
}