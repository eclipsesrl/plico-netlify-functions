<template>
  <AuthLayout>
    <logo />
    <p class="plico-auth__subtitle">Create a new Account</p>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        class="plico-form"
        @submit.prevent="handleSubmit(register)"
        ref="form"
        v-on:completed="onCompleted($event)"
      >
        <fieldset :disabled="disabled">
          <ValidationProvider
            v-slot="{ errors, classes }"
            rules="required|min:4"
            tag="div"
          >
            <input
              type="text"
              v-model="name"
              :class="classes"
              autocomplete="name"
              placeholder="Name"
            />
            <span class="input-helper">{{ errors[0] }}</span>
          </ValidationProvider>
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
              min: 8,
              regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
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
      Already registered?
      <router-link to="/login">Login here.</router-link>
    </div>
  </AuthLayout>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
export default {
  name: 'Register',
  data() {
    return {
      email: '',
      password: '',
      name: '',
      disabled: false,
      submit: 'Register'
    };
  },
  computed: mapGetters('auth', ['error']),
  methods: {
    onCompleted(e: CustomEventInit) {
      this.disabled = false;
      this.submit = 'Register';
    },
    register() {
      this.disabled = true;
      this.submit = 'Please wait...';
      this.$store.dispatch('auth/register', {
        email: this.email,
        password: this.password,
        name: this.name,
        el: this.$refs.form
      });
    }
  }
};
</script>

<style></style>
