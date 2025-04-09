<template>
  <div class="posts-manager">
    <div class="posts-header">
      <div class="container">
        <h1>Your Stories</h1>
        <router-link to="/dashboard/posts/new" class="new-story-button">
          Write a story
        </router-link>
      </div>
    </div>

    <div class="content-container">
      <div class="container">
        <div class="filters-bar">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search your stories..." 
              @input="handleSearch"
            >
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <div class="status-filter">
            <select v-model="statusFilter" @change="applyFilters">
              <option value="all">All Stories</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner">
            <span></span><span></span><span></span>
          </div>
          <p>Loading your stories...</p>
        </div>
        
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-else>
          <div v-if="filteredPosts.length > 0" class="posts-list">
            <article 
              v-for="post in filteredPosts" 
              :key="post.id" 
              class="post-item"
            >
              <div class="post-content">
                <div class="post-info">
                  <router-link 
                    :to="`/dashboard/posts/edit/${post.id}`" 
                    class="post-title"
                  >
                    {{ post.title || 'Untitled Story' }}
                  </router-link>
                  
                  <p v-if="post.summary" class="post-summary">{{ post.summary }}</p>
                  
                  <div class="post-meta">
                    <span 
                      class="post-status" 
                      :class="post.status"
                    >
                      {{ post.status }}
                    </span>
                    
                    <time 
                      class="post-date"
                      :title="formatFullDate(post.created_at)"
                    >
                      {{ formatDate(post.created_at) }}
                    </time>
                    
                    <time 
                      v-if="post.published_at" 
                      class="post-date"
                      :title="formatFullDate(post.published_at)"
                    >
                      Published {{ formatDate(post.published_at) }}
                    </time>
                  </div>
                </div>
                
                <div v-if="post.cover_image" class="post-thumbnail">
                  <img :src="post.cover_image" alt="Cover image">
                </div>
              </div>
              
              <div class="post-actions">
                <router-link 
                  :to="`/dashboard/posts/edit/${post.id}`" 
                  class="action-button edit-button"
                >
                  Edit
                </router-link>
                <button 
                  @click="confirmDelete(post)" 
                  class="action-button delete-button"
                >
                  Delete
                </button>
                
                <a 
                  v-if="post.status === 'published'" 
                  :href="`/blog/${post.slug || post.id}`" 
                  target="_blank" 
                  class="action-button view-button"
                >
                  View
                </a>
              </div>
            </article>
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-state-content">
              <svg class="empty-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 14H12M9 17H15M3 10V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V10M3 10V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V10M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h2>No stories found</h2>
              <p>
                {{ statusFilter !== 'all' ? 
                  `You don't have any ${statusFilter} stories yet.` : 
                  'Start writing your first story!' }}
              </p>
              <router-link to="/dashboard/posts/new" class="new-story-button">
                Write a story
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal-content">
        <h3>Delete Story</h3>
        <p>Are you sure you want to delete "<strong>{{ postToDelete?.title }}</strong>"?</p>
        <p class="warning-text">This action cannot be undone.</p>
        
        <div class="modal-actions">
          <button @click="cancelDelete" class="modal-button cancel-button">
            Cancel
          </button>
          <button @click="deletePost" class="modal-button delete-button">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { format, formatDistance } from 'date-fns';
import { supabase } from '../../lib/supabaseClient';

export default {
  name: 'PostsView',
  setup() {
    const router = useRouter();
    const posts = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const searchQuery = ref('');
    const statusFilter = ref('all');
    const showDeleteConfirm = ref(false);
    const postToDelete = ref(null);

    const fetchPosts = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        const { data, error: err } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (err) throw err;
        
        posts.value = data || [];
      } catch (err) {
        console.error('Error fetching posts:', err);
        error.value = 'Failed to load posts. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const filteredPosts = computed(() => {
      let result = [...posts.value];
      
      // Apply status filter
      if (statusFilter.value !== 'all') {
        result = result.filter(post => post.status === statusFilter.value);
      }
      
      // Apply search filter
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(post => 
          post.title.toLowerCase().includes(query) || 
          (post.summary && post.summary.toLowerCase().includes(query))
        );
      }
      
      return result;
    });

    const handleSearch = () => {
      // Debounce implementation could be added here
    };

    const applyFilters = () => {
      // Additional filter logic if needed
    };

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      try {
        return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
      } catch (e) {
        return dateString;
      }
    };

    const formatFullDate = (dateString) => {
      if (!dateString) return '';
      try {
        return format(new Date(dateString), 'MMMM d, yyyy h:mm a');
      } catch (e) {
        return dateString;
      }
    };

    const editPost = (post) => {
      router.push(`/dashboard/posts/edit/${post.id}`);
    };

    const confirmDelete = (post) => {
      postToDelete.value = post;
      showDeleteConfirm.value = true;
    };

    const cancelDelete = () => {
      showDeleteConfirm.value = false;
      postToDelete.value = null;
    };

    const deletePost = async () => {
      if (!postToDelete.value) return;
      
      try {
        loading.value = true;
        const { error: err } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', postToDelete.value.id);
        
        if (err) throw err;
        
        // Remove the post from the local array
        posts.value = posts.value.filter(p => p.id !== postToDelete.value.id);
        
        showDeleteConfirm.value = false;
        postToDelete.value = null;
      } catch (err) {
        console.error('Error deleting post:', err);
        error.value = 'Failed to delete post. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchPosts();
    });

    return {
      posts,
      loading,
      error,
      searchQuery,
      statusFilter,
      showDeleteConfirm,
      postToDelete,
      filteredPosts,
      handleSearch,
      applyFilters,
      formatDate,
      formatFullDate,
      editPost,
      confirmDelete,
      cancelDelete,
      deletePost
    };
  }
};
</script>

<style scoped>
.posts-manager {
  background-color: #fff;
  min-height: 100vh;
  color: rgba(0, 0, 0, 0.84);
  font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header */
.posts-header {
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.posts-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.posts-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.84);
  margin: 0;
}

.new-story-button {
  display: inline-block;
  background-color: #1a8917;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.new-story-button:hover {
  background-color: #0f6d14;
}

/* Content Container */
.content-container {
  padding: 2rem 0 4rem;
}

/* Filter Bar */
.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 2;
  min-width: 240px;
}

.status-filter {
  flex: 1;
  min-width: 160px;
}

.search-box input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  background-color: #fff;
}

.search-box input:focus {
  outline: none;
  border-color: rgba(0, 0, 0, 0.3);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

.status-filter select {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  background-color: #fff;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.status-filter select:focus {
  outline: none;
  border-color: rgba(0, 0, 0, 0.3);
}

/* Posts List */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 1.5rem;
}

.post-item:last-child {
  border-bottom: none;
}

.post-content {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.post-info {
  flex: 1;
  min-width: 0;
}

.post-title {
  display: block;
  font-family: Georgia, serif;
  font-size: 18px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.84);
  text-decoration: none;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.post-title:hover {
  color: rgba(0, 0, 0, 0.68);
}

.post-summary {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.54);
  margin: 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 13px;
}

.post-status {
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
}

.post-status.published {
  background-color: rgba(26, 137, 23, 0.1);
  color: #1a8917;
}

.post-status.draft {
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.6);
}

.post-status.archived {
  background-color: rgba(117, 117, 117, 0.1);
  color: #757575;
}

.post-date {
  color: rgba(0, 0, 0, 0.54);
}

.post-thumbnail {
  width: 120px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-actions {
  display: flex;
  gap: 0.75rem;
}

.action-button {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background-color: transparent;
  color: rgba(0, 0, 0, 0.6);
  text-decoration: none;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.8);
}

.action-button.edit-button {
  color: #1a8917;
  border-color: rgba(26, 137, 23, 0.4);
}

.action-button.edit-button:hover {
  background-color: rgba(26, 137, 23, 0.05);
  border-color: #1a8917;
}

.action-button.delete-button {
  color: #c62828;
  border-color: rgba(198, 40, 40, 0.4);
}

.action-button.delete-button:hover {
  background-color: rgba(198, 40, 40, 0.05);
  border-color: #c62828;
}

.action-button.view-button {
  color: rgba(0, 0, 0, 0.6);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  text-align: center;
  color: rgba(0, 0, 0, 0.54);
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.loading-spinner span {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  margin: 0 4px;
  animation: bounce .6s cubic-bezier(0.6, 0.1, 1, 0.4) infinite alternate;
}

.loading-spinner span:nth-child(1) {
  animation-delay: .1s;
}

.loading-spinner span:nth-child(2) {
  animation-delay: .2s;
}

.loading-spinner span:nth-child(3) {
  animation-delay: .3s;
}

@keyframes bounce {
  to {
    transform: translateY(8px);
    opacity: 0.3;
  }
}

/* Error Message */
.error-message {
  padding: 2rem;
  background-color: rgba(198, 40, 40, 0.05);
  color: #c62828;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 2rem;
}

/* Empty State */
.empty-state {
  padding: 4rem 0;
  text-align: center;
}

.empty-state-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  color: rgba(0, 0, 0, 0.2);
  width: 64px;
  height: 64px;
  margin-bottom: 1.5rem;
}

.empty-state h2 {
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.84);
  margin-bottom: 1rem;
}

.empty-state p {
  color: rgba(0, 0, 0, 0.54);
  margin-bottom: 2rem;
}

/* Delete Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 1rem;
}

.modal-content {
  background-color: #fff;
  border-radius: 4px;
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.84);
  margin-top: 0;
  margin-bottom: 1rem;
}

.modal-content p {
  color: rgba(0, 0, 0, 0.68);
  margin-bottom: 0.5rem;
}

.warning-text {
  color: #c62828;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-button.cancel-button {
  background-color: transparent;
  border: 1px solid rgba(0, 0, 0, 0.15);
  color: rgba(0, 0, 0, 0.6);
}

.modal-button.cancel-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.8);
}

.modal-button.delete-button {
  background-color: #c62828;
  color: #fff;
  border: none;
}

.modal-button.delete-button:hover {
  background-color: #b71c1c;
}

/* Responsive */
@media (max-width: 768px) {
  .post-content {
    flex-direction: column;
  }
  
  .post-thumbnail {
    width: 100%;
    height: 180px;
    order: -1;
    margin-bottom: 1rem;
  }
  
  .filters-bar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-box, .status-filter {
    width: 100%;
  }
  
  .post-actions {
    flex-wrap: wrap;
  }
  
  .action-button {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .posts-header .container {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-button {
    width: 100%;
    text-align: center;
  }
}
</style>
