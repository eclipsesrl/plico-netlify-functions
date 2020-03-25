<template>
  <main class="plico-auth">
    <div class="plico-auth__wrapper">
      <div>
        <slot></slot>
      </div>
    </div>
    <div class="plico-auth__aside">
      <img src="@/assets/images/auth-dashboard.png" />
    </div>
  </main>
</template>
<script>
export default {
  name: 'auth-layout'
};
</script>
<style>
.plico-auth {
  display: grid;
  width: 100%;
  height: 100vh;
  grid-template-columns: 7fr 3fr;
}
.plico-auth__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.plico-auth__wrapper  > div {
  width: 100%;
  max-width: 400px;
  margin: auto;
}
.plico-auth__aside {
  background-color: var(--secondary-background-color);
  display: flex;
  align-items: flex-end;
}
img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}
</style>
