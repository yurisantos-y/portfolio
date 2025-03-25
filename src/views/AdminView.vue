<template>
  <div class="admin-panel">
    <h1>Admin Dashboard</h1>
    
    <div v-if="loading" class="loading">
      Loading admin data...
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else class="admin-content">
      <div class="admin-stats">
        <div class="stat-card">
          <h3>Total Users</h3>
          <div class="stat-value">{{ stats.totalUsers || 0 }}</div>
        </div>
        <div class="stat-card">
          <h3>Blog Posts</h3>
          <div class="stat-value">{{ stats.blogPosts || 0 }}</div>
        </div>
        <div class="stat-card">
          <h3>Projects</h3>
          <div class="stat-value">{{ stats.projects || 0 }}</div>
        </div>
      </div>
      
      <div class="admin-section">
        <h2>Recent Activity</h2>
        <table class="activity-table" v-if="recentActivity.length > 0">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(activity, index) in recentActivity" :key="index">
              <td>{{ activity.user }}</td>
              <td>{{ activity.action }}</td>
              <td>{{ formatDate(activity.date) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>No recent activity to display</p>
      </div>
      
      <div class="admin-section">
        <h2>User Management</h2>
        <button @click="toggleUserForm" class="btn primary">
          {{ showUserForm ? 'Cancel' : 'Add New User' }}
        </button>
        
        <form v-if="showUserForm" @submit.prevent="addUser" class="admin-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="newUser.email" required />
          </div>
          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" v-model="newUser.role" required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" class="btn primary" :disabled="isSubmitting">
            Add User
          </button>
        </form>
        
        <table class="users-table" v-if="users.length > 0">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="index">
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button @click="deleteUser(user.id)" class="btn danger small">
                  Delete
                </button>
                <button @click="editUser(user)" class="btn secondary small">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No users to display</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useSupabaseAuth } from '../composables/useSupabaseAuth';

// Mock data for demonstration
const stats = reactive({
  totalUsers: 23,
  blogPosts: 8,
  projects: 12
});

const recentActivity = ref([
  { user: 'admin@example.com', action: 'Created new blog post', date: new Date(2023, 9, 15) },
  { user: 'user@example.com', action: 'Updated profile', date: new Date(2023, 9, 14) },
  { user: 'admin@example.com', action: 'Added new project', date: new Date(2023, 9, 12) }
]);

const users = ref([
  { id: 1, email: 'admin@example.com', role: 'admin' },
  { id: 2, email: 'user1@example.com', role: 'user' },
  { id: 3, email: 'user2@example.com', role: 'user' }
]);

const loading = ref(true);
const error = ref('');
const showUserForm = ref(false);
const isSubmitting = ref(false);
const newUser = reactive({
  email: '',
  role: 'user'
});

const { getCurrentUser } = useSupabaseAuth();

onMounted(async () => {
  try {
    // Check if current user is admin
    const { user, error: authError } = await getCurrentUser();
    
    if (authError) {
      error.value = 'Authentication error: ' + authError.message;
      return;
    }
    
    if (!user || user.role !== 'admin') {
      error.value = 'You do not have admin privileges';
      return;
    }
    
    // Load admin data (in a real app, you would fetch this from your backend)
    // For now, we're using the mock data defined above
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
  } catch (err) {
    error.value = 'Failed to load admin data: ' + (err.message || err);
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const toggleUserForm = () => {
  showUserForm.value = !showUserForm.value;
  if (!showUserForm.value) {
    newUser.email = '';
    newUser.role = 'user';
  }
};

const addUser = async () => {
  isSubmitting.value = true;
  
  try {
    // In a real app, you would call your API to add a user
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newId = Math.max(...users.value.map(u => u.id)) + 1;
    users.value.push({
      id: newId,
      email: newUser.email,
      role: newUser.role
    });
    
    newUser.email = '';
    newUser.role = 'user';
    showUserForm.value = false;
    
  } catch (err) {
    error.value = 'Failed to add user: ' + (err.message || err);
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

const deleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) {
    return;
  }
  
  try {
    // In a real app, you would call your API to delete a user
    await new Promise(resolve => setTimeout(resolve, 400));
    users.value = users.value.filter(user => user.id !== userId);
  } catch (err) {
    error.value = 'Failed to delete user: ' + (err.message || err);
    console.error(err);
  }
};

const editUser = (user) => {
  // In a real app, you would implement editing functionality
  alert(`Edit user functionality for: ${user.email}`);
};
</script>

<style scoped>
.admin-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: #3498db;
  margin-top: 10px;
}

.admin-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
}

.admin-form {
  margin: 20px 0;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
}

.btn.small {
  padding: 5px 10px;
  font-size: 14px;
}

.btn.primary {
  background-color: #3498db;
  color: white;
}

.btn.secondary {
  background-color: #2ecc71;
  color: white;
}

.btn.danger {
  background-color: #e74c3c;
  color: white;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.activity-table, .users-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.activity-table th, .users-table th,
.activity-table td, .users-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.activity-table th, .users-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.error-message {
  padding: 15px;
  background-color: #ffdddd;
  border-left: 5px solid #e74c3c;
  margin-bottom: 20px;
  color: #c0392b;
}
</style>
