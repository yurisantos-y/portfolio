<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="dashboard-title">
        <img src="../assets/logo.png" alt="Logo" class="dashboard-logo">
        <h1>{{ $t('dashboard.title') || 'Dashboard' }}</h1>
      </div>
      
      <button @click="handleLogout" class="logout-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span>{{ $t('dashboard.logout') || 'Logout' }}</span>
      </button>
    </div>
    
    <div class="dashboard-content">
      <div class="welcome-card">
        <h2>{{ $t('dashboard.welcome') || 'Welcome' }}, {{ userDisplayName }}!</h2>
        <p>{{ $t('dashboard.welcomeText') || 'This is your personal dashboard area where you can manage your portfolio settings.' }}</p>
      </div>
      
      <div class="dashboard-grid">
        <div class="dashboard-card">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            {{ $t('dashboard.projects') || 'Projects' }}
          </h3>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-value">8</span>
              <span class="stat-label">{{ $t('dashboard.totalProjects') || 'Total' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">3</span>
              <span class="stat-label">{{ $t('dashboard.activeProjects') || 'Active' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">2</span>
              <span class="stat-label">{{ $t('dashboard.pendingProjects') || 'Pending' }}</span>
            </div>
          </div>
        </div>
        
        <div class="dashboard-card">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {{ $t('dashboard.messages') || 'Messages' }}
          </h3>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-value">12</span>
              <span class="stat-label">{{ $t('dashboard.totalMessages') || 'Total' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">5</span>
              <span class="stat-label">{{ $t('dashboard.unread') || 'Unread' }}</span>
            </div>
          </div>
        </div>
        
        <div class="dashboard-card activity-card">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            {{ $t('dashboard.recentActivity') || 'Recent Activity' }}
          </h3>
          <ul class="activity-list">
            <li class="activity-item">
              <div class="activity-dot"></div>
              <div class="activity-content">
                <span class="activity-title">{{ $t('dashboard.loginActivity') || 'Logged in' }}</span>
                <span class="activity-time">{{ getCurrentDate() }}</span>
              </div>
            </li>
            <li class="activity-item">
              <div class="activity-dot"></div>
              <div class="activity-content">
                <span class="activity-title">{{ $t('dashboard.projectUpdated') || 'Project updated' }}</span>
                <span class="activity-time">{{ getPreviousDate(1) }}</span>
              </div>
            </li>
            <li class="activity-item">
              <div class="activity-dot"></div>
              <div class="activity-content">
                <span class="activity-title">{{ $t('dashboard.messageReceived') || 'New message received' }}</span>
                <span class="activity-time">{{ getPreviousDate(2) }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseAuth } from '../../composables/useSupabaseAuth'

const router = useRouter()
const { user, logout } = useSupabaseAuth()

// Format user display name from email
const userDisplayName = computed(() => {
  if (!user.value) return 'User'
  return user.value.email?.split('@')[0] || 'User'
})

// Handle logout
async function handleLogout() {
  const { error } = await logout()
  if (!error) {
    router.push('/')
  }
}

// Helper functions for dates
function getCurrentDate() {
  return new Date().toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getPreviousDate(daysAgo) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style lang="scss">
@import '@/scss/style.scss';

.dashboard {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: $cor-dark;
  color: $cor-light;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  .dashboard-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    .dashboard-logo {
      width: 40px;
      height: auto;
    }
    
    h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }
  }
  
  .logout-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: transparent;
    color: $cor-light;
    border: 1px solid $cor-light;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: $cor-light;
      color: $cor-dark;
    }
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-card {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  
  h2 {
    margin: 0 0 1rem;
    font-size: 1.8rem;
    color: $cor-textDark;
  }
  
  p {
    margin: 0;
    color: $text-gray;
    font-size: 1.1rem;
    line-height: 1.6;
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.dashboard-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  
  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 1.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: $cor-textDark;
    
    svg {
      color: $cor-primaria;
    }
  }
}

.stats-row {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: $cor-primaria;
  }
  
  .stat-label {
    font-size: 0.8rem;
    color: $text-gray;
    margin-top: 0.3rem;
  }
}

.activity-card {
  grid-column: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 0.8rem 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .activity-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: $cor-primaria;
    margin-right: 1rem;
    margin-top: 0.4rem;
  }
  
  .activity-content {
    display: flex;
    flex-direction: column;
    
    .activity-title {
      font-size: 0.95rem;
      color: $cor-textDark;
    }
    
    .activity-time {
      font-size: 0.8rem;
      color: $text-gray;
      margin-top: 0.2rem;
    }
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    
    .dashboard-title {
      width: 100%;
      justify-content: space-between;
    }
    
    .logout-btn {
      align-self: flex-end;
    }
  }
  
  .dashboard-content {
    padding: 1rem;
  }
  
  .welcome-card {
    padding: 1.5rem;
    
    h2 {
      font-size: 1.5rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
