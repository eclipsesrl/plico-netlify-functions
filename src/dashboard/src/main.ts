import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';

// Global Components
import AuthLayout from '@/layouts/Auth.vue';
//@ts-ignore
import { Fragment } from 'vue-fragment';
import Logo from '@/components/Logo.vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import '@/validation-rules';

Vue.config.productionTip = false;

Vue.component('AuthLayout', AuthLayout);
Vue.component('fragment', Fragment);
Vue.component('logo', Logo);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
