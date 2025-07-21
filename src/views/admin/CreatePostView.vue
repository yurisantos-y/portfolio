<template>
  <div class="editor-page">
    <div class="editor-header" :class="{ 'saving': isSaving }">
      <div class="container">
        <div class="header-left">
          <router-link to="/dashboard/posts" class="back-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </router-link>
          <span class="editor-status">{{ isSaving ? 'Saving...' : (isEditing ? 'Editing' : 'New Story') }}</span>
        </div>
        <div class="header-right">
          <div class="publish-options">
            <select v-model="postData.status" class="status-select">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <button @click="savePost" class="publish-button" :disabled="isSaving">
              {{ postData.status === 'published' ? 'Publish' : 'Save' }}
            </button>
          </div>
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
            v-model="postData.title" 
            placeholder="Title"
            class="title-input"
            @input="autoGenerateSlug"
          >

          <input 
            type="text" 
            v-model="postData.summary" 
            placeholder="Add a subtitle or summary..." 
            class="subtitle-input"
          >
          
          <div v-if="postData.cover_image" class="cover-preview">
            <img :src="postData.cover_image" alt="Cover image">
            <button @click="postData.cover_image = ''" class="remove-cover">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div v-else class="cover-placeholder">
            <div class="cover-options">
              <button type="button" @click="showUnsplashPicker = true" class="cover-option">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 2v5h-4.5L11 2h5zM8 2v10h3V7h5v5h3V2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Unsplash
              </button>
            </div>

            <input 
              v-show="showCoverInput"
              type="text" 
              id="cover-image-url"
              v-model="postData.cover_image" 
              placeholder="Paste an image URL..."
              class="cover-input"
              style="display: block;"
            >
          </div>

          <div class="content-editor">
            <ckeditor 
              :editor="editor" 
              v-model="postData.content" 
              :config="editorConfig"
            ></ckeditor>
          </div>
        </div>
        
        <div class="editor-sidebar">
          <div class="sidebar-section">
            <h3>Story Settings</h3>
            
            <div class="form-group">
              <label for="slug">URL Slug</label>
              <div class="slug-input-wrapper">
                <input 
                  type="text" 
                  id="slug" 
                  v-model="postData.slug" 
                  placeholder="url-friendly-title"
                >
                <button @click="generateSlug" class="generate-button">
                  Generate
                </button>
              </div>
            </div>
            
            <div class="form-group tags-section">
              <label>Tags</label>
              <div class="tags-input-wrapper">
                <input 
                  type="text" 
                  v-model="tagInput" 
                  placeholder="Add a tag and press Enter" 
                  @keydown.enter.prevent="addTag"
                >
              </div>
              
              <div class="tags-list" v-if="selectedTags.length > 0">
                <span 
                  v-for="(tag, index) in selectedTags" 
                  :key="index" 
                  class="tag"
                >
                  {{ tag.name }}
                  <button @click="removeTag(index)" class="remove-tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </span>
              </div>
              <p v-else class="no-tags">No tags added yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal-dialog 
      v-if="showUnsplashPicker" 
      @close="showUnsplashPicker = false"
      title="Select a cover image from Unsplash"
    >
      <unsplash-image-picker 
        @close="showUnsplashPicker = false"
        :onSelect="selectUnsplashImage"
      />
    </modal-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import supabase from '../../utils/supabaseClient';
import ModalDialog from '../../components/ModalDialog.vue';
import UnsplashImagePicker from '../../components/UnsplashImagePicker.vue';
// Importando CKEditor corretamente
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-vue';

