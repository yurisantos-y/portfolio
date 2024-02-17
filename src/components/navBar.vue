<template>
  <div class="navbar-wrapper">
    <div class="navbar">
      <div class="global">
        <div class="left-logo">
          <img id="logonb" src="../assets/logo.png" alt="" />
        </div>
    
        <nav class="nav-container">
          <div class="center-links">
            <RouterLink class="linknb" to="/" exact >{{ $t("navbar.home") }}</RouterLink>
            <RouterLink class="linknb" to="/about" exact >{{ $t("navbar.about") }}</RouterLink>
            <RouterLink class="linknb" to="/contact" exact >{{ $t("navbar.contact") }}</RouterLink>
            <RouterLink class="linknb" to="/blog" exact >{{ $t("navbar.blog") }}</RouterLink>
            <a class="linknb" href="../assets/cv/cv.pdf" download="cvYuri.pdf">{{ $t("navbar.cv") }}</a>
            <RouterLink class="linknb" to="/projects" exact >{{ $t("navbar.projects") }}</RouterLink>
          </div>
        </nav>
    
        <div class="right-language">
          <label for="btnLanguage" :class="{ 'active-flag': englishChecked }">
            <input type="checkbox" id="btnLanguage" v-model="englishChecked" @change="toggleLanguage" class="hidden-checkbox" />
            <input type="checkbox" id="btnLanguage" v-model="portugueseChecked" @change="toggleLanguage" class="hidden-checkbox" />
    
            <img v-if="englishChecked" id="btnlanguage" @click="toggleLanguage('en')" src="../assets/flag-brazil.svg" alt="" />
            <img v-else id="btnlanguage" @click="toggleLanguage('pt_BR')" src="../assets/flag-usa.svg" alt="" />
          </label>
        </div>
      </div>
    </div>
    <div class="esconde">
      <div class="mobile-menu" v-if="showMobileMenu">
        <div class="mobile-links">
          <RouterLink class="linknb" to="/" exact >{{ $t("navbar.home") }}</RouterLink>
          <RouterLink class="linknb" to="/about" exact >{{ $t("navbar.about") }}</RouterLink>
          <RouterLink class="linknb" to="/contact" exact >{{ $t("navbar.contact") }}</RouterLink>
          <RouterLink class="linknb" to="/blog" exact >{{ $t("navbar.blog") }}</RouterLink>
          <a class="linknb" href="../assets/cv/cv.pdf" download="cvYuri.pdf">{{ $t("navbar.cv") }}</a>
          <RouterLink class="linknb" to="/projects" exact >{{ $t("navbar.projects") }}</RouterLink>
        </div>
      </div>
      <div class="mobile-menu-toggle" @click="toggleMobileMenu">
        <span class="menu-icon"></span>
      </div>
    </div>
    
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  components: {
    RouterLink,
  },
  data() {
    return {
      englishChecked: false,
      showMobileMenu: false,
    };
  },
  methods: {
    toggleLanguage() {
      this.englishChecked = !this.englishChecked;
      const locale = this.englishChecked ? "en" : "pt_BR";
      this.setLocale(locale);
    },
    setLocale(locale) {
      this.$i18n.locale = locale;
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },
  },
};
</script>

<style lang="scss">
@import "../scss/style.scss";

.navbar-wrapper {
  display: flex;
  justify-content: center;
}

.esconde {
  display: none;
}

.navbar {
  position: absolute;
  display: flex;
  align-items: center;
  width: 78vw;
}

.global {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80vw;
  margin-right: 2%;
  margin-top: 1%;
}

.nav-container {
  background-color: $cor-dark;
  display: flex;
  align-items: center;
  height: 3.5rem;
  border-radius: 4rem;
  font-weight: 200;
  margin: 0 auto;
  max-width: 80vw;
}

.linknb {
  color: $cor-light;
  padding: 1rem;
  margin: 0 1rem;
  text-decoration: none;
  transition: 0.3s ease;
}

.linknb:hover {
  color: $cor-primaria;
}

.linknb.router-link-exact-active {
  color: $cor-primaria;
  font-weight: 500;
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

.right-language {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  filter: grayscale(100%);
}

.right-language label {
  display: flex;
  align-items: center;
  justify-items: center;
}

.right-language img {
  max-width: 35px;
}

.right-language:hover {
  filter: grayscale(0);
  transform: scale(1.2);
}

.mobile-menu-toggle {
  display: none;
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $cor-dark;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.mobile-links {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mobile-menu-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
}

.menu-icon,
.menu-icon::before,
.menu-icon::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: $cor-dark;
  transition: transform 0.3s ease;
}

.menu-icon::before {
  top: -6px;
}

.menu-icon::after {
  top: 6px;
}

.menu-icon.open {
  transform: rotate(45deg);
}

.menu-icon.open::before {
  transform: rotate(90deg);
  top: 0;
}

.menu-icon.open::after {
  transform: rotate(90deg);
  top: 0;
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }
  
  .navbar {
    display: none;
  }
  
  .esconde{
    display: block;
  }


  .mobile-menu {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>