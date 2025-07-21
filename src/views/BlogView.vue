<template>
  <div class="container">
    <div class="blog-container">
      <div v-if="loading" class="loading-state">
        <div class="loading">
          <span></span><span></span><span></span>
        </div>
        <p>{{ $t('blog.loading') || 'Carregando posts...' }}</p>
      </div>
  
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>
  
      <div v-else-if="posts.length === 0" class="no-posts">
        <p>{{ $t('blog.noPosts') || 'Nenhum post encontrado' }}</p>
      </div>
  
      <div v-else class="posts-grid">
        <article v-for="post in posts" :key="post.id" class="post-card" @click="navigateToPost(post.slug || post.id)">
          <div class="post-image" v-if="post.cover_image">
            <img :src="post.cover_image" :alt="post.title">
          </div>
          <div class="post-content">
            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-summary">{{ post.summary }}</p>
            <div class="post-meta">
              <span class="post-date">{{ formatDate(post.published_at) }}</span>
              <div class="post-tags" v-if="post.tags && post.tags.length">
                <span v-for="tag in post.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
              </div>
            </div>
            <router-link :to="`/blog/${post.slug || post.id}`" class="read-more" @click.stop>
              {{ $t('Ler mais') || 'Ler mais' }}
            </router-link>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import supabaseClient from '../utils/supabaseClient';
import { format } from 'date-fns';
import { useRouter } from 'vue-router';

const router = useRouter();
const posts = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchPosts = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const { data, error: err } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_tags(
          blog_tags(id, name, slug)
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (err) throw err;
    
    // Transform data to include tags in a more accessible format
    posts.value = data.map(post => {
      const tags = post.blog_post_tags 
        ? post.blog_post_tags.map(t => t.blog_tags).filter(Boolean) 
        : [];
      
      return {
        ...post,
        tags
      };
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    error.value = 'Falha ao carregar os posts do blog. Por favor, tente novamente mais tarde.';
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

const navigateToPost = (slugOrId) => {
  router.push(`/blog/${slugOrId}`);
};

onMounted(() => {
  fetchPosts();
});
</script>

<style lang="scss">
@import '../scss/style.scss';

body {
  background-color: $cor-light;
}

.container {
  background-color: $cor-light;
  min-height: 100vh;
  
}

.blog-container {
  background-color: $cor-light;
  max-width: 1000px;
  margin: auto;
  padding: 10rem 2rem;
  min-height: 80vh;
}

.blog-header {
  text-align: center;
  margin-bottom: 4rem;
  
  h1 {
    font-family: Georgia, serif;
    font-size: 3.4rem;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.84);
    margin-bottom: 1rem;
    letter-spacing: -0.011em;
    line-height: 1.2;
  }
  
  .subtitle {
    font-size: 1.3rem;
    color: rgba(0, 0, 0, 0.54);
    max-width: 600px;
    margin: 0 auto;
    font-weight: 400;
    line-height: 1.4;
  }
}

.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
}

.post-card {
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 3rem;
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  
  &:hover {
    .post-title {
      color: rgba(0, 0, 0, 0.68);
    }
    
    .post-image img {
      transform: scale(1.02);
    }
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.post-image {
  height: 300px;
  overflow: hidden;
  margin-bottom: 2rem;
  border-radius: 4px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s ease;
  }
}

.post-content {
  display: flex;
  flex-direction: column;
}

.post-meta {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
  order: 3;
}

.post-date {
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.54);
  font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
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
    font-weight: 400;
    letter-spacing: 0;
    font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
}

.post-title {
  font-family: Georgia, serif;
  font-size: 2rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.84);
  margin-bottom: 0.75rem;
  line-height: 1.3;
  letter-spacing: -0.011em;
  order: 1;
}

.post-summary {
  color: rgba(0, 0, 0, 0.54);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 400;
  order: 2;
}

