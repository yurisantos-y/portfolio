<template>
  <div class="unauthorized">
    <div class="unauthorized-container">
      <h1>Access Denied</h1>
      <div class="icon">
        <i class="fas fa-lock"></i>
      </div>
      <p>You don't have permission to access this page.</p>
      <p>Please contact the administrator if you believe this is an error.</p>
      <div class="actions">
        <router-link to="/" class="btn">Go to Homepage</router-link>
        <router-link to="/dashboard" class="btn">Go to Dashboard</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No additional script logic required
</script>

<style scoped>
.unauthorized {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  text-align: center;
}

.unauthorized-container {
  max-width: 600px;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h1 {
  color: #e74c3c;
  margin-bottom: 20px;
}

.icon {
  font-size: 60px;
  color: #e74c3c;
  margin: 20px 0;
}

p {
  margin-bottom: 15px;
  color: #555;
  font-size: 18px;
}

.actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #2980b9;
}
</style>
