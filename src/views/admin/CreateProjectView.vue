<template>
  <div class="project-editor-page">
    <div class="editor-header" :class="{ 'saving': isSaving }">
      <div class="container">
        <div class="header-left">
          <router-link to="/dashboard/projects" class="back-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </router-link>
          <span class="editor-status">{{ isSaving ? 'Saving...' : (isEditing ? 'Editing' : 'New Project') }}</span>
        </div>
        <div class="header-right">
          <button @click="saveProject" class="publish-button" :disabled="isSaving">
            {{ isEditing ? 'Update Project' : 'Save Project' }}
          </button>
        </div>
      </div>
    </div>

    <div class="error-notification" v-if="error">
      <div class="container">
        <p>{{ error }}</p>
      </div>
    </div>

    <div class="editor-main">
      <div class="container">
        <div class="editor-content">
          <input 
            type="text" 
            v-model="projectData.title" 
            placeholder="Project Title"
            class="title-input"
          >

          <div v-if="projectData.image" class="cover-preview">
            <img :src="imagePreview" alt="Project image">
            <button @click="removeImage" class="remove-cover">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div v-else class="cover-placeholder">
            <div class="cover-options">
              <label for="project-image-upload" class="cover-option">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16l4-4 4 4M14 16l2-2 4 4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2zM8 10a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Upload Image
              </label>
              <input 
                type="file" 
                id="project-image-upload" 
                @change="handleImageUpload" 
                accept="image/*"
                style="display: none"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="description">Project Description</label>
            <textarea 
              id="description"
              v-model="projectData.description" 
              placeholder="Describe your project..."
              rows="6"
              class="description-input"
            ></textarea>
          </div>

          <div class="form-group tech-section">
            <label>Technologies Used</label>
            <div class="tech-input-wrapper">
              <div class="tech-input-row">
                <input 
                  type="text" 
                  v-model="techInput" 
                  placeholder="Add a technology and press Enter" 
                  @keydown.enter.prevent="addTech"
                  class="tech-input"
                >
                <button @click="addTech" class="add-tech-button">Add</button>
              </div>

              <div class="tech-list" v-if="projectData.technologies.length > 0">
                <span 
                  v-for="(tech, index) in projectData.technologies" 
                  :key="index" 
                  class="tech-tag"
                >
                  {{ tech }}
                  <button @click="removeTech(index)" class="remove-tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </span>
              </div>
              <p v-else class="no-techs">No technologies added yet</p>
            </div>
          </div>
        </div>
        
        <div class="editor-sidebar">
          <div class="sidebar-section">
            <h3>Project Preview</h3>
            <div class="project-card-preview">
              <div class="preview-card">
                <div class="preview-image">
                  <img v-if="imagePreview" :src="imagePreview" alt="Project Preview">
                  <div v-else class="preview-placeholder">No image uploaded</div>
                </div>
                <div class="preview-details">
                  <h2>{{ projectData.title || 'Project Title' }}</h2>
                  <p>{{ projectData.description || 'Project description will appear here...' }}</p>
                  <div class="preview-techs">
                    <span v-for="(tech, index) in projectData.technologies" :key="index" class="preview-tech">
                      {{ tech }}
                    </span>
                    <span v-if="projectData.technologies.length === 0" class="preview-tech-placeholder">
                      Technologies will appear here
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '../../lib/supabaseClient';

