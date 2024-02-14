<template>
  <div class="navbar">
    <nav class="nav-container">
      <div class="left-links">
        <RouterLink class="linknb" to="/about">{{ $t( 'navbar.home' ) }}</RouterLink>
        <RouterLink class="linknb" to="/about">{{ $t( 'navbar.about' ) }}</RouterLink>
        <RouterLink class="linknb" to="/contact">{{ $t( 'navbar.contact' ) }}</RouterLink>
        <RouterLink class="linknb" to="/blog">{{ $t( 'navbar.blog' ) }}</RouterLink>
      </div>
      <div class="center-logo">
        <img id="logonb" src="../assets/logo.png" alt="">
      </div>
      <div class="right-links" style="margin-left: auto;">
        <RouterLink class="linknb" to="/">{{ $t( 'navbar.cv' ) }}</RouterLink>
        <RouterLink class="linknb" to="/projects">{{ $t( 'navbar.projects' ) }}</RouterLink>
        
        <label for="btnLanguage" :class="{ 'active-flag': englishChecked }">
          <input type="checkbox" id="btnLanguage" v-model="englishChecked" @change="toggleLanguage('en')" class="hidden-checkbox">
          <input type="checkbox" id="btnLanguage" v-model="portugueseChecked" @change="toggleLanguage('pt_BR')" class="hidden-checkbox">
          
          <img v-if="englishChecked" id="btnlanguage" @click="toggleLanguage('en')" src="../assets/flag-brazil.svg" alt="">
          
          <img v-else id="btnlanguage" @click="toggleLanguage('pt_BR')" src="../assets/flag-usa.svg" alt="">
        </label>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      englishChecked: false
    };
  },
  methods: {
    toggleLanguage() {
      this.englishChecked = !this.englishChecked;
      const locale = this.englishChecked ? 'en' : 'pt_BR';
      this.setLocale(locale);
    },
    setLocale(locale) {
      this.$i18n.locale = locale;
    }
  },
};
</script>


<style lang="scss">
@import '../scss/style.scss';

.navbar {
  position: absolute;
  background-color: $cor-dark;
  width: 80vw;
  max-width: 1260px;
  margin: 20px auto 0;
  left: 50%;
  transform: translateX(-50%);
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

.right-links{
  margin: 0 2rem;
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
  padding: 1rem;
  margin: 0 1rem;
  text-decoration: none;
  transition: .3s ease;
}

.linknb:hover{
  color: $cor-primaria;
}

#logonb {
  max-width: 3.5rem;
  max-height: 3.5rem;
  width: auto;
  height: auto;
}

.hidden-checkbox {
  position: absolute;
  left: -9999px;
}

#btnlanguage {
  margin-top: 30%;
  max-width: 35px;
  cursor: pointer;
  transition: transform 0.3s ease;
  filter: grayscale(100%);
}

#btnlanguage:hover {
  filter: grayscale(0);
  transform: scale(1.2);
}

</style>
