<script setup>
import { onMounted } from 'vue'
import { useOAuthCallback } from '../../composables/useOAuthCallback'
import { useRouter } from 'vue-router'

const { handleCallback } = useOAuthCallback()
const router = useRouter()

onMounted(async () => {
  const timer = setTimeout(() => {
    if (router.currentRoute.value.path === '/auth/callback') {
      router.replace('/dashboard').catch(()=>{})
    }
  }, 4000)
  await handleCallback()
  clearTimeout(timer)
})
</script>

<template>
  <div style="display:flex;align-items:center;justify-content:center;min-height:60vh;color:#fff;flex-direction:column;gap:1rem;">
    <span>Processando login...</span>
    <span style="font-size:0.8rem;opacity:0.6;">Aguarde, redirecionando para o dashboard.</span>
  </div>
</template>

<style scoped>
</style>
