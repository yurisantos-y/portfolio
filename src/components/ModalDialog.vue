<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-button" @click="$emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalDialog',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  emits: ['close']
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  backdrop-filter: blur(3px);
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  padding: 4px;
  margin-left: 8px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.close-button:hover {
  color: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.modal-body {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile optimizations */
@media screen and (max-width: 600px) {
  .modal-overlay {
    padding: 15px;
  }
  
  .modal-content {
    max-height: 95vh;
    border-radius: 6px;
  }
  
  .modal-header {
    padding: 12px;
  }
  
  .modal-header h3 {
    font-size: 16px;
  }
  
  .modal-body {
    padding: 12px;
  }
  
  .close-button {
    padding: 8px;
  }
  
  .close-button svg {
    width: 20px;
    height: 20px;
  }
}

/* Very small screens */
@media screen and (max-width: 375px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-content {
    max-height: 98vh;
  }
  
  .modal-header {
    padding: 10px;
  }
  
  .modal-header h3 {
    font-size: 15px;
  }
  
  .modal-body {
    padding: 10px;
  }
}
</style>