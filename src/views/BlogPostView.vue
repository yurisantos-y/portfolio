<template>
  <div class="blog-post-container">
    <div v-if="loading" class="loading-state">
      <div class="loading">
        <span></span><span></span><span></span>
      </div>
      <p>{{ $t('blog.loading') || 'Carregando post...' }}</p>
    </div>

    <template v-else-if="post">
      <article class="article">
        <div class="article-container">
          <header class="article-title">
            <h1>{{ post.title }}</h1>
            
            <div class="article-meta">
              <span class="post-date">{{ formatDate(post.published_at) }}</span>
              <div class="post-tags" v-if="post.tags && post.tags.length">
                <span v-for="tag in post.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
              </div>
            </div>
          </header>
          
          <div class="article-summary" v-if="post.summary">
            <p>{{ post.summary }}</p>
          </div>
          
          <div v-if="post.cover_image" class="article-cover">
            <img :src="post.cover_image" :alt="post.title">
          </div>
          
          <div class="article-content" v-html="post.content"></div>
        </div>
      </article>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import supabase from '../utils/supabaseClient';
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
    return format(new Date(dateString), 'dd MMM, yyyy');
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
  background-color: $cor-dark;
  color: rgba(0, 0, 0, 0.84);
  font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 1.6;
}

.blog-post-container {
  min-height: 100vh;
}

.article-header {
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .back-link {
    color: rgba(0, 0, 0, 0.54);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    transition: color 0.2s ease;
    
    &:hover {
      color: rgba(0, 0, 0, 0.84);
    }
  }
}

.article {
  max-width: 100%;
  overflow-x: hidden;
}

.article-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 3rem 2rem 5rem;
}

.article-title {
  margin-bottom: 2rem;
  
  h1 {
    font-family: Georgia, serif;
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: rgba(0, 0, 0, 0.84);
    line-height: 1.2;
    letter-spacing: -0.011em;
  }
}

.article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.post-date {
  font-size: 0.95rem;
  color: rgba(0, 0, 0, 0.54);
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  .tag {
    padding: 0.25rem 0.75rem;
    background-color: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.6);
    border-radius: 100px;
    font-size: 0.8rem;
  }
}

.article-summary {
  font-family: Georgia, serif;
  font-size: 1.3rem;
  color: rgba(0, 0, 0, 0.68);
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  line-height: 1.7;
  font-style: italic;
  
  p {
    margin-bottom: 0;
  }
}

.article-cover {
  margin: 2rem -6rem;
  overflow: hidden;
  max-height: 500px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.article-content {
  font-family: Georgia, serif;
  font-size: 1.25rem;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.84);
  
  h2 {
    font-family: Georgia, serif;
    font-size: 1.8rem;
    margin-top: 3rem;
    margin-bottom: 1.2rem;
    color: rgba(0, 0, 0, 0.84);
  }
  
  h3 {
    font-family: Georgia, serif;
    font-size: 1.5rem;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    color: rgba(0, 0, 0, 0.84);
  }
  
  p {
    margin-bottom: 2rem;
  }
  
  img {
    max-width: 100%;
    height: auto;
    margin: 2rem 0;
  }
  
  a {
    color: #1a8917;
    text-decoration: none;
    background-image: linear-gradient(to right, rgba(26, 137, 23, 0.2) 0%, rgba(26, 137, 23, 0.2) 100%);
    background-repeat: no-repeat;
    background-position: 0 100%;
    background-size: 100% 1px;
    transition: background-size 0.2s ease;
    
    &:hover {
      background-size: 100% 35%;
      color: #155e13;
    }
  }
  
  ul, ol {
    margin: 2rem 0;
    padding-left: 2rem;
    
    li {
      margin-bottom: 0.8rem;
    }
  }
  
  blockquote {
    border-left: 3px solid rgba(0, 0, 0, 0.84);
    margin: 2rem 0;
    padding: 0.5rem 0 0.5rem 2rem;
    font-style: italic;
    color: rgba(0, 0, 0, 0.68);
    font-size: 1.3rem;
    
    p:last-child {
      margin-bottom: 0;
    }
  }
  
  pre {
    background-color: #f8f8f8;
    border-radius: 4px;
    padding: 1.5rem;
    overflow-x: auto;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 1.5rem 0;
  }
  
  code {
    background-color: #f8f8f8;
    border-radius: 4px;
    padding: 0.2rem 0.4rem;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.9em;
  }
  
  hr {
    border: none;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
    margin: 3rem 0;
  }
}

.article-footer {
  margin-top: 5rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
}

.loading-state, .error-message, .not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  
  span {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.54);
    margin: 0 0.25rem;
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
  color: #1a8917;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.8rem 1.5rem;
  border: 1px solid #1a8917;
  border-radius: 100px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(26, 137, 23, 0.05);
  }
}

.error-message {
  color: #e74c3c;
  
  p {
    margin-bottom: 2rem;
  }
}

@keyframes bounce {
  to {
    transform: translateY(8px);
    opacity: 0.3;
  }
}

/* Melhorias na responsividade para dispositivos entre 1024px e 769px */
@media screen and (max-width: 1024px) and (min-width: 769px) {
  .article-container {
    padding: 2.5rem 2rem 4rem;
  }
  
  .article-title h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
  
  .article-summary {
    font-size: 1.15rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
  }
  
  .article-cover {
    margin-bottom: 2rem;
    max-height: 450px;
  }
  
  .article-content {
    font-size: 1.1rem;
    
    h2 {
      font-size: 1.7rem;
      margin-top: 2.5rem;
    }
    
    h3 {
      font-size: 1.4rem;
      margin-top: 2rem;
    }
    
    blockquote {
      padding-left: 1.5rem;
      font-size: 1.2rem;
    }
    
    pre {
      margin: 1.2rem 0;
    }
  }
}

/* Melhorias para tablets na orientação retrato */
@media screen and (max-width: 900px) and (min-width: 769px) {
  .article-title h1 {
    font-size: 2.3rem;
  }
  
  .article-summary {
    font-size: 1.1rem;
  }
  
  .article-content {
    font-size: 1.05rem;
    
    h2 {
      font-size: 1.6rem;
    }
    
    h3 {
      font-size: 1.35rem;
    }
  }
  
  .article-cover {
    max-height: 400px;
  }
}

/* Ajustes para telas entre 600px e 768px */
@media screen and (max-width: 768px) and (min-width: 600px) {
  .article-container {
    padding: 2rem 1.8rem 3.5rem;
  }
  
  .article-header {
    padding: 1rem 0;
  }
  
  .article-title h1 {
    font-size: 2.1rem;
    margin-bottom: 1.2rem;
  }
  
  .article-summary {
    font-size: 1.05rem;
    margin-bottom: 1.8rem;
    padding-bottom: 1.8rem;
  }
  
  .article-content {
    font-size: 1.02rem;
    line-height: 1.7;
    
    h2 {
      font-size: 1.5rem;
      margin-top: 2.2rem;
      margin-bottom: 1rem;
    }
    
    h3 {
      font-size: 1.3rem;
      margin-top: 1.8rem;
      margin-bottom: 0.8rem;
    }
    
    ul, ol {
      margin: 1.5rem 0;
      padding-left: 1.5rem;
    }
    
    blockquote {
      font-size: 1.1rem;
      margin: 1.8rem 0;
    }
  }
  
  .article-footer {
    margin-top: 4rem;
    padding-top: 2.5rem;
  }
  
  .back-btn {
    padding: 0.7rem 1.3rem;
  }
}

/* Melhorias para interações touch em dispositivos móveis */
@media (hover: none) {
  .back-link:active {
    color: rgba(0, 0, 0, 0.84);
    transition: color 0.2s ease;
  }
  
  .back-btn:active {
    background-color: rgba(26, 137, 23, 0.1);
    transition: background-color 0.2s ease;
  }
  
  .article-content {
    a:active {
      background-size: 100% 35%;
      color: #155e13;
      transition: all 0.2s ease;
    }
  }
}

/* Ajustes para telas entre 540px e 599px */
@media screen and (max-width: 599px) and (min-width: 540px) {
  .article-container {
    padding: 2rem 1.6rem 3.5rem;
  }
  
  .article-header .container {
    padding: 0 1.6rem;
  }
  
  .article-title h1 {
    font-size: 2rem;
  }
  
  .article-summary {
    font-size: 1rem;
  }
  
  .article-cover {
    margin: 1.2rem -1.6rem;
    max-height: 350px;
  }
}

@media screen and (max-width: 768px) {
  .article-container {
    padding: 2rem 1.5rem 4rem;
  }
  
  .article-title h1 {
    font-size: 2.2rem;
  }
  
  .article-cover {
    margin: 1.5rem -1.5rem;
    max-height: 400px;
  }
  
  .article-content {
    font-size: 1.1rem;
    
    h2 {
      font-size: 1.6rem;
    }
    
    h3 {
      font-size: 1.3rem;
    }
    
    blockquote {
      font-size: 1.1rem;
    }
  }
  
  .article-summary {
    font-size: 1.15rem;
  }
}

@media screen and (max-width: 480px) {
  .article-header .container {
    padding: 0 1.25rem;
  }
  
  .article-container {
    padding: 1.5rem 1.25rem 3rem;
  }
  
  .article-title h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  .article-content {
    font-size: 1rem;
  }
  
  .article-cover {
    margin: 1rem -1.25rem;
    max-height: 300px;
  }
  
  .article-summary {
    font-size: 1.05rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }
}
</style>
