<script setup>
import navBar from './components/navBar.vue'
</script>

<template>
  <navBar/>
  <RouterView />
</template>

<style lang="scss">
@import './scss/style.scss';

html, body {
  background-color: $cor-dark;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  max-height: 100vh;
}
</style>
