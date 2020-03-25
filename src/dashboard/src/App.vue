<template>
  <div id="app">
    {{ inited }}
    <router-view v-if="inited"></router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'App',
  computed: mapState('app', ['inited']),
  created() {
    this.$store.dispatch('app/bootstrap');
  }
});
</script>

<style lang="scss">
@import './assets/css/global.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
