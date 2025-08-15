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
  background-color: $cor-dark;
  min-height: 100vh;
  max-height: 100vh;
}

/* Remove the problematic max-height setting that causes issues on mobile */
@media screen and (max-width: 960px) {
  #app {
    min-height: 30vh;
    max-height: 30vh;
  }


}
</style>
