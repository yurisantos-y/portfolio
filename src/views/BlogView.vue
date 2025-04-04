<template>
  <div class="blog-container">
    <header class="blog-header">
      <h1>{{ $t('blog.title') || 'Blog' }}</h1>
      <p class="subtitle">{{ $t('blog.subtitle') || 'Pensamentos, ideias e insights' }}</p>
    </header>

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
          <div class="post-meta">
            <span class="post-date">{{ formatDate(post.published_at) }}</span>
            <div class="post-tags" v-if="post.tags && post.tags.length">
              <span v-for="tag in post.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
            </div>
          </div>
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-summary">{{ post.summary }}</p>
          <router-link :to="`/blog/${post.slug || post.id}`" class="read-more" @click.stop>
            {{ $t('blog.readMore') || 'Ler mais' }}
          </router-link>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient';
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
    return format(new Date(dateString), 'dd/MM/yyyy');
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

.blog-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 2rem;
  min-height: 80vh;
}

.blog-header {
  text-align: center;
  margin-bottom: 4rem;
  
  h1 {
    font-size: 3rem;
    font-weight: 800;
    color: $cor-textDark;
    margin-bottom: 1rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
    color: $text-gray;
    max-width: 600px;
    margin: 0 auto;
  }
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.post-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
}

.post-image {
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
}

.post-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.post-date {
  font-size: 0.9rem;
  color: $text-gray;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  .tag {
    padding: 0.25rem 0.75rem;
    background-color: rgba($cor-primaria, 0.1);
    color: $cor-primaria;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }
}

.post-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: $cor-textDark;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.post-summary {
  color: $text-gray;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.read-more {
  display: inline-block;
  color: $cor-primaria;
  font-weight: 600;
  text-decoration: none;
  position: relative;
  align-self: flex-start;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: $cor-primaria;
    transition: width 0.3s ease;
  }
  
  &:hover:after {
    width: 100%;
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

.error-message, .no-posts {
  text-align: center;
  padding: 4rem 2rem;
  color: $cor-textDark;
  font-size: 1.2rem;
  background-color: rgba(#f5f5f5, 0.8);
  border-radius: 12px;
}

.error-message {
  background-color: rgba(#ff5757, 0.08);
  border: 1px solid rgba(#ff5757, 0.2);
  color: #ff5757;
}

@keyframes bounce {
  to {
    transform: translateY(16px);
    opacity: 0.3;
  }
}

@media screen and (max-width: 768px) {
  .blog-header h1 {
    font-size: 2.4rem;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
  
  .post-image {
    height: 180px;
  }
  
  .post-title {
    font-size: 1.4rem;
  }
}

@media screen and (max-width: 480px) {
  .blog-container {
    padding: 3rem 1.25rem;
  }
  
  .blog-header {
    margin-bottom: 2rem;
    
    h1 {
      font-size: 2rem;
    }
    
    .subtitle {
      font-size: 1rem;
    }
  }
  
  .post-content {
    padding: 1rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>