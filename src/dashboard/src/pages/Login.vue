<template>
  <AuthLayout>
    <logo />
    <p class="plico-auth__subtitle">Nice to have you here :)</p>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        class="plico-form"
        @submit.prevent="handleSubmit(login)"
        ref="form"
        v-on:completed="onCompleted($event)"
      >
        <fieldset :disabled="disabled">
          <ValidationProvider
            v-slot="{ errors, classes }"
            rules="required|email"
            tag="div"
          >
            <input
              type="email"
              v-model="email"
              :class="classes"
              autocomplete="email"
              placeholder="Email"
            />
            <span class="input-helper">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors, classes }"
            :rules="{
              required: true
            }"
            tag="div"
          >
            <input
              type="password"
              :class="classes"
              v-model="password"
              autocomplete="current-password"
              placeholder="Password"
            />
            <span class="input-helper">{{ errors[0] }}</span>
          </ValidationProvider>
          <input type="submit" :value="submit" :disabled="disabled" />
        </fieldset>
      </form>
    </ValidationObserver>
    <div v-if="error" class="plico-error">{{ error }}</div>
    <div style="margin-top: 10px">
      <router-link to="/forgot-password">Forgot Password?</router-link>
    </div>

    <div class="plico-auth__actions">
      Need a Plico account?
      <router-link to="/register">Create an account.</router-link>
    </div>
  </AuthLayout>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
export default {
  name: 'Login',
  data() {
    return { email: '', password: '', disabled: false, submit: 'Login' };
  },
  computed: mapGetters('auth', ['error']),
  methods: {
    onCompleted(e: CustomEventInit) {
      this.disabled = false;
      this.submit = 'Login';
    },
    login() {
      this.disabled = true;
      this.submit = 'Please wait...';
      this.$store.dispatch('auth/login', {
        email: this.email,
        password: this.password,
        el: this.$refs.form
      });
    }
  }
};
</script>
<style>

</style>
