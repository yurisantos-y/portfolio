// ...existing code...

async function fetchPosts() {
  try {
    // Corrigir a consulta Supabase
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(name, avatar_url), post_tags(tag_id, tags(name))')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    posts.value = data || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// ...existing code...