.read-more {
  display: inline-block;
  color: #1a8917;
  font-weight: 500;
  text-decoration: none;
  align-self: flex-start;
  font-size: 0.9rem;
  margin-top: 1rem;
  order: 4;
  
  &:hover {
    text-decoration: underline;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 40vh;
  text-align: center;
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

.error-message, .no-posts {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(0, 0, 0, 0.54);
  font-size: 1.2rem;
  font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.error-message {
  background-color: rgba(255, 87, 87, 0.05);
  border: 1px solid rgba(255, 87, 87, 0.1);
  color: #ff5757;
}

@keyframes bounce {
  to {
    transform: translateY(8px);
    opacity: 0.3;
  }
}

@media screen and (max-width: 768px) {
  .blog-header h1 {
    font-size: 2.8rem;
  }
  
  .post-title {
    font-size: 1.7rem;
  }
  
  .post-image {
    height: 220px;
  }
}

@media screen and (max-width: 480px) {
  .blog-container {
    padding: 4rem 1.25rem;
  }
  
  .blog-header {
    margin-bottom: 3rem;
    
    h1 {
      font-size: 2.3rem;
    }
    
    .subtitle {
      font-size: 1.1rem;
    }
  }
  
  .post-image {
    height: 200px;
  }
  
  .post-title {
    font-size: 1.5rem;
  }
  
  .post-summary {
    font-size: 1rem;
  }
  
  .posts-grid {
    gap: 2.5rem;
  }
  
  .post-card {
    padding-bottom: 2.5rem;
  }
}

/* Melhorias na responsividade para dispositivos entre 1024px e 769px */
@media screen and (max-width: 1024px) and (min-width: 769px) {
  .blog-container {
    padding: 5rem 2rem;
  }
  
  .blog-header {
    margin-bottom: 3.5rem;
  }
  
  .blog-header h1 {
    font-size: 2.6rem;
  }
  
  .blog-header .subtitle {
    font-size: 1.1rem;
    max-width: 80%;
  }
  
  .post-card {
    padding-bottom: 3rem;
  }
  
  .post-image {
    height: 280px;
    margin-bottom: 1.8rem;
  }
  
  .post-title {
    font-size: 1.9rem;
  }
  
  .post-summary {
    font-size: 1.05rem;
  }
  
  .read-more {
    font-size: 0.95rem;
    padding: 0.6rem 1.3rem;
  }
}

/* Melhorias para dispositivos tablet em orientação retrato */
@media screen and (max-width: 900px) and (min-width: 769px) {
  .post-image {
    height: 260px;
  }
  
  .post-title {
    font-size: 1.8rem;
  }
  
  .post-summary {
    font-size: 1rem;
    margin-bottom: 1.2rem;
  }
  
  .posts-grid {
    gap: 3rem;
  }
  
  .post-date {
    font-size: 0.9rem;
  }
}

/* Ajustes para telas entre 600px e 768px */
@media screen and (max-width: 768px) and (min-width: 600px) {
  .blog-container {
    padding: 4.5rem 1.8rem;
  }
  
  .blog-header {
    margin-bottom: 3rem;
  }
  
  .blog-header h1 {
    font-size: 2.3rem;
    margin-bottom: 1rem;
  }
  
  .blog-header .subtitle {
    font-size: 1rem;
    max-width: 90%;
  }
  
  .post-image {
    height: 240px;
    margin-bottom: 1.5rem;
  }
  
  .post-title {
    font-size: 1.7rem;
    margin-bottom: 0.6rem;
  }
  
  .post-meta {
    margin-bottom: 1rem;
  }
}

/* Melhorias para interações touch em dispositivos móveis */
@media (hover: none) {
  .post-card:active .post-image img {
    transform: scale(1.02);
    transition: transform 0.3s ease;
  }
  
  .post-card:active .post-title {
    color: rgba(0, 0, 0, 0.68);
    transition: color 0.3s ease;
  }
  
  .read-more:active {
    background-color: rgba(26, 137, 23, 0.05);
    color: #0f6d14;
    transform: translateY(-2px);
    transition: all 0.2s ease;
  }
  
  .tag:active {
    background-color: rgba(0, 0, 0, 0.08);
    transition: background-color 0.2s ease;
  }
}

/* Ajustes de transição para telas entre 540px e 599px */
@media screen and (max-width: 599px) and (min-width: 541px) {
  .post-image {
    height: 220px;
  }
  
  .post-title {
    font-size: 1.6rem;
  }
  
  .post-summary {
    font-size: 0.95rem;
  }
  
  .post-meta {
    gap: 0.8rem;
  }
  
  .tag {
    padding: 0.2rem 0.6rem;
    font-size: 0.75rem;
  }
}
</style>