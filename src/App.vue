<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import navBar from './components/navBar.vue'
import { useOAuthCallback } from './composables/useOAuthCallback'

const route = useRoute()
const { handleCallback } = useOAuthCallback()

onMounted(async () => {
  // Check if this is an OAuth callback
  if (route.hash && (route.hash.includes('access_token') || route.hash.includes('code'))) {
    console.log('🔄 OAuth callback detected')
    await handleCallback()
  }
})
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
