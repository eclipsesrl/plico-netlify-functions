<template>
  <div>
    <h1>Dashboard</h1>
    <router-link to="register">Register</router-link>
    <button @click="logOut()">Logout</button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Dashboard',
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
    }
  }
};
</script>

<style></style>
