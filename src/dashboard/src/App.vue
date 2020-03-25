<template>
  <fragment>
    <router-view v-if="inited"></router-view>
  </fragment>
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
</style>
