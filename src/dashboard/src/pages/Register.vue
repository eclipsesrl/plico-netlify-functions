<template>
  <div>
    <router-link to="/">Dashboard</router-link>
    <h3>Register</h3>

    <form @submit.prevent="register">
      <div>
        <input
          type="text"
          v-model="email"
          autocomplete="email"
          placeholder="email"
        />
      </div>
      <div>
        <input
          type="password"
          v-model="password"
          autocomplete="current-password"
          placeholder="password"
        />
      </div>
      <input type="submit" />
    </form>
    <p>{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
export default {
  name: 'Login',
  data() {
    return { email: '', password: '' };
  },
  computed: mapGetters('auth', ['error']),
  methods: {
    register() {
      this.$store.dispatch('auth/register', {
        email: this.$data.email,
        password: this.$data.password
      });
    }
  }
};
</script>

<style></style>
