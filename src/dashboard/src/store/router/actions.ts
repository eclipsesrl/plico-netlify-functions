import router from '@/router';
import { ActionTree } from 'vuex';
import { RootState } from '..';
import { RawLocation } from 'vue-router';

export const actions: ActionTree<{}, RootState> = {
  changeRoute(_, location: RawLocation) {
    let should = false;
    if (typeof location == 'string') {
      should = router.currentRoute.path !== location;
    } else {
      if (router.currentRoute.name != location.name) {
        should = true;
      }
    }
    if (should) {
      router.push(location);
    }
  },
  changeRouteIfPrivate({ dispatch }, location: RawLocation) {
    if (router.currentRoute.meta.requiresAuth) {
      dispatch('changeRoute', location);
    }
  },
  changeRouteIfHidden({ dispatch }, location: RawLocation) {
    if (router.currentRoute.meta.preventAuth) {
      dispatch('changeRoute', location);
    }
  }
};