export default {
  name: 'CreateProjectView',
  
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    const isEditing = computed(() => route.params.id !== undefined);
    const isSaving = ref(false);
    const error = ref('');
    const techInput = ref('');
    
    // File related refs
    const imageFile = ref(null);
    const imagePreview = ref('');
    
    const projectData = reactive({
      title: '',
      description: '',
      image: null,
      technologies: [],
      created_at: null,
      updated_at: null
    });

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      imageFile.value = file;
      projectData.image = file.name;
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const removeImage = () => {
      imageFile.value = null;
      imagePreview.value = '';
      projectData.image = null;
    };

    const addTech = () => {
      if (!techInput.value.trim()) return;
      
      const techName = techInput.value.trim();
      if (!projectData.technologies.includes(techName)) {
        projectData.technologies.push(techName);
      }
      
      techInput.value = '';
    };

    const removeTech = (index) => {
      projectData.technologies.splice(index, 1);
    };

    const fetchProject = async (id) => {
      try {
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          // Populate form with project data
          projectData.title = data.title;
          projectData.description = data.description;
          projectData.image = data.image_url;
          projectData.technologies = data.technologies || [];
          
          // Set image preview
          if (data.image_url) {
            imagePreview.value = data.image_url;
          }
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        error.value = 'Failed to load project data';
      }
    };

    const uploadImage = async () => {
      if (!imageFile.value) return null;
      
      try {
        const fileExt = imageFile.value.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `projects/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, imageFile.value);
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: publicURL } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);
        
        return publicURL.publicUrl;
      } catch (err) {
        console.error('Error uploading image:', err);
        throw err;
      }
    };

    const saveProject = async () => {
      if (!projectData.title) {
        error.value = 'Project title is required';
        return;
      }

      try {
        isSaving.value = true;
        error.value = '';
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        
        let imageUrl = projectData.image;
        
        // Upload image if there's a new one
        if (imageFile.value) {
          imageUrl = await uploadImage();
        }
        
        const now = new Date().toISOString();
        const projectPayload = {
          title: projectData.title,
          description: projectData.description,
          image_url: imageUrl,
          technologies: projectData.technologies,
          user_id: user.id,
          updated_at: now
        };
        
        if (isEditing.value) {
          // Update existing project
          const { error: updateError } = await supabase
            .from('projects')
            .update(projectPayload)
            .eq('id', route.params.id);
          
          if (updateError) throw updateError;
          
        } else {
          // Create new project
          projectPayload.created_at = now;
          
          const { error: createError } = await supabase
            .from('projects')
            .insert([projectPayload]);
          
          if (createError) throw createError;
        }
        
        // Redirect to projects list
        router.push('/dashboard/projects');
      } catch (err) {
        console.error('Error saving project:', err);
        error.value = 'Failed to save project: ' + err.message;
      } finally {
        isSaving.value = false;
      }
    };

    onMounted(async () => {
      if (isEditing.value && route.params.id) {
        await fetchProject(route.params.id);
      }
    });

    return {
      isEditing,
      isSaving,
      error,
      projectData,
      techInput,
      imageFile,
      imagePreview,
      handleImageUpload,
      removeImage,
      addTech,
      removeTech,
      saveProject
    };
  }
};
</script>

<style lang="scss">
@import '../../scss/style.scss';

.project-editor-page {
  background-color: #fff;
  min-height: 100vh;
  color: rgba(0, 0, 0, 0.84);
  font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.editor-header {
  position: sticky;
  top: 0;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 10;
  transition: background-color 0.2s ease;
}

.editor-header.saving {
  background-color: #fafafa;
}

.editor-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 65px;
}

.header-left {
  display: flex;
  align-items: center;
}

.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.54);
  margin-right: 16px;
  text-decoration: none;
}

.back-button:hover {
  color: rgba(0, 0, 0, 0.84);
}

.editor-status {
  font-size: 15px;
  color: rgba(0, 0, 0, 0.54);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.publish-button {
  background-color: #1a8917;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.publish-button:hover:not(:disabled) {
  background-color: #0f6d14;
}

.publish-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-notification {
  background-color: #fce8e6;
  padding: 12px 0;
  margin-bottom: 2rem;
}

.error-notification p {
  color: #c62828;
  margin: 0;
  font-size: 14px;
}

.editor-main .container {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 40px;
  padding-top: 2rem;
  padding-bottom: 4rem;
}

.editor-content {
  min-height: 70vh;
}

.title-input {
  width: 100%;
  font-family: Georgia, serif;
  font-size: 32px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.84);
  border: none;
  padding: 0;
  margin-bottom: 16px;
  line-height: 1.2;
}

.title-input::placeholder {
  color: rgba(0, 0, 0, 0.3);
}

.title-input:focus {
  outline: none;
}

.description-input {
  width: 100%;
  font-family: Georgia, serif;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.68);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 12px;
  resize: vertical;
  line-height: 1.6;
}

.description-input:focus {
  outline: none;
  border-color: rgba(0, 0, 0, 0.3);
}

.cover-preview {
  position: relative;
  margin: 1.5rem 0 2.5rem;
  border-radius: 4px;
  overflow: hidden;
  max-height: 400px;
}

.cover-preview img {
  width: 100%;
  object-fit: cover;
  display: block;
}

.remove-cover {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.6);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.remove-cover:hover {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.8);
}

.cover-placeholder {
  margin: 1.5rem 0 2.5rem;
}

.cover-options {
  display: flex;
  gap: 10px;
}

.cover-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.7);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cover-option:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.3);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.68);
}

.tech-input-row {
  display: flex;
  gap: 10px;
}

.tech-input {
  flex: 1;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 14px;
}

.add-tech-button {
  padding: 8px 16px;
  background-color: #eee;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.add-tech-button:hover {
  background-color: #e0e0e0;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tech-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 100px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}

.remove-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 16px;
  height: 16px;
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: color 0.2s ease;
}

.remove-tag:hover {
  color: rgba(0, 0, 0, 0.8);
}

.no-techs {
  color: rgba(0, 0, 0, 0.4);
  font-style: italic;
  font-size: 13px;
  margin-top: 10px;
}

.editor-sidebar {
  align-self: start;
  position: sticky;
  top: 85px;
}

.sidebar-section {
  background-color: #fafafa;
  border-radius: 6px;
  padding: 24px;
  margin-bottom: 24px;
}

.sidebar-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.84);
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.project-card-preview {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.project-card-preview:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.preview-card {
  width: 100%;
}

.preview-image {
  width: 100%;
  height: 180px;
  background-color: #f5f5f5;
  overflow: hidden;
  position: relative;
}

.preview-image::after {
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

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.project-card-preview:hover .preview-image img {
  transform: scale(1.05);
}

.project-card-preview:hover .preview-image::after {
  opacity: 0.4;
}

.preview-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.3);
  font-style: italic;
  background: linear-gradient(120deg, #f0f0f0 30%, #fafafa 38%, #fafafa 40%, #f0f0f0 48%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.preview-details {
  padding: 1.5rem;
  background-color: #fff;
}

.preview-details h2 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.84);
  letter-spacing: -0.3px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1; /* Added standard property for compatibility */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preview-details p {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  max-height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3; /* Added standard property for compatibility */
  -webkit-box-orient: vertical;
}

.preview-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.preview-tech {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background-color: rgba(237, 76, 92, 0.08);
  color: #ed4c5c;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

.project-card-preview:hover .preview-tech {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
}

.preview-tech-placeholder {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.3);
  font-style: italic;
}

@media (max-width: 960px) {
  .editor-main .container {
    grid-template-columns: 1fr;
  }
  
  .editor-sidebar {
    position: static;
    margin-top: 2rem;
  }
}

@media (max-width: 640px) {
  .editor-header .container {
    padding: 0 1rem;
    height: 55px;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .title-input {
    font-size: 28px;
  }
  
  .cover-preview {
    margin: 1rem 0 2rem;
  }
}
</style>