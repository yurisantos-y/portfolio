<template>
  <div class="blog-post-container">
    <div v-if="loading" class="loading-state">
      <div class="loading">
        <span></span><span></span><span></span>
      </div>
      <p>{{ $t('blog.loading') || 'Carregando post...' }}</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <router-link to="/blog" class="back-btn">
        {{ $t('blog.backToBlog') || 'Voltar para o blog' }}
      </router-link>
    </div>

    <template v-else-if="post">
      <div class="post-header" :style="post.cover_image ? {backgroundImage: `url(${post.cover_image})`} : {}">
        <div class="overlay"></div>
        <div class="content">
          <router-link to="/blog" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            {{ $t('blog.backToBlog') || 'Voltar para o blog' }}
          </router-link>
          <h1>{{ post.title }}</h1>
          <div class="post-meta">
            <span class="post-date">{{ formatDate(post.published_at) }}</span>
            <div class="post-tags" v-if="post.tags && post.tags.length">
              <span v-for="tag in post.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="post-body">
        <div class="post-summary" v-if="post.summary">
          <p>{{ post.summary }}</p>
        </div>
        
        <div class="post-content" v-html="post.content"></div>
      </div>
    </template>

    <div v-else class="not-found">
      <h2>{{ $t('blog.postNotFound') || 'Post não encontrado' }}</h2>
      <router-link to="/blog" class="back-btn">
        {{ $t('blog.backToBlog') || 'Voltar para o blog' }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';
import { format } from 'date-fns';

const route = useRoute();
const router = useRouter();
const post = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchPost = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const slugOrId = route.params.id;
    
    // Tenta buscar pela slug primeiro
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_tags(
          blog_tags(id, name, slug)
        )
      `)
      .eq('status', 'published');
      
    // Verifica se o parâmetro é um UUID (possível ID) ou uma string (provável slug)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
    
    if (isUuid) {
      query = query.eq('id', slugOrId);
    } else {
      query = query.eq('slug', slugOrId);
    }
    
    const { data, error: err } = await query.single();
    
    if (err) {
      if (err.code === 'PGRST116') {
        // Post não encontrado
        return;
      }
      throw err;
    }
    
    if (data) {
      // Transformar dados para incluir tags em formato mais acessível
      const tags = data.blog_post_tags 
        ? data.blog_post_tags.map(t => t.blog_tags).filter(Boolean) 
        : [];
      
      post.value = {
        ...data,
        tags
      };
    }
  } catch (err) {
    console.error('Error fetching post:', err);
    error.value = 'Falha ao carregar o post. Por favor, tente novamente mais tarde.';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'dd/MM/yyyy');
  } catch (e) {
    return dateString;
  }
};

onMounted(() => {
  fetchPost();
});
</script>

<style lang="scss">
@import '../scss/style.scss';

body {
  background-color: $cor-light;
}

.blog-post-container {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 5rem;
}

.post-header {
  position: relative;
  height: 400px;
  background-size: cover;
  background-position: center;
  background-color: #f5f5f5;
  display: flex;
  align-items: flex-end;
  color: white;
  margin-bottom: 2rem;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%);
    z-index: 1;
  }
  
  .content {
    position: relative;
    z-index: 2;
    padding: 2rem;
    width: 100%;
  }
  
  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 1rem 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  .back-link {
    color: white;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    font-weight: 500;
    opacity: 0.8;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 1;
    }
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
}

.post-body {
  padding: 0 1.5rem;
  
  .post-summary {
    font-size: 1.2rem;
    color: #555;
    line-height: 1.6;
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid #eee;
    font-weight: 500;
  }
  
  .post-content {
    line-height: 1.8;
    color: #333;
    font-size: 1.1rem;
    
    h2 {
      margin-top: 2rem;
      margin-bottom: 1rem;
      font-size: 1.8rem;
    }
    
    h3 {
      margin-top: 1.8rem;
      margin-bottom: 0.8rem;
      font-size: 1.5rem;
    }
    
    p {
      margin-bottom: 1.5rem;
    }
    
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1.5rem 0;
    }
    
    a {
      color: $cor-primaria;
      text-decoration: none;
      border-bottom: 1px solid rgba($cor-primaria, 0.3);
      transition: border-color 0.2s ease;
      
      &:hover {
        border-color: $cor-primaria;
      }
    }
    
    ul, ol {
      margin: 1rem 0 1.5rem 1.5rem;
      
      li {
        margin-bottom: 0.5rem;
      }
    }
    
    blockquote {
      border-left: 4px solid $cor-primaria;
      padding-left: 1rem;
      margin: 1.5rem 0;
      font-style: italic;
      color: #555;
    }
    
    pre {
      background-color: #f5f5f5;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5rem 0;
    }
    
    code {
      background-color: #f5f5f5;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9rem;
    }
  }
}

.post-meta {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.post-date {
  font-size: 0.9rem;
  opacity: 0.8;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  .tag {
    padding: 0.25rem 0.75rem;
    background-color: rgba(255,255,255,0.2);
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }
}

.loading-state, .error-message, .not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  
  span {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: $cor-primaria;
    margin: 0 0.5rem;
    animation: bounce .6s cubic-bezier(0.6, 0.1, 1, 0.4) infinite alternate;
  }
  
  span:nth-child(1) {
    animation-delay: .1s;
  }
  
  span:nth-child(2) {
    animation-delay: .2s;
  }
  
  span:nth-child(3) {
    animation-delay: .3s;
  }
}

.back-btn {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: $cor-primaria;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: darken($cor-primaria, 10%);
  }
}

.error-message {
  color: #e74c3c;
}

.not-found {
  h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 1rem;
  }
}

@keyframes bounce {
  to {
    transform: translateY(16px);
    opacity: 0.3;
  }
}

@media screen and (max-width: 768px) {
  .post-header {
    height: 300px;
    
    h1 {
      font-size: 2rem;
    }
  }
  
  .post-body {
    padding: 0 1rem;
    
    .post-summary {
      font-size: 1.1rem;
    }
    
    .post-content {
      font-size: 1rem;
      
      h2 {
        font-size: 1.6rem;
      }
      
      h3 {
        font-size: 1.3rem;
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .post-header {
    height: 250px;
    
    h1 {
      font-size: 1.8rem;
    }
    
    .content {
      padding: 1.5rem;
    }
  }
}
</style>
