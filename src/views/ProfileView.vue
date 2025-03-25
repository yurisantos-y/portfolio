<template>
  <div class="profile">
    <h1>User Profile</h1>
    <div v-if="loading" class="loading">Loading profile data...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="profile-content">
      <div class="profile-section">
        <h2>Personal Information</h2>
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" v-model="profile.name" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="profile.email" disabled />
          </div>
          <div class="form-group">
            <label for="bio">Bio</label>
            <textarea id="bio" v-model="profile.bio" rows="4"></textarea>
          </div>
          <button type="submit" :disabled="updating">Save Changes</button>
          <p v-if="updateMessage" class="update-message">{{ updateMessage }}</p>
        </form>
      </div>
      
      <div class="profile-section">
        <h2>Account Settings</h2>
        <button @click="showPasswordForm = !showPasswordForm">
          {{ showPasswordForm ? 'Cancel' : 'Change Password' }}
        </button>
        
        <form v-if="showPasswordForm" @submit.prevent="changePassword" class="password-form">
          <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" v-model="passwordData.current" required />
          </div>
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input type="password" id="newPassword" v-model="passwordData.new" required />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <input type="password" id="confirmPassword" v-model="passwordData.confirm" required />
          </div>
          <button type="submit" :disabled="passwordUpdating">Update Password</button>
          <p v-if="passwordError" class="error">{{ passwordError }}</p>
          <p v-if="passwordSuccess" class="success">{{ passwordSuccess }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useSupabaseAuth } from '../composables/useSupabaseAuth';

const { getCurrentUser, updateUserProfile, updatePassword } = useSupabaseAuth();

const loading = ref(true);
const error = ref('');
const profile = reactive({
  name: '',
  email: '',
  bio: ''
});

const updating = ref(false);
const updateMessage = ref('');
const showPasswordForm = ref(false);
const passwordData = reactive({
  current: '',
  new: '',
  confirm: ''
});
const passwordUpdating = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');

onMounted(async () => {
  try {
    const { user, error: userError } = await getCurrentUser();
    
    if (userError) {
      error.value = userError.message;
      return;
    }
    
    if (user) {
      profile.email = user.email;
      profile.name = user.user_metadata?.name || '';
      profile.bio = user.user_metadata?.bio || '';
    }
  } catch (err) {
    error.value = 'Failed to load profile data';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const updateProfile = async () => {
  updating.value = true;
  updateMessage.value = '';
  
  try {
    const { error: updateError } = await updateUserProfile({
      name: profile.name,
      bio: profile.bio
    });
    
    if (updateError) {
      updateMessage.value = `Error: ${updateError.message}`;
    } else {
      updateMessage.value = 'Profile updated successfully!';
    }
  } catch (err) {
    updateMessage.value = 'An error occurred while updating profile';
    console.error(err);
  } finally {
    updating.value = false;
  }
};

const changePassword = async () => {
  passwordUpdating.value = true;
  passwordError.value = '';
  passwordSuccess.value = '';
  
  if (passwordData.new !== passwordData.confirm) {
    passwordError.value = 'New passwords do not match';
    passwordUpdating.value = false;
    return;
  }
  
  try {
    const { error: passwordError } = await updatePassword(passwordData.current, passwordData.new);
    
    if (passwordError) {
      passwordError.value = passwordError.message;
    } else {
      passwordSuccess.value = 'Password updated successfully';
      passwordData.current = '';
      passwordData.new = '';
      passwordData.confirm = '';
      showPasswordForm.value = false;
    }
  } catch (err) {
    passwordError.value = 'Failed to update password';
    console.error(err);
  } finally {
    passwordUpdating.value = false;
  }
};
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}

.loading {
  text-align: center;
  padding: 20px;
}

.password-form {
  margin-top: 15px;
}

.update-message {
  margin-top: 10px;
  font-weight: bold;
}
</style>
