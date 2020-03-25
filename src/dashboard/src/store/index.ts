import Vue from 'vue';
import Vuex from 'vuex';
import '../services/firebase/index';
import app from './app';
import { auth } from './auth';
import { router } from './router';
import { AppState } from './app/state';
import { AuthState } from './auth/state';
// Init Firebase
Vue.use(Vuex);

export interface RootState {
  app: AppState;
  auth: AuthState;
}

export default new Vuex.Store({
  modules: {
    app,
    auth,
    router
  }
});
