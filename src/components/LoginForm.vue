<template>
  <div class="login-form">
    <h2>Login Administrativo</h2>
    
    <div class="login-content">
      <p class="login-instruction">
        Faça login com sua conta Google para acessar o painel administrativo
      </p>
      
      <button @click="handleGoogleLogin" :disabled="loading" class="google-login-btn">
        <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
        </svg>
        <span v-if="loading" class="spinner"></span>
        {{ loading ? 'Conectando...' : 'Entrar com Google' }}
      </button>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { authService } from '../services/auth'

const error = ref('')
const loading = ref(false)

const handleGoogleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    await authService.loginWithGoogle()
    // Não precisamos navegar aqui pois o OAuth redirecionará automaticamente
  } catch (err) {
    error.value = 'Ocorreu um erro ao conectar com o Google. Por favor, tente novamente.'
    loading.value = false
  }
}
</script>

<style scoped>
.login-form {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-instruction {
  margin-bottom: 2rem;
  color: #666;
  line-height: 1.5;
}

.google-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: white;
  color: #757575;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.google-login-btn:hover {
  background-color: #f8f8f8;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.google-login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: #4285F4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
