<template>
  <div class="projects-manager">
    <div class="projects-header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <button @click="goBack" class="back-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div class="title-section">
              <h1>Projects</h1>
              <p class="subtitle">{{ projects.length }} {{ projects.length === 1 ? 'project' : 'projects' }}</p>
            </div>
          </div>
          <router-link to="/dashboard/projects/new" class="new-project-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New Project
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
              placeholder="Search projects..." 
              @input="handleSearch"
              class="search-input"
            >
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
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
        
        <div v-else class="projects-content">
          <div v-if="filteredProjects.length > 0" class="projects-grid">
            <article 
              v-for="project in filteredProjects" 
              :key="project.id" 
              class="project-card"
            >
              <div v-if="project.image_url" class="project-image">
                <img :src="project.image_url" :alt="project.title || 'Project image'">
                <div class="project-overlay">
                  <router-link 
                    :to="`/dashboard/projects/edit/${project.id}`" 
                    class="overlay-edit-btn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </router-link>
                </div>
              </div>
              
              <div class="project-content">
                <div class="project-header">
                  <router-link 
                    :to="`/dashboard/projects/edit/${project.id}`" 
                    class="project-title"
                  >
                    {{ project.title || 'Untitled Project' }}
                  </router-link>
                </div>
                
                <p v-if="project.description" class="project-description">
                  {{ getShortDescription(project.description) }}
                </p>
                
                <div class="project-tech" v-if="project.technologies && project.technologies.length">
                  <div class="tech-stack">
                    <span v-for="(tech, idx) in project.technologies.slice(0, 4)" :key="idx" class="tech-badge">
                      {{ tech }}
                    </span>
                    <span v-if="project.technologies.length > 4" class="more-tech">
                      +{{ project.technologies.length - 4 }}
                    </span>
                  </div>
                </div>
                
                <div class="project-footer">
                  <div class="project-meta">
                    <time class="project-date">
                      {{ formatDate(project.created_at) }}
                    </time>
                  </div>
                  
                  <div class="project-actions">
                    <router-link 
                      :to="`/dashboard/projects/edit/${project.id}`" 
                      class="action-btn edit-btn"
                    >
                      Edit
                    </router-link>
                    
                    <a 
                      v-if="project.external_url" 
                      :href="project.external_url" 
                      target="_blank" 
                      class="action-btn view-btn"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15,3 21,3 21,9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </a>
                    
                    <button 
                      @click="confirmDelete(project)" 
                      class="action-btn delete-btn"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
          
          <div v-else class="empty-container">
            <div class="empty-content">
              <div class="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <h3>No projects yet</h3>
              <p>Start building your portfolio by creating your first project.</p>
              <router-link to="/dashboard/projects/new" class="new-project-button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Create First Project
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
          <h3>Delete Project</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete "<strong>{{ projectToDelete?.title }}</strong>"?</p>
          <p class="warning">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button @click="cancelDelete" class="btn-cancel">
            Cancel
          </button>
          <button @click="deleteProject" class="btn-delete">
            Delete Project
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
  name: 'ProjectsView',
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

    const getShortDescription = (description) => {
      if (!description) return '';
      return description.length > 120 ? description.substring(0, 120) + '...' : description;
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
      goBack,
      handleSearch,
      getShortDescription,
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
/* Reset and Base Styles */
* {
  box-sizing: border-box;
}

.projects-manager {
  background: #fafafa;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
  color: #1a1a1a;
  line-height: 1.6;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Header Styles */
.projects-header {
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

.new-project-button {
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

.new-project-button:hover {
  background: #2d2d2d;
  transform: translateY(-1px);
}

.new-project-button svg {
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

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 32px;
}

.project-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #d1d5db;
}

/* Project Image */
.project-image {
  height: 240px;
  overflow: hidden;
  position: relative;
  background: #f8fafc;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.overlay-edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 50%;
  color: #1a1a1a;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.overlay-edit-btn:hover {
  transform: scale(1.1);
  background: #1a1a1a;
  color: white;
}

/* Project Content */
.project-content {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.project-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: none;
  line-height: 1.3;
  letter-spacing: -0.025em;
  transition: color 0.2s ease;
  flex: 1;
}

.project-title:hover {
  color: #4b5563;
}

.project-description {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

/* Tech Stack */
.project-tech {
  margin: 8px 0;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-badge {
  padding: 6px 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: #475569;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.tech-badge:hover {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  border-color: #1a1a1a;
  transform: translateY(-2px);
}

.more-tech {
  padding: 6px 12px;
  background: #f3f4f6;
  color: #9ca3af;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* Project Footer */
.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.project-meta {
  flex: 1;
}

.project-date {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
}

.project-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 6px;
}

.edit-btn {
  background: #1a1a1a;
  color: white;
}

.edit-btn:hover {
  background: #2d2d2d;
  transform: translateY(-2px);
}

.view-btn {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.view-btn:hover {
  background: #e2e8f0;
  color: #475569;
  transform: translateY(-2px);
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.delete-btn:hover {
  background: #fee2e2;
  color: #b91c1c;
  transform: translateY(-2px);
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
@media (max-width: 1200px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
  }
}

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
  
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .project-content {
    padding: 24px;
    gap: 16px;
  }
  
  .project-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .project-actions {
    justify-content: flex-end;
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
  .project-image {
    height: 200px;
  }
  
  .project-title {
    font-size: 20px;
  }
  
  .tech-stack {
    gap: 6px;
  }
  
  .tech-badge {
    font-size: 11px;
    padding: 4px 10px;
  }
  
  .project-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .action-btn {
    flex: 1;
    min-width: 80px;
  }
}
</style>