<template>
  <div class="projects-manager">
    <div class="projects-header">
      <div class="container">
        <h1>Your Projects</h1>
        <router-link to="/dashboard/projects/new" class="new-project-button">
          Add New Project
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
              placeholder="Search your projects..." 
              @input="handleSearch"
            >
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner">
            <span></span><span></span><span></span>
          </div>
          <p>Loading your projects...</p>
        </div>
        
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-else>
          <div v-if="filteredProjects.length > 0" class="projects-list">
            <article 
              v-for="project in filteredProjects" 
              :key="project.id" 
              class="project-item"
            >
              <div class="project-content">
                <div class="project-info">
                  <router-link 
                    :to="`/dashboard/projects/edit/${project.id}`" 
                    class="project-title"
                  >
                    {{ project.title || 'Untitled Project' }}
                  </router-link>
                  
                  <p v-if="project.description" class="project-summary">
                    {{ project.description.length > 120 ? project.description.substring(0, 120) + '...' : project.description }}
                  </p>
                  
                  <div class="project-meta">
                    <time 
                      class="project-date"
                      :title="formatFullDate(project.created_at)"
                    >
                      {{ formatDate(project.created_at) }}
                    </time>

                    <div class="project-techs" v-if="project.technologies && project.technologies.length">
                      <span v-for="(tech, idx) in project.technologies.slice(0, 3)" :key="idx" class="tech-tag">
                        {{ tech }}
                      </span>
                      <span v-if="project.technologies.length > 3" class="more-techs">
                        +{{ project.technologies.length - 3 }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div v-if="project.image_url" class="project-thumbnail">
                  <img :src="project.image_url" alt="Project thumbnail">
                </div>
              </div>
              
              <div class="project-actions">
                <router-link 
                  :to="`/dashboard/projects/edit/${project.id}`" 
                  class="action-button edit-button"
                >
                  Edit
                </router-link>
                <button 
                  @click="confirmDelete(project)" 
                  class="action-button delete-button"
                >
                  Delete
                </button>
                
                <a 
                  :href="project.external_url ? project.external_url : '/projects'" 
                  target="_blank" 
                  class="action-button view-button"
                >
                  {{ project.external_url ? 'Visit Site' : 'View' }}
                </a>
              </div>
            </article>
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-state-content">
              <svg class="empty-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h10v2H4v11h16v-6h2zm-2-9v5h-5V2h5z" fill="currentColor" />
              </svg>
              <h2>No projects found</h2>
              <p>
                Start by creating your first project!
              </p>
              <router-link to="/dashboard/projects/new" class="new-project-button">
                Add New Project
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal-content">
        <h3>Delete Project</h3>
        <p>Are you sure you want to delete "<strong>{{ projectToDelete?.title }}</strong>"?</p>
        <p class="warning-text">This action cannot be undone.</p>
        
        <div class="modal-actions">
          <button @click="cancelDelete" class="modal-button cancel-button">
            Cancel
          </button>
          <button @click="deleteProject" class="modal-button delete-button">
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
  name: 'ProjectView',
  setup() {
    const router = useRouter();
    const projects = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const searchQuery = ref('');
    const showDeleteConfirm = ref(false);
    const projectToDelete = ref(null);

    const fetchProjects = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        const { data, error: err } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (err) throw err;
        
        projects.value = data || [];
      } catch (err) {
        console.error('Error fetching projects:', err);
        error.value = 'Failed to load projects. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const filteredProjects = computed(() => {
      if (!searchQuery.value.trim()) return projects.value;
      
      const query = searchQuery.value.toLowerCase();
      return projects.value.filter(project => 
        project.title.toLowerCase().includes(query) || 
        (project.description && project.description.toLowerCase().includes(query))
      );
    });

    const handleSearch = () => {
      // Debounce implementation could be added here
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

    const confirmDelete = (project) => {
      projectToDelete.value = project;
      showDeleteConfirm.value = true;
    };

    const cancelDelete = () => {
      showDeleteConfirm.value = false;
      projectToDelete.value = null;
    };

    const deleteProject = async () => {
      if (!projectToDelete.value) return;
      
      try {
        loading.value = true;
        
        // First delete the project from the database
        const { error: err } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectToDelete.value.id);
        
        if (err) throw err;
        
        // Remove the project from the local array
        projects.value = projects.value.filter(p => p.id !== projectToDelete.value.id);
        
        // Close the modal
        cancelDelete();
      } catch (err) {
        console.error('Error deleting project:', err);
        error.value = 'Failed to delete project. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchProjects();
    });

    return {
      projects,
      loading,
      error,
      searchQuery,
      showDeleteConfirm,
      projectToDelete,
      filteredProjects,
      handleSearch,
      formatDate,
      formatFullDate,
      confirmDelete,
      cancelDelete,
      deleteProject
    };
  }
};
</script>

