<template>
  <div class="create-post-view">
    <div class="post-header">
      <h1>{{ isEditing ? 'Edit Post' : 'Create New Post' }}</h1>
      <div class="header-actions">
        <button 
          @click="router.push('/dashboard/posts')" 
          class="btn-cancel"
        >
          Cancel
        </button>
        <button 
          @click="savePost" 
          class="btn-save" 
          :disabled="isSaving"
        >
          {{ isSaving ? 'Saving...' : 'Save Post' }}
        </button>
      </div>
    </div>

    <div class="error-message" v-if="error">{{ error }}</div>

    <div class="post-form">
      <div class="form-main">
        <div class="form-group">
          <label for="title">Title</label>
          <input 
            type="text" 
            id="title" 
            v-model="postData.title" 
            placeholder="Enter post title"
            @input="autoGenerateSlug"
          >
        </div>

        <div class="form-group">
          <label for="content">Content</label>
          <div class="editor-container">
            <!-- 
              Rich Text Editor Integration (CKEditor example)
              Install with: npm install @ckeditor/ckeditor5-vue @ckeditor/ckeditor5-build-classic
            -->
            <!--
            <ckeditor :editor="editor" v-model="postData.content"></ckeditor>
            -->
            
            <!-- Fallback basic textarea until CKEditor is installed -->
            <textarea 
              id="content" 
              v-model="postData.content" 
              placeholder="Write your post content here..." 
              rows="15"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="form-sidebar">
        <div class="sidebar-section">
          <h3>Post Settings</h3>
          
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="postData.status">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div class="form-group">
            <label for="slug">URL Slug</label>
            <div class="slug-input">
              <input 
                type="text" 
                id="slug" 
                v-model="postData.slug" 
                placeholder="post-url-slug"
              >
              <button @click="generateSlug" class="btn-generate">Generate</button>
            </div>
          </div>

          <div class="form-group">
            <label for="summary">Summary</label>
            <textarea 
              id="summary" 
              v-model="postData.summary" 
              placeholder="Brief summary of your post" 
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="cover">Cover Image URL</label>
            <input 
              type="text" 
              id="cover" 
              v-model="postData.cover_image" 
              placeholder="https://example.com/image.jpg"
            >
            <div class="image-preview" v-if="postData.cover_image">
              <img :src="postData.cover_image" alt="Cover preview">
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>Tags</h3>
          <div class="form-group">
            <input 
              type="text" 
              v-model="tagInput" 
              placeholder="Add tag and press Enter" 
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
              <button @click="removeTag(index)" class="remove-tag">&times;</button>
            </span>
          </div>
          <p v-else class="no-tags">No tags added yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '../../lib/supabaseClient';
// Import CKEditor when ready to implement
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { CKEditor } from '@ckeditor/ckeditor5-vue';

export default {
  name: 'CreatePostView',
  // components: {
  //   // Uncomment when CKEditor is installed
  //   ckeditor: CKEditor.component
  // },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isEditing = computed(() => route.params.id !== undefined);
    const isSaving = ref(false);
    const error = ref('');
    const tagInput = ref('');
    const selectedTags = ref([]);
    const availableTags = ref([]);
    // Uncomment when CKEditor is installed
    // const editor = ClassicEditor;

    const postData = reactive({
      title: '',
      slug: '',
      summary: '',
      content: '',
      cover_image: '',
      status: 'draft',
      author_id: null // Will be set with the current user's ID
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
      
      // Check if tag already exists in selectedTags
      if (selectedTags.value.some(tag => tag.name.toLowerCase() === tagName.toLowerCase())) {
        tagInput.value = '';
        return;
      }
      
      // Check if tag exists in available tags
      let existingTag = availableTags.value.find(
        tag => tag.name.toLowerCase() === tagName.toLowerCase()
      );
      
      if (existingTag) {
        selectedTags.value.push(existingTag);
      } else {
        // Create a temporary tag object
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
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        
        postData.author_id = user.id;
        const now = new Date().toISOString();
        
        if (isEditing.value) {
          // Update existing post
          postData.updated_at = now;
          if (postData.status === 'published' && !postData.published_at) {
            postData.published_at = now;
          }
          
          const { error: updateError } = await supabase
            .from('blog_posts')
            .update(postData)
            .eq('id', route.params.id);
          
          if (updateError) throw updateError;
          
          // Handle tags for existing post
          await updatePostTags(route.params.id);
        } else {
          // Create new post
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
          
          // Handle tags for new post
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
        // First, remove existing tags
        await supabase
          .from('blog_post_tags')
          .delete()
          .eq('post_id', postId);
        
        // Add new tags that don't exist yet
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
          
          // Update the tag in our array with the real ID
          if (createdTag) {
            tag.id = createdTag.id;
            delete tag.isNew;
          }
        }
        
        // Create relationships for all tags
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
      // editor, // Uncomment when CKEditor is installed
      generateSlug,
      autoGenerateSlug,
      addTag,
      removeTag,
      savePost
    };
  }
};
</script>

<style scoped>
.create-post-view {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  color: #334155;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.post-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-save, .btn-cancel {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save {
  background-color: #3b82f6;
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.btn-save:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);
}

.btn-save:active:not(:disabled) {
  transform: translateY(0);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #f1f5f9;
  color: #475569;
}

.btn-cancel:hover {
  background-color: #e2e8f0;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(185, 28, 28, 0.1);
}

.post-form {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 28px;
}

.form-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #334155;
  font-size: 15px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 15px;
  transition: all 0.2s ease;
  background-color: #f8fafc;
  color: #334155;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background-color: white;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #94a3b8;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.5;
}

.editor-container {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  background-color: #f8fafc;
  transition: all 0.2s ease;
}

.editor-container:focus-within {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background-color: white;
}

.editor-container textarea {
  border: none;
  padding: 14px;
  min-height: 400px;
  background-color: transparent;
}

.editor-container textarea:focus {
  box-shadow: none;
}

.slug-input {
  display: flex;
  gap: 8px;
}

.slug-input input {
  flex-grow: 1;
}

.btn-generate {
  padding: 12px 16px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #475569;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.btn-generate:hover {
  background-color: #e2e8f0;
}

.image-preview {
  margin-top: 12px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  object-fit: cover;
  display: block;
}

.form-sidebar {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.sidebar-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  padding: 24px;
}

.sidebar-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.tag {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #f1f5f9;
  border-radius: 9999px;
  font-size: 14px;
  color: #475569;
  transition: all 0.2s ease;
}

.tag:hover {
  background-color: #e2e8f0;
}

.remove-tag {
  border: none;
  background: none;
  margin-left: 6px;
  cursor: pointer;
  font-size: 16px;
  color: #64748b;
  line-height: 1;
  padding: 2px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.remove-tag:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.no-tags {
  color: #94a3b8;
  font-style: italic;
  margin-top: 14px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .create-post-view {
    padding: 16px;
  }
  
  .post-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .post-header h1 {
    font-size: 24px;
  }
  
  .header-actions {
    width: 100%;
    gap: 10px;
  }
  
  .btn-save, .btn-cancel {
    flex-grow: 1;
    text-align: center;
  }
  
  .post-form {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .form-main {
    order: 2;
  }
  
  .form-sidebar {
    order: 1;
  }
  
  .form-group input,
  .form-group textarea,
  .form-group select {
    padding: 10px 12px;
  }
  
  .btn-generate {
    padding: 10px 12px;
  }
  
  .sidebar-section {
    padding: 20px;
  }
}
</style>
