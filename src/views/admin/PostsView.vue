<template>
  <div class="posts-manager">
    <div class="posts-header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <button @click="goBack" class="back-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div class="title-section">
              <h1>Stories</h1>
              <p class="subtitle">{{ posts.length }} {{ posts.length === 1 ? 'story' : 'stories' }}</p>
            </div>
          </div>
          <router-link to="/dashboard/posts/new" class="new-story-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New Story
          </router-link>
        </div>
      </div>
    </div>

    <div class="content-container">
      <div class="container">
        <div class="filters-section">
          <div class="search-container">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search stories..." 
              @input="handleSearch"
              class="search-input"
            >
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          
          <div class="status-tabs">
            <button 
              v-for="status in statusOptions" 
              :key="status.value"
              @click="statusFilter = status.value"
              :class="['status-tab', { active: statusFilter === status.value }]"
            >
              {{ status.label }}
            </button>
          </div>
        </div>
        <div v-if="loading" class="loading-container">
          <div class="loading-animation">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        </div>
        
        <div v-else-if="error" class="error-container">
          <div class="error-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>{{ error }}</p>
          </div>
        </div>
        
        <div v-else class="stories-content">
          <div v-if="filteredPosts.length > 0" class="stories-grid">
            <article 
              v-for="post in filteredPosts" 
              :key="post.id" 
              class="story-card"
            >
              <div class="story-main">
                <div class="story-header">
                  <router-link 
                    :to="`/dashboard/posts/edit/${post.id}`" 
                    class="story-title"
                  >
                    {{ post.title || 'Untitled' }}
                  </router-link>
                  
                  <div class="story-status" :class="post.status">
                    {{ getStatusLabel(post.status) }}
                  </div>
                </div>
                
                <p v-if="post.summary" class="story-excerpt">
                  {{ post.summary }}
                </p>
                
                <div class="story-meta">
                  <time class="story-date">
                    {{ formatDate(post.created_at) }}
                  </time>
                  <time v-if="post.published_at && post.status === 'published'" class="published-date">
                    Published {{ formatDate(post.published_at) }}
                  </time>
                </div>
              </div>
              
              <div v-if="post.cover_image" class="story-image">
                <img :src="post.cover_image" :alt="post.title || 'Story cover'">
              </div>
              
              <div class="story-actions">
                <router-link 
                  :to="`/dashboard/posts/edit/${post.id}`" 
                  class="action-btn edit-btn"
                >
                  Edit
                </router-link>
                
                <a 
                  v-if="post.status === 'published'" 
                  :href="`/blog/${post.slug || post.id}`" 
                  target="_blank" 
                  class="action-btn view-btn"
                >
                  View
                </a>
                
                <button 
                  @click="confirmDelete(post)" 
                  class="action-btn delete-btn"
                >
                  Delete
                </button>
              </div>
            </article>
          </div>
          
          <div v-else class="empty-container">
            <div class="empty-content">
              <div class="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <h3>{{ getEmptyStateTitle() }}</h3>
              <p>{{ getEmptyStateMessage() }}</p>
              <router-link to="/dashboard/posts/new" class="new-story-button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Write Your First Story
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-backdrop" @click.self="cancelDelete">
      <div class="modal">
        <div class="modal-header">
          <h3>Delete Story</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete "<strong>{{ postToDelete?.title }}</strong>"?</p>
          <p class="warning">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button @click="cancelDelete" class="btn-cancel">
            Cancel
          </button>
          <button @click="deletePost" class="btn-delete">
            Delete Story
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
import supabaseClient from '../../utils/supabaseClient';

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

    const statusOptions = ref([
      { label: 'All', value: 'all' },
      { label: 'Published', value: 'published' },
      { label: 'Drafts', value: 'draft' },
      { label: 'Archived', value: 'archived' }
    ]);

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
        error.value = 'Failed to load stories. Please try again.';
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

    const goBack = () => {
      // Check if there's previous history
      if (window.history.length > 1) {
        router.go(-1);
      } else {
        // Fallback to dashboard if no history
        router.push('/dashboard');
      }
    };

    const handleSearch = () => {
      // Debounce implementation could be added here
    };

    const getStatusLabel = (status) => {
      const labels = {
        published: 'Published',
        draft: 'Draft',
        archived: 'Archived'
      };
      return labels[status] || status;
    };

    const getEmptyStateTitle = () => {
      if (statusFilter.value === 'all') return 'No stories yet';
      return `No ${statusFilter.value} stories`;
    };

    const getEmptyStateMessage = () => {
      if (statusFilter.value === 'all') return 'Start writing your first story to get started.';
      return `You don't have any ${statusFilter.value} stories yet.`;
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
      statusOptions,
      showDeleteConfirm,
      postToDelete,
      filteredPosts,
      goBack,
      handleSearch,
      getStatusLabel,
      getEmptyStateTitle,
      getEmptyStateMessage,
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
/* Reset and Base Styles */
* {
  box-sizing: border-box;
}

.posts-manager {
  background: #fafafa;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
  color: #1a1a1a;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Header Styles */
.posts-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 32px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
  color: #475569;
  transform: translateX(-2px);
}

.back-button svg {
  width: 20px;
  height: 20px;
}

.title-section h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  letter-spacing: -0.025em;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.new-story-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1a1a1a;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.new-story-button:hover {
  background: #2d2d2d;
  transform: translateY(-1px);
}

.new-story-button svg {
  width: 18px;
  height: 18px;
}

/* Content Container */
.content-container {
  padding: 48px 0;
}

/* Filters Section */
.filters-section {
  margin-bottom: 48px;
}

.search-container {
  position: relative;
  max-width: 480px;
  margin-bottom: 32px;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 52px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  color: #1a1a1a;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #1a1a1a;
  box-shadow: 0 0 0 4px rgba(26, 26, 26, 0.1);
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.status-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.status-tab {
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-tab:hover {
  background: #f3f4f6;
  color: #374151;
}

.status-tab.active {
  background: #1a1a1a;
  color: white;
}

/* Loading State */
.loading-container {
  display: flex;
  justify-content: center;
  padding: 120px 0;
}

.loading-animation {
  display: flex;
  gap: 8px;
}

.loading-dot {
  width: 8px;
  height: 8px;
  background: #1a1a1a;
  border-radius: 50%;
  animation: loading-bounce 1.4s ease-in-out infinite both;
}

.loading-dot:nth-child(1) { animation-delay: -0.32s; }
.loading-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes loading-bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1.0);
  }
}

