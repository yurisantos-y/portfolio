<template>
  <div class="projects-container">
    <div v-if="loading" class="loading-state">
      <div class="loading">
        <span></span><span></span><span></span>
      </div>
      <p>{{ $t('projects.loading') || 'Loading projects...' }}</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="projects.length === 0" class="no-projects">
      <h2>{{ $t('projects.noProjects') || 'No projects found' }}</h2>
      <p>{{ $t('projects.checkBack') || 'Please check back later for updates on our work.' }}</p>
    </div>

    <div v-else>
      
      <div class="projects-grid">
        <div v-for="project in projects" :key="project.id" class="project-card">
          <div class="project-image">
            <img v-if="project.image_url" :src="project.image_url" :alt="project.title">
            <div v-else class="placeholder-image"></div>
          </div>
          <div class="project-content">
            <h2 class="project-title">{{ project.title }}</h2>
            <p class="project-description">{{ project.description }}</p>
            
            <div class="project-techs">
              <span v-for="(tech, index) in project.technologies" 
                    :key="index" 
                    class="tech-badge">
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient';

export default {
  name: 'ProjectsView',
  
  setup() {
    const projects = ref([]);
    const loading = ref(true);
    const error = ref(null);
    
    const fetchProjects = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (fetchError) throw fetchError;
        
        projects.value = data || [];
      } catch (err) {
        console.error('Error fetching projects:', err);
        error.value = 'Failed to load projects. Please try again.';
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
      error
    };
  }
};
</script>

<style lang="scss">
@import '../scss/style.scss';

.projects-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10rem 1.5rem;
  min-height: 80vh;
  color: $cor-textDark;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.loading {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.loading span {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: $cor-textDark;
  margin: 0 5px;
  animation: bounce .6s cubic-bezier(0.6, 0.1, 1, 0.4);
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.loading span:nth-child(1) {
  animation-delay: .1s;
}

.loading span:nth-child(2) {
  animation-delay: .2s;
}

.loading span:nth-child(3) {
  animation-delay: .3s;
}

.error-message,
.no-projects {
  text-align: center;
  padding: 3rem 0;
}

.projects-header {
  text-align: center;
  margin-bottom: 3rem;
}

.projects-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: $cor-textDark;
}

.projects-subtitle {
  font-size: 1.2rem;
  color: rgba(0, 0, 0, 0.6);
  max-width: 600px;
  margin: 0 auto;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
}

.project-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    
    .project-image::after {
      opacity: 0.4;
    }
    
    .project-image img {
      transform: scale(1.08);
    }
  }
}

.project-image {
  height: 220px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%);
    opacity: 0.2;
    transition: opacity 0.4s ease;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #f0f0f0 30%, #fafafa 38%, #fafafa 40%, #f0f0f0 48%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  
  &::after {
    content: 'No image available';
    font-style: italic;
    font-size: 14px;
    letter-spacing: 0.5px;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.project-content {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  z-index: 2;
  background-color: #fff;
}

.project-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: $cor-textDark;
  letter-spacing: -0.3px;
  line-height: 1.3;
}

.project-description {
  flex-grow: 1;
  margin-bottom: 1.5rem;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.6;
  font-size: 0.95rem;
}

.project-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background-color: rgba(237, 76, 92, 0.08);
  color: $cor-primaria;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(237, 76, 92, 0.15);
    transform: translateY(-2px);
  }
}

@keyframes bounce {
  to {
    transform: translateY(10px);
  }
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .projects-header h1 {
    font-size: 2rem;
  }
  
  .projects-subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .projects-container {
    padding: 3rem 1rem;
  }
  
  .project-image {
    height: 180px;
  }
  
  .project-title {
    font-size: 1.3rem;
  }
}
</style>