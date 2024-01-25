<template>
  <div class="navbar">
    <nav class="nav-container">
      <div class="left-links">
        <RouterLink class="linknb" to="/about">Sobre</RouterLink>
        <RouterLink class="linknb" to="/">Contato</RouterLink>
        <RouterLink class="linknb" to="/">Blog</RouterLink>
      </div>
      <div class="center-logo">
        <img id="logonb" src="../assets/logo.png" alt="">
      </div>
      <div class="right-links">
        <RouterLink class="linknb" to="/">Download CV</RouterLink>
        <RouterLink class="linknb" to="/">Projetos</RouterLink>
        <img id="languagenb" src="../assets/language.png" alt="">
      </div>
    </nav>
  </div>
</template>

<style lang="scss">
@import '../scss/style.scss';

.navbar {
  background-color: $cor-dark;
  width: 80vw;
  max-width: 1420px;
  margin: 30px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.5rem;
  border-radius: 4rem;
  font-weight: 200;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.left-links,
.right-links {
  display: flex;
}

.center-logo {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.linknb {
  color: $cor-light;
  padding: 1rem;  // Alterado para rem
  margin: 0 1rem;  // Alterado para rem
  text-decoration: none;
}

#logonb {
  max-width: 3.5rem;  // Alterado para rem
  max-height: 3.5rem;  // Alterado para rem
  width: auto;
  height: auto;
}

#languagenb{
  max-width: 2rem;  // Alterado para rem
  max-height: 2rem;  // Alterado para rem
  width: auto;
  height: auto;
  margin: auto;
}

</style>