/* Error State */
.error-container {
  display: flex;
  justify-content: center;
  padding: 120px 0;
}

.error-content {
  text-align: center;
  color: #dc2626;
}

.error-content svg {
  margin-bottom: 16px;
}

.error-content p {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

/* Stories Grid */
.stories-grid {
  display: grid;
  gap: 24px;
}

.story-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s ease;
}

.story-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.story-main {
  padding: 32px;
}

.story-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.story-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: none;
  line-height: 1.3;
  letter-spacing: -0.025em;
  flex: 1;
  transition: color 0.2s ease;
}

.story-title:hover {
  color: #4b5563;
}

.story-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  flex-shrink: 0;
}

.story-status.published {
  background: #dcfce7;
  color: #166534;
}

.story-status.draft {
  background: #f3f4f6;
  color: #6b7280;
}

.story-status.archived {
  background: #fef3c7;
  color: #92400e;
}

.story-excerpt {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.story-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.story-date,
.published-date {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
}

.story-image {
  height: 200px;
  overflow: hidden;
  border-top: 1px solid #e5e7eb;
}

.story-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.story-card:hover .story-image img {
  transform: scale(1.05);
}

.story-actions {
  display: flex;
  gap: 8px;
  padding: 20px 32px;
  border-top: 1px solid #f3f4f6;
  background: #fafafa;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
}

.edit-btn {
  background: #1a1a1a;
  color: white;
}

.edit-btn:hover {
  background: #2d2d2d;
  transform: translateY(-1px);
}

.view-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.view-btn:hover {
  background: #e5e7eb;
  color: #374151;
  transform: translateY(-1px);
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fee2e2;
  transform: translateY(-1px);
}

/* Empty State */
.empty-container {
  display: flex;
  justify-content: center;
  padding: 120px 0;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  margin-bottom: 24px;
  color: #d1d5db;
}

.empty-content h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.empty-content p {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 32px 0;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
}

.modal {
  background: white;
  border-radius: 16px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 32px 32px 0;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.modal-body {
  padding: 16px 32px 32px;
}

.modal-body p {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.warning {
  color: #dc2626 !important;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 0 32px 32px;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 12px 24px;
  border: 2px solid #e5e7eb;
  background: transparent;
  color: #6b7280;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  border-color: #d1d5db;
  color: #374151;
}

.btn-delete {
  padding: 12px 24px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
  
  .header-left {
    justify-content: flex-start;
    gap: 12px;
  }
  
  .title-section h1 {
    font-size: 28px;
  }
  
  .content-container {
    padding: 32px 0;
  }
  
  .filters-section {
    margin-bottom: 32px;
  }
  
  .story-main {
    padding: 24px;
  }
  
  .story-actions {
    padding: 16px 24px;
    flex-wrap: wrap;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
    min-width: 0;
  }
  
  .modal {
    margin: 16px;
  }
  
  .modal-header,
  .modal-body {
    padding-left: 24px;
    padding-right: 24px;
  }
  
  .modal-footer {
    padding: 0 24px 24px;
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-delete {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .status-tabs {
    justify-content: center;
  }
  
  .story-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .story-status {
    align-self: flex-start;
  }
}
</style>
