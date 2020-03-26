<template>
  <fragment>
    <p class="plico-auth__subtitle" v-if="!success">Choose your new password</p>
    <ValidationObserver v-slot="{ handleSubmit }" v-if="!success">
      <form
        class="plico-form"
        @submit.prevent="handleSubmit(confirmPasswordChange)"
        ref="form"
        v-on:completed="onCompleted($event)"
      >
        <fieldset :disabled="disabled">
          <ValidationProvider
            name="password"
            v-slot="{ errors, classes }"
            :rules="{
              min: 8,
              regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
              required: true
            }"
            tag="div"
          >
            <input
              type="password"
              v-model="password"
              :class="classes"
              autocomplete="password"
              placeholder="Password"
            />
            <span class="input-helper">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors, classes }"
            rules="required|confirm:@password"
            tag="div"
          >
            <input
              type="password"
              v-model="password_confirm"
              :class="classes"
              autocomplete="password_confirm"
              placeholder="Password confirmation"
            />
            <span class="input-helper">{{ errors[0] }}</span>
          </ValidationProvider>
          <input type="submit" :value="submit" :disabled="disabled" />
        </fieldset>
      </form>
    </ValidationObserver>
    <div v-if="error" class="plico-error">{{ error }}</div>
    <div v-if="success" class="plico-success">
      Password modified successfully!
    </div>
  </fragment>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { RouteName } from '../router';
export default {
  name: 'ResetPasswordForm',
  data() {
    return {
      password: '',
      password_confirm: '',
      disabled: false,
      submit: 'Reset your password',
      success: false
    };
  },
  props: {
    code: String
  },
  computed: mapGetters('auth', ['error']),
  methods: {
    onCompleted(e: CustomEventInit) {
      this.disabled = false;
      this.submit = 'Reset your password';
      this.success = e.detail.success;
      if (this.success) {
        setTimeout(() => {
          this.$store.dispatch('router/changeRoute', { name: RouteName.LOGIN });
        }, 1500);
      }
    },
    confirmPasswordChange() {
      this.success = false;
      this.disabled = true;
      this.submit = 'Please wait...';
      this.$store.dispatch('auth/confirmPasswordChange', {
        password: this.password,
        code: this.code,
        el: this.$refs.form
      });
    }
  }
};
</script>
