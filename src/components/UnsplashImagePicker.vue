<template>
  <div class="unsplash-picker">
    <div class="search-header">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search Unsplash for images..." 
        @keyup.enter="searchImages"
        class="search-input"
      />
      <button class="search-button" @click="searchImages">Search</button>
    </div>
    
    <div class="loading-state" v-if="isLoading">
      <div class="spinner"></div>
      <p>Searching for images...</p>
    </div>
    
    <div class="error-message" v-if="error">{{ error }}</div>
    
    <div class="image-grid" v-if="images.length > 0">
      <div 
        v-for="image in images" 
        :key="image.id" 
        class="image-item"
        @click="selectImage(image)"
      >
        <img :src="image.urls.small" :alt="image.alt_description" />
      </div>
    </div>
    
    <div class="empty-state" v-else-if="!isLoading">
      <p v-if="hasSearched">No images found. Try a different search term.</p>
      <p v-else>Search for images on Unsplash</p>
    </div>
    
    <div class="attribution">
      <p>Photos provided by <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a></p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'UnsplashImagePicker',
  props: {
    onSelect: {
      type: Function,
      required: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const searchQuery = ref('');
    const images = ref([]);
    const isLoading = ref(false);
    const error = ref('');
    const hasSearched = ref(false);
    
    // Use the hardcoded value directly since env vars aren't loading properly
    const UNSPLASH_ACCESS_KEY = 'j17MGNXU_jH0lAO7SGKL8fAJGxR9tIfEajAYEykemsg';
    
    // Debug log to verify the API key
    console.log('Unsplash Access Key:', UNSPLASH_ACCESS_KEY);
    
    const searchImages = async () => {
      if (!searchQuery.value.trim()) return;
      
      isLoading.value = true;
      error.value = '';
      
      try {
        console.log(`Attempting to fetch images with query: ${searchQuery.value}`);
        const requestUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery.value)}&per_page=20`;
        console.log('Request URL:', requestUrl);
        
        const response = await fetch(
          requestUrl,
          {
            headers: {
              'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
          }
        );
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.status}`);
        }
        
        const data = await response.json();
        images.value = data.results;
        hasSearched.value = true;
      } catch (err) {
        console.error('Error searching Unsplash:', err);
        error.value = 'Failed to search images. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };
    
    const selectImage = (image) => {
      // Trigger download event for Unsplash API attribution requirements
      fetch(`https://api.unsplash.com/photos/${image.id}/download`, {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });
      
      props.onSelect({
        url: image.urls.regular,
        alt: image.alt_description || 'Unsplash image',
        attribution: {
          name: image.user.name,
          username: image.user.username,
          link: image.links.html
        }
      });
      
      emit('close');
    };
    
    return {
      searchQuery,
      images,
      isLoading,
      error,
      hasSearched,
      searchImages,
      selectImage
    };
  }
}
</script>

<style scoped>
.unsplash-picker {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  gap: 8px;
}

.search-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-button {
  padding: 10px 16px;
  background: #1a8917;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.search-button:hover {
  background: #0f6d14;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  padding: 16px;
  overflow-y: auto;
  max-height: 60vh;
}

.image-item {
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.image-item:hover {
  transform: scale(1.03);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #1a8917;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  color: #c62828;
  padding: 16px;
  text-align: center;
}

.attribution {
  padding: 12px 16px;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #666;
  text-align: center;
}
</style>