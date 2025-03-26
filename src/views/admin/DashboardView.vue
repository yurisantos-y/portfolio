<template>
  <div class="dashboard-container">
    <!-- Sidebar Navigation -->
    <aside class="sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <img src="../../assets/logo.png" alt="Logo" class="sidebar-logo" />
        <button @click="toggleSidebar" class="toggle-btn">
          <span class="toggle-icon"></span>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link" active-class="active">
              <i class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </i>
              <span class="nav-text" v-show="!isSidebarCollapsed">Dashboard</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/dashboard/posts" class="nav-link" active-class="active">
              <i class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </i>
              <span class="nav-text" v-show="!isSidebarCollapsed">Posts</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/dashboard/projects" class="nav-link" active-class="active">
              <i class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M22 11v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h10v2H4v11h16v-6h2zm-2-9v5h-5V2h5z"/>
                </svg>
              </i>
              <span class="nav-text" v-show="!isSidebarCollapsed">Projects</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/dashboard/analytics" class="nav-link" active-class="active">
              <i class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </i>
              <span class="nav-text" v-show="!isSidebarCollapsed">Analytics</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/dashboard/settings" class="nav-link" active-class="active">
              <i class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
              </i>
              <span class="nav-text" v-show="!isSidebarCollapsed">Settings</span>
            </router-link>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-profile" v-show="!isSidebarCollapsed">
          <img src="https://ui-avatars.com/api/?name=Admin+User" alt="User Avatar" class="user-avatar" />
          <div class="user-info">
            <span class="user-name">Admin User</span>
            <span class="user-role">Administrator</span>
          </div>
        </div>
        <button class="logout-btn" @click="logout">
          <i class="logout-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </i>
          <span class="logout-text" v-show="!isSidebarCollapsed">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <header class="content-header">
        <h1 class="page-title">Dashboard</h1>
        <div class="header-actions">
          <button class="notification-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </button>
        </div>
      </header>
      
      <div class="content-body">
        <div class="welcome-card">
          <h2>Welcome to your dashboard</h2>
          <p>This is a modern, minimalist dashboard with a left navigation menu.</p>
        </div>
        
        <!-- Dashboard content would go here -->
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const logout = () => {
  // Implement logout functionality here
  console.log('Logout clicked');
};
</script>

<style lang="scss">
@import '../../scss/style.scss';

.dashboard-container {
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
}

/* Sidebar Styles */
.sidebar {
  width: 240px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow-x: hidden;
  
  &.collapsed {
    width: 70px;
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-logo {
  height: 36px;
  width: auto;
}

.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:focus {
    outline: none;
  }
}

.toggle-icon {
  position: relative;
  width: 18px;
  height: 2px;
  background-color: #555;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 2px;
    background-color: #555;
    transition: transform 0.3s ease;
  }
  
  &::before {
    transform: translateY(-6px);
  }
  
  &::after {
    transform: translateY(6px);
  }
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0.25rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #666;
  text-decoration: none;
  border-radius: 4px;
  margin: 0 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
    color: $cor-primaria;
  }
  
  &.active {
    background-color: rgba(237, 76, 92, 0.1);
    color: $cor-primaria;
  }
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
}

.nav-text {
  font-size: 0.9rem;
  white-space: nowrap;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #f0f0f0;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

.user-role {
  font-size: 0.75rem;
  color: #999;
}

.logout-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background-color: #eee;
  }
}

.logout-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  color: #666;
}

.logout-text {
  font-size: 0.9rem;
  color: #666;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.notification-btn {
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: background 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:focus {
    outline: none;
  }
}

.welcome-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin-top: 0;
    font-size: 1.25rem;
    color: #333;
  }
  
  p {
    color: #666;
    margin-bottom: 0;
    line-height: 1.5;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 100;
    height: 100vh;
    transform: translateX(0);
    
    &.collapsed {
      transform: translateX(-100%);
      width: 240px;
    }
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .nav-text {
    display: block !important;
  }
  
  .toggle-btn {
    position: absolute;
    right: -40px;
    top: 10px;
    background-color: #fff;
    border-radius: 0 4px 4px 0;
    padding: 0.5rem;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
}
</style>