export default {
  name: 'CreatePostView',
  components: {
    ModalDialog,
    UnsplashImagePicker,
    // Registro correto do componente CKEditor
    ckeditor: CKEditor.component
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isEditing = computed(() => route.params.id !== undefined);
    const isSaving = ref(false);
    const error = ref('');
    const tagInput = ref('');
    const selectedTags = ref([]);
    const availableTags = ref([]);
    const showCoverInput = ref(false);
    const showUnsplashPicker = ref(false);
    const imageAttribution = ref(null);
    
    const editor = ClassicEditor;
    const editorConfig = {
      toolbar: [
        'heading', '|',
        'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
        'fontColor', 'fontBackgroundColor', '|',
        'blockQuote', 'insertTable', '|', 
        'undo', 'redo'
      ],
      heading: {
        options: [
          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
          { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
        ]
      }
    };

    const postData = reactive({
      title: '',
      slug: '',
      summary: '',
      content: '',
      cover_image: '',
      status: 'draft',
      author_id: null
    });

    const autoGenerateSlug = () => {
      if (!isEditing.value && postData.title && !postData.slug) {
        generateSlug();
      }
    };

    const generateSlug = () => {
      postData.slug = postData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    const fetchPost = async (id) => {
      try {
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          Object.assign(postData, data);
          await fetchPostTags(id);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        error.value = 'Failed to load post data';
      }
    };

    const fetchTags = async () => {
      try {
        const { data, error: tagsError } = await supabase
          .from('blog_tags')
          .select('*')
          .order('name');

        if (tagsError) throw tagsError;
        availableTags.value = data || [];
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };

    const fetchPostTags = async (postId) => {
      try {
        const { data, error: tagsError } = await supabase
          .from('blog_post_tags')
          .select(`
            tag_id,
            blog_tags (
              id,
              name,
              slug
            )
          `)
          .eq('post_id', postId);

        if (tagsError) throw tagsError;
        
        if (data) {
          selectedTags.value = data.map(item => ({
            id: item.blog_tags.id,
            name: item.blog_tags.name,
            slug: item.blog_tags.slug
          }));
        }
      } catch (err) {
        console.error('Error fetching post tags:', err);
      }
    };

    const addTag = async () => {
      if (!tagInput.value.trim()) return;
      
      const tagName = tagInput.value.trim();
      const tagSlug = tagName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      if (selectedTags.value.some(tag => tag.name.toLowerCase() === tagName.toLowerCase())) {
        tagInput.value = '';
        return;
      }
      
      let existingTag = availableTags.value.find(
        tag => tag.name.toLowerCase() === tagName.toLowerCase()
      );
      
      if (existingTag) {
        selectedTags.value.push(existingTag);
      } else {
        const newTag = {
          name: tagName,
          slug: tagSlug,
          isNew: true
        };
        selectedTags.value.push(newTag);
      }
      
      tagInput.value = '';
    };

    const removeTag = (index) => {
      selectedTags.value.splice(index, 1);
    };

    const savePost = async () => {
      if (!postData.title) {
        error.value = 'Post title is required';
        return;
      }

      if (!postData.slug) {
        generateSlug();
      }

      try {
        isSaving.value = true;
        error.value = '';
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        
        postData.author_id = user.id;
        const now = new Date().toISOString();
        
        if (isEditing.value) {
          postData.updated_at = now;
          if (postData.status === 'published' && !postData.published_at) {
            postData.published_at = now;
          }
          
          const { error: updateError } = await supabase
            .from('blog_posts')
            .update(postData)
            .eq('id', route.params.id);
          
          if (updateError) throw updateError;
          
          await updatePostTags(route.params.id);
        } else {
          postData.created_at = now;
          postData.updated_at = now;
          if (postData.status === 'published') {
            postData.published_at = now;
          }
          
          const { data: newPost, error: createError } = await supabase
            .from('blog_posts')
            .insert(postData)
            .select()
            .single();
          
          if (createError) throw createError;
          
          if (newPost) {
            await updatePostTags(newPost.id);
          }
        }
        
        router.push('/dashboard/posts');
      } catch (err) {
        console.error('Error saving post:', err);
        error.value = 'Failed to save post: ' + err.message;
      } finally {
        isSaving.value = false;
      }
    };

    const updatePostTags = async (postId) => {
      try {
        await supabase
          .from('blog_post_tags')
          .delete()
          .eq('post_id', postId);
        
        const newTags = selectedTags.value.filter(tag => tag.isNew);
        for (const tag of newTags) {
          const { data: createdTag, error: createTagError } = await supabase
            .from('blog_tags')
            .insert({
              name: tag.name,
              slug: tag.slug
            })
            .select()
            .single();
          
          if (createTagError) throw createTagError;
          
          if (createdTag) {
            tag.id = createdTag.id;
            delete tag.isNew;
          }
        }
        
        const postTags = selectedTags.value.map(tag => ({
          post_id: postId,
          tag_id: tag.id
        }));
        
        if (postTags.length > 0) {
          const { error: tagLinkError } = await supabase
            .from('blog_post_tags')
            .insert(postTags);
          
          if (tagLinkError) throw tagLinkError;
        }
      } catch (err) {
        console.error('Error updating post tags:', err);
        throw err;
      }
    };

    const selectUnsplashImage = (imageData) => {
      postData.cover_image = imageData.url;
      imageAttribution.value = imageData.attribution;
    };

    onMounted(async () => {
      await fetchTags();
      
      if (isEditing.value && route.params.id) {
        await fetchPost(route.params.id);
      }
    });

    return {
      router,
      postData,
      isEditing,
      isSaving,
      error,
      tagInput,
      selectedTags,
      showCoverInput,
      showUnsplashPicker,
      selectUnsplashImage,
      autoGenerateSlug,
      generateSlug,
      addTag,
      removeTag,
      savePost,
      editor,
      editorConfig
    };
  }
};
</script>

<style scoped>
.editor-page {
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

.publish-options {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-select {
  padding: 8px 12px;
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

.subtitle-input {
  width: 100%;
  font-family: Georgia, serif;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.54);
  border: none;
  padding: 0;
  margin-bottom: 32px;
}

.subtitle-input::placeholder {
  color: rgba(0, 0, 0, 0.3);
}

.subtitle-input:focus {
  outline: none;
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

.add-cover-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.54);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  background-color: transparent;
}

.add-cover-button:hover {
  background-color: rgba(0, 0, 0, 0.02);
  color: rgba(0, 0, 0, 0.68);
}

.cover-input {
  margin-top: 10px;
  display: none;
  width: 100%;
  padding: 8px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
}

.add-cover-button:focus + .cover-input,
.cover-input:focus {
  display: block;
}

.cover-options {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
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

.cover-option svg {
  width: 18px;
  height: 18px;
}

.content-editor {
  margin-bottom: 2rem;
}

:deep(.ck-editor__editable) {
  min-height: 400px !important;
  font-family: Georgia, serif;
  font-size: 18px;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.84);
  background-color: #fff;
}

:deep(.ck.ck-editor__main) {
  margin-bottom: 20px;
}

:deep(.ck-toolbar) {
  border-radius: 4px 4px 0 0 !important;
}

:deep(.ck-editor__editable) {
  border-radius: 0 0 4px 4px !important;
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

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.68);
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
}

.form-group input:focus {
  outline: none;
  border-color: rgba(0, 0, 0, 0.3);
}

.slug-input-wrapper {
  display: flex;
  gap: 8px;
}

.slug-input-wrapper input {
  flex-grow: 1;
}

.generate-button {
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.generate-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.8);
}

.tags-input-wrapper input {
  margin-bottom: 12px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 6px 10px;
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

.no-tags {
  color: rgba(0, 0, 0, 0.4);
  font-style: italic;
  font-size: 13px;
  margin-top: 10px;
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

  .status-select {
    display: none;
  }
  
  .title-input {
    font-size: 28px;
  }
  
  .subtitle-input {
    font-size: 18px;
    margin-bottom: 24px;
  }
  
  .content-textarea {
    font-size: 16px;
  }
}
</style>