<style scoped>
.projects-manager {
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
.projects-header {
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.projects-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.projects-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.84);
  margin: 0;
}

.new-project-button {
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

.new-project-button:hover {
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
  flex: 1;
  min-width: 240px;
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

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  color: rgba(0, 0, 0, 0.54);
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.loading-spinner span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  margin: 0 3px;
  animation: bounce 0.6s infinite alternate;
}

.loading-spinner span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-spinner span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  to {
    transform: translateY(8px);
  }
}

/* Projects List */
.projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
}

.project-item {
  padding: 0;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.project-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.1);
}

.project-content {
  display: flex;
  gap: 1.5rem;
}

.project-info {
  flex: 1;
  padding: 1.5rem;
}

.project-thumbnail {
  width: 140px;
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}

.project-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-item:hover .project-thumbnail img {
  transform: scale(1.05);
}

.project-title {
  display: block;
  font-size: 17px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.84);
  text-decoration: none;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  transition: color 0.2s ease;
  position: relative;
  padding-bottom: 0.25rem;
}

.project-title:hover {
  color: #1a8917;
}

.project-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #1a8917;
  transition: width 0.3s ease;
}

.project-title:hover::after {
  width: 30px;
}

.project-summary {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  margin: 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2; /* Added standard property for compatibility */
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.project-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 13px;
}

.project-date {
  color: rgba(0, 0, 0, 0.54);
  font-size: 12px;
  display: flex;
  align-items: center;
}

.project-date::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  margin-right: 8px;
}

.project-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  display: inline-block;
  padding: 2px 8px;
  background-color: rgba(26, 137, 23, 0.08);
  color: #1a8917;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.tech-tag:hover {
  transform: translateY(-2px);
  background-color: rgba(26, 137, 23, 0.12);
}

.more-techs {
  color: rgba(0, 0, 0, 0.54);
  font-size: 12px;
}

.project-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background-color: rgba(0, 0, 0, 0.01);
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.action-button.edit-button {
  background-color: rgba(26, 137, 23, 0.08);
  color: #1a8917;
  border: none;
}

.action-button.edit-button:hover {
  background-color: rgba(26, 137, 23, 0.15);
  transform: translateY(-2px);
}

.action-button.delete-button {
  background-color: rgba(198, 40, 40, 0.08);
  color: #c62828;
  border: none;
}

.action-button.delete-button:hover {
  background-color: rgba(198, 40, 40, 0.15);
  transform: translateY(-2px);
}

.action-button.view-button {
  background-color: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.6);
  border: none;
}

.action-button.view-button:hover {
  background-color: rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* Empty State */
.empty-state {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.empty-state-content {
  text-align: center;
  max-width: 400px;
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
  .project-content {
    flex-direction: column;
  }
  
  .project-thumbnail {
    width: 100%;
    height: 180px;
    order: -1;
    margin-bottom: 1rem;
  }
  
  .filters-bar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-box {
    width: 100%;
  }
  
  .project-actions {
    flex-wrap: wrap;
  }
  
  .action-button {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .projects-header .container {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .project-meta {
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