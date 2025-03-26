<template>
  <div class="login-view">
    <LoginForm />
  </div>
</template>

<script setup>
import LoginForm from '../../components/LoginForm.vue'
</script>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}
</style>
