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
      <div class="projects-header">
        <h1>{{ $t('projects.title') || 'Projects' }}</h1>
        <p class="projects-subtitle">{{ $t('projects.subtitle') || 'A showcase of my recent work and personal projects' }}</p>
      </div>
      
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
  padding: 4rem 1.5rem;
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
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.project-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
}

.project-image {
  height: 220px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  
  &::after {
    content: 'No image available';
    font-style: italic;
    font-size: 14px;
  }
}

.project-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.project-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: $cor-textDark;
}

.project-description {
  flex-grow: 1;
  margin-bottom: 1.5rem;
  color: rgba(0, 0, 0, 0.7);
  line-height: 1.6;
}

.project-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  background-color: rgba(237, 76, 92, 0.1);
  color: $cor-primaria;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 500;
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