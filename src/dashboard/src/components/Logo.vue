<template>
  <a href="https://plico.app" class="plico-logo">
    <img src="@/assets/images/plico-logo.svg" alt="logo"
  /></a>
</template>
<script>
export default {
  name: 'Logo'
};
</script>
<style>
.plico-logo {
  transition: opacity 300ms ease-in-out;
}
.plico-logo:hover {
    opacity: 0.7;
}
.plico-logo img {
  width: 130px;
  height: auto;
}
</style>
