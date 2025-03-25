<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <img src="../assets/logo.png" alt="Logo" class="login-logo">
        <h1>{{ $t('login.title') || 'Login' }}</h1>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">{{ $t('login.email') || 'Email' }}</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            :placeholder="$t('login.emailPlaceholder') || 'Enter your email'" 
          />
        </div>
        
        <div class="form-group">
          <label for="password">{{ $t('login.password') || 'Password' }}</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            :placeholder="$t('login.passwordPlaceholder') || 'Enter your password'" 
          />
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <button 
          type="submit" 
          :disabled="isLoading"
          class="login-button"
        >
          {{ isLoading ? ($t('login.loggingIn') || 'Logging in...') : ($t('login.loginButton') || 'Login') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseAuth } from '../composables/useSupabaseAuth'

const router = useRouter()
const { login } = useSupabaseAuth()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleLogin() {
  errorMessage.value = ''
  isLoading.value = true
  
  try {
    const { user, error } = await login(email.value, password.value)
    
    if (error) {
      errorMessage.value = error
      return
    }
    
    if (user) {
      // Redirect to dashboard on successful login
      router.push('/dashboard')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss">
@import '../scss/style.scss';

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: $cor-light;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.login-header {
  text-align: center;
  padding: 2rem 1.5rem;
  
  .login-logo {
    width: 60px;
    height: auto;
    margin-bottom: 1rem;
  }
  
  h1 {
    margin: 0;
    color: $cor-textDark;
    font-size: 1.8rem;
    font-weight: 600;
  }
}

.login-form {
  padding: 0 2rem 2rem;
  
  .form-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: $cor-textDark;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: $cor-primaria;
        box-shadow: 0 0 0 2px rgba($cor-primaria, 0.1);
      }
    }
  }
  
  .error-message {
    padding: 0.8rem;
    margin-bottom: 1.5rem;
    border-radius: 8px;
    background-color: rgba($cor-primaria, 0.1);
    color: $cor-primaria;
    font-size: 0.9rem;
    text-align: center;
  }
  
  .login-button {
    width: 100%;
    padding: 0.8rem;
    background-color: $cor-primaria;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: $hover;
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

@media (max-width: 480px) {
  .login-card {
    margin: 0 1rem;
    border-radius: 12px;
  }
  
  .login-header {
    padding: 1.5rem 1rem;
    
    h1 {
      font-size: 1.5rem;
    }
  }
  
  .login-form {
    padding: 0 1.5rem 1.5rem;
  }
}
</style>
