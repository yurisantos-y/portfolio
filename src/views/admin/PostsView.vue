<template>
  <div class="posts-view">
    <div class="posts-header">
      <h1>Blog Posts</h1>
      <router-link to="/dashboard/posts/new" class="btn-create">
        <i class="icon-plus">+</i> New Post
      </router-link>
    </div>

    <div class="filters-bar">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search posts..." 
          @input="handleSearch"
        >
      </div>
      <div class="status-filter">
        <select v-model="statusFilter" @change="applyFilters">
          <option value="all">All Posts</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading">
        <span></span><span></span><span></span>
      </div>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="posts-table-container">
      <table class="posts-table" v-if="filteredPosts.length > 0">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Created</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in filteredPosts" :key="post.id">
            <td class="post-title">
              <div class="title-cell">
                <img 
                  v-if="post.cover_image" 
                  :src="post.cover_image" 
                  alt="Cover" 
                  class="thumbnail"
                >
                <div v-else class="no-image">No Image</div>
                <span>{{ post.title }}</span>
              </div>
            </td>
            <td>
              <span class="status-badge" :class="post.status">
                {{ post.status }}
              </span>
            </td>
            <td>{{ formatDate(post.created_at) }}</td>
            <td>{{ post.published_at ? formatDate(post.published_at) : '-' }}</td>
            <td class="actions">
              <button @click="editPost(post)" class="btn-edit">Edit</button>
              <button @click="confirmDelete(post)" class="btn-delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="no-posts">
        <p>No posts found. Create your first post!</p>
        <router-link to="/dashboard/posts/new" class="btn-create">
          Create Post
        </router-link>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="delete-modal">
      <div class="modal-content">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete "{{ postToDelete?.title }}"?</p>
        <p class="warning">This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn-cancel">Cancel</button>
          <button @click="deletePost" class="btn-confirm-delete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { formatDistance } from 'date-fns';
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
      editPost,
      confirmDelete,
      cancelDelete,
      deletePost
    };
  }
};
</script>

<style scoped>
.posts-view {
  padding: 24px;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  color: #334155;
}

.posts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.posts-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.btn-create {
  background-color: #3b82f6;
  color: white;
  padding: 10px 18px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.btn-create:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);
}

.btn-create:active {
  transform: translateY(0);
}

.icon-plus {
  font-size: 18px;
  font-weight: 600;
}

.filters-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-box, .status-filter {
  flex: 1;
  min-width: 200px;
}

.search-box input,
.status-filter select {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  transition: all 0.2s ease;
  background-color: #f8fafc;
  color: #334155;
}

.search-box input:focus,
.status-filter select:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background-color: white;
}

.search-box input::placeholder {
  color: #94a3b8;
}

.posts-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.posts-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.posts-table th,
.posts-table td {
  padding: 16px;
  text-align: left;
}

.posts-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #64748b;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
}

.posts-table tr {
  transition: background-color 0.2s ease;
}

.posts-table tr:hover {
  background-color: #f8fafc;
}

.posts-table td {
  border-bottom: 1px solid #e2e8f0;
  color: #475569;
}

.posts-table tr:last-child td {
  border-bottom: none;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.thumbnail {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.no-image {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  border-radius: 6px;
  font-size: 10px;
  color: #94a3b8;
}

.post-title span {
  font-weight: 500;
  color: #334155;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
  letter-spacing: 0.02em;
}

.status-badge.published {
  background-color: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.status-badge.draft {
  background-color: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.status-badge.archived {
  background-color: rgba(107, 114, 128, 0.1);
  color: #4b5563;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.btn-edit:hover {
  background-color: rgba(59, 130, 246, 0.2);
}

.btn-delete {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.btn-delete:hover {
  background-color: rgba(239, 68, 68, 0.2);
}

.no-posts {
  padding: 60px 20px;
  text-align: center;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.no-posts p {
  font-size: 16px;
  margin-bottom: 8px;
}

.no-posts .btn-create {
  margin-top: 8px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 240px;
}

.loading span {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3b82f6;
  margin: 0 6px;
  animation: bounce 0.6s cubic-bezier(0.6, 0.1, 1, 0.4) infinite alternate;
  opacity: 0.7;
}

.loading span:nth-child(1) {
  animation-delay: 0.1s;
}

.loading span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  to {
    transform: translateY(12px);
    opacity: 0.3;
  }
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(185, 28, 28, 0.1);
}

.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  padding: 28px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-content h3 {
  margin-top: 0;
  color: #0f172a;
  font-size: 20px;
  font-weight: 600;
}

.modal-content p {
  margin: 16px 0;
  color: #475569;
}

.modal-content .warning {
  color: #ef4444;
  font-size: 14px;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
}

.btn-cancel,
.btn-confirm-delete {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background-color: #f1f5f9;
  color: #475569;
}

.btn-cancel:hover {
  background-color: #e2e8f0;
}

.btn-confirm-delete {
  background-color: #ef4444;
  color: white;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

.btn-confirm-delete:hover {
  background-color: #dc2626;
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.25);
}

@media (max-width: 768px) {
  .posts-view {
    padding: 16px;
  }

  .posts-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .posts-header h1 {
    font-size: 24px;
  }
  
  .btn-create {
    width: 100%;
    justify-content: center;
  }
  
  .filters-bar {
    flex-direction: column;
    width: 100%;
    gap: 12px;
  }
  
  .search-box, .status-filter {
    width: 100%;
  }
  
  .posts-table th:nth-child(3),
  .posts-table td:nth-child(3),
  .posts-table th:nth-child(4),
  .posts-table td:nth-child(4) {
    display: none;
  }
  
  .title-cell {
    flex-direction: row;
    align-items: center;
  }

  .thumbnail, .no-image {
    width: 40px;
    height: 40px;
  }
  
  .actions {
    flex-direction: column;
    gap: 6px;
  }
  
  .btn-edit, .btn-delete {
    width: 100%;
    text-align: center;
  }
  
  .modal-content {
    padding: 20px;
    width: 95%;
  }
}
</style>
