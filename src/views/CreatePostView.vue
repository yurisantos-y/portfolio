// ...existing code...

async function fetchTags() {
  try {
    // Corrigir a consulta Supabase
    const { data, error } = await supabaseClient
      .from('tags')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    tags.value = data || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
  }
}

// ...existing code...

async function savePost() {
  try {
    // Verificar autenticação explicitamente
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    // Verificar se o usuário no objeto session está presente
    if (!session.user) {
      throw new Error('User data missing from session');
    }
    
    // Adicionar o ID do usuário ao post
    const postData = {
      title: post.value.title,
      content: post.value.content,
      user_id: session.user.id,
      // outros campos necessários
    };
    
    const { data, error } = await supabaseClient
      .from('posts')
      .insert([postData])
      .select();
    
    if (error) throw error;
    
    // Se tags foram selecionadas, adicionar relações post-tag
    if (selectedTags.value.length > 0) {
      const tagRelations = selectedTags.value.map(tagId => ({
        post_id: data[0].id,
        tag_id: tagId
      }));
      
      const { error: relError } = await supabaseClient
        .from('post_tags')
        .insert(tagRelations);
      
      if (relError) throw relError;
    }
    
    // Redirecionar ou mostrar mensagem de sucesso
    // ...
  } catch (error) {
    console.error('Error saving post:', error);
    alert(`Failed to save post: ${error.message}`);
  }
}

// ...existing code...
