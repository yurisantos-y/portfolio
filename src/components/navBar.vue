<template>
  <div class="navbar-wrapper">
    <div class="navbar">
      <div class="global">
        <div class="left-logo">
          <img id="logonb" src="../assets/logo.png" alt="" />
        </div>
    
        <nav class="nav-container">
          <div class="center-links">
            <RouterLink class="linknb" to="/about">{{ $t("navbar.home") }}</RouterLink>
            <RouterLink class="linknb" to="/about">{{ $t("navbar.about") }}</RouterLink>
            <RouterLink class="linknb" to="/contact">{{ $t("navbar.contact") }}</RouterLink>
            <RouterLink class="linknb" to="/blog">{{ $t("navbar.blog") }}</RouterLink>
            <RouterLink class="linknb" to="/">{{ $t("navbar.cv") }}</RouterLink>
            <RouterLink class="linknb" to="/projects">{{ $t("navbar.projects") }}</RouterLink>
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
  </div>
</template>



<script>
export default {
  data() {
    return {
      englishChecked: false,
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
  },
};
</script>


<style lang="scss">
@import "../scss/style.scss";

.navbar-wrapper {
  display: flex;
  justify-content: center;
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

@media (max-width: 768px) {
  .navbar {
    width: 90%;
  }

  .global {
    width: 90vw;
  }

  .nav-container {
    max-width: 700px;
  }
}

@media (max-width: 576px) {
  .navbar {
    width: 95%;
  }

  .global {
    width: 95vw;
  }

  .nav-container {
    max-width: 500px;
  }
}


</style>
