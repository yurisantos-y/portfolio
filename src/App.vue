<script setup>
import navBar from './components/navBar.vue'
import cardHome from './components/cardHome.vue'
</script>

<template>

  <navBar/>
  <cardHome/>
  <RouterView />

</template>

<style lang="scss">
@import './scss/style.scss';

</style>
