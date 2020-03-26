<template>
  <AuthLayout>
    <logo />
    <p class="plico-auth__subtitle">Lost your password?</p>
    <ValidationObserver v-slot="{ handleSubmit }" v-if="!success">
      <form
        class="plico-form"
        @submit.prevent="handleSubmit(requestPasswordChange)"
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
          <input type="submit" :value="submit" :disabled="disabled" />
        </fieldset>
      </form>
    </ValidationObserver>
    <div v-if="error" class="plico-error">{{ error }}</div>
    <div v-if="success" class="plico-success">
      Check your email to reset your password!
    </div>
  </AuthLayout>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      disabled: false,
      submit: 'Request a Password Change',
      success: false
    };
  },
  computed: mapGetters('auth', ['error']),
  methods: {
    onCompleted(e: CustomEventInit) {
      this.disabled = false;
      this.submit = 'Request a Password Change';
      this.success = e.detail.success;
    },
    requestPasswordChange() {
      this.success = false;
      this.disabled = true;
      this.submit = 'Please wait...';
      this.$store.dispatch('auth/requestPasswordChange', {
        email: this.email,
        el: this.$refs.form
      });
    }
  }
};
</script>
<style>

</style>