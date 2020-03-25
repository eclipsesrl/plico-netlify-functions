import VueRouter from 'vue-router';
import Dashboard from '../pages/Dashboard.vue';
import Login from '../pages/Login.vue';
import Register from '@/pages/Register.vue';
import Vue from 'vue';
import store from '@/store';

Vue.use(VueRouter);

export enum RouteName {
  HOME = 'dashboard',
  LOGIN = 'login',
  REGISTER = 'register'
}

const routes = [
  {
    path: '/',
    component: Dashboard,
    name: RouteName.HOME,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: Login,
    name: RouteName.LOGIN,
    meta: { preventAuth: true }
  },
  {
    path: '/register',
    component: Register,
    name: RouteName.REGISTER,
    meta: { preventAuth: true }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: '/dashboard',
  routes // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn'];
  if (to.meta.requiresAuth) {
    if (isLoggedIn) {
      next();
    } else {
      if (store.state.app.inited) {
        next({ name: RouteName.LOGIN });
      } else {
        next();
      }
    }
  } else if (to.meta.preventAuth && isLoggedIn) {
    next({ name: RouteName.HOME });
  } else {
    next();
  }
});

export default router;
