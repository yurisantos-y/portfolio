<template>
  <div class="navbar">
    <nav>
      <RouterLink class="linknb" to="/about">Sobre</RouterLink>
      <RouterLink class="linknb" to="/">Contato</RouterLink>
      <RouterLink class="linknb" to="/">Blog</RouterLink>
      <img src="" alt="">
      <RouterLink class="linknb" to="/">DownloadCV</RouterLink>
      <RouterLink class="linknb" to="/">Projetos</RouterLink>
    </nav>
  </div>
</template>

<script>

</script>

<style lang="scss">
@import '../scss/style.scss';

.navbar{
  background-color: $cor-dark;
  width: 85%;
  max-width: 1000px;
  margin: 30px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  border-radius: 40px;
}

.linknb{
  color: $cor-light;
  padding: 30px;
  text-decoration: none;
}


</style>