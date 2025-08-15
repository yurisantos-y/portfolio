<template>
  <div :class="['navbar-wrapper', { 'dashboard-hide': isDashboardRoute }]">
    <div class="navbar">
      <div class="global">
        <div class="left-logo">
          <img id="logonb" src="../assets/logo.png" alt="" />
        </div>
    
        <nav class="nav-container">
          <div class="center-links">
            <RouterLink class="linknb" to="/" exact >{{ $t("navbar.home") }}</RouterLink>
            <RouterLink class="linknb" to="/about" exact >{{ $t("navbar.about") }}</RouterLink>
            
          
            <button id="btnChamadaModal" @click="showModal = true" class="linknb">{{ $t('navbar.contact') }}</button>

            <!-- <RouterLink class="linknb" to="/blog" exact >{{ $t("navbar.blog") }}</RouterLink> -->
            <a class="linknb" href="/cv/cv.pdf" download="cvYuri.pdf">{{ $t("navbar.cv") }}</a>
            <!-- <RouterLink class="linknb" to="/projects" exact >{{ $t("navbar.projects") }}</RouterLink> -->
          </div>
        </nav>
    
        <div class="right-language">
          <label for="btnLanguage" :class="{ 'active-flag': englishChecked }">
            <input type="checkbox" id="btnLanguage" v-model="englishChecked" @change="toggleLanguage" class="hidden-checkbox" />
    
            <img v-if="englishChecked" id="btnlanguage" @click="toggleLanguage" src="../assets/flag-brazil.svg" alt="Switch to Portuguese" />
            <img v-else id="btnlanguage" @click="toggleLanguage" src="../assets/flag-usa.svg" alt="Switch to English" />
          </label>
        </div>
      </div>
    </div>
    <div class="esconde">
      <div class="mobile-menu" v-if="showMobileMenu">
        <div class="mobile-links">
          <RouterLink class="linknb-mobile" to="/" exact >{{ $t("navbar.home") }}</RouterLink>
          <RouterLink class="linknb-mobile" to="/about" exact >{{ $t("navbar.about") }}</RouterLink>
          <button id="btnChamadaModalMB" class="linknb-mobile" @click="closeMobileMenuAndOpenModal">{{ $t('navbar.contact') }}</button>
          <!-- <RouterLink class="linknb-mobile" to="/blog" exact >{{ $t("navbar.blog") }}</RouterLink> -->
          <a class="linknb-mobile" href="/cv/cv.pdf" download="cvYuri.pdf">{{ $t("navbar.cv") }}</a>
          <!-- <RouterLink class="linknb-mobile" to="/projects" exact >{{ $t("navbar.projects") }}</RouterLink> -->

          <div class="right-language-mobile">
            <label for="btnLanguageMobile" :class="{ 'active-flag': englishChecked }">
              <input type="checkbox" id="btnLanguageMobile" v-model="englishChecked" @change="toggleLanguage" class="hidden-checkbox" />
              <img v-if="englishChecked" id="btnlanguage-mobile" @click="toggleLanguage" src="../assets/flag-brazil.svg" alt="Switch to Portuguese" />
              <img v-else id="btnlanguage-mobile" @click="toggleLanguage" src="../assets/flag-usa.svg" alt="Switch to English" />
            </label>
          </div>
        </div>
      </div>
      <div class="mobile-menu-toggle" @click="toggleMobileMenu">
        <span class="menu-icon"></span>
      </div>
    </div>
    
  </div>
  <!-- Modal -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span @click="showModal = false" class="close">&times;</span>
      <div class="interface">
        <h3>{{ $t('modal.contact') }}</h3>
        <form action="https://formsubmit.co/5186def9e62998af58e1d57e3a5b8cab" method="POST">
          <input type="text" name="name" id="name" :placeholder="$t('modal.nameFull')" required>

          <input type="email" name="email" id="email" :placeholder="$t('modal.email')" required>
          <input type="tel" name="phone" id="phone" :placeholder="$t('modal.phone')">
          <textarea name="message" id="message" :placeholder="$t('modal.msg')" required></textarea>
          <button type="submit" class="btn-enviar">{{ $t('modal.btn') }}</button>

          <input type="hidden" name="_next" value="https://yurisantos-y.vercel.app/thank">

     </form>
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
      showModal: false,
    };
  },
  computed: {
    // Add a computed property to check if we're on the dashboard route
    isDashboardRoute() {
      return this.$route.path.includes('/dashboard');
    },
    // Add computed property for portugueseChecked to fix the Vue warning
    portugueseChecked() {
      return !this.englishChecked;
    }
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
      const menuIcon = document.querySelector('.menu-icon');
      menuIcon.classList.toggle('open');
    },
    closeMobileMenuOnRouteChange() {
      this.showMobileMenu = false;
      const menuIcon = document.querySelector('.menu-icon');
      menuIcon.classList.remove('open');
    },
    openModal() {
      this.showModal = true;
    },
    closeMobileMenuAndOpenModal() {
      this.showMobileMenu = false; // fechar o menu móvel
      this.showModal = true; // abrir o modal
    },
  },
  mounted() {
    this.$router.afterEach(() => {
      this.closeMobileMenuOnRouteChange();
    });
  },
  computed: {
    // Add a computed property to check if we're on the dashboard route
    isDashboardRoute() {
      return this.$route.path.includes('/dashboard');
    },
    // Add computed property for portugueseChecked to fix the Vue warning
    portugueseChecked() {
      return !this.englishChecked;
    }
  }
};
</script>



<style lang="scss">
@import "../scss/style.scss";

.navbar-wrapper {
  display: flex;
  justify-content: center;
  
  &.dashboard-hide {
    display: none;
  }
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
  margin-top: 2.5%;
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

.linknb:hover, #btnChamadaModal:hover, #btnChamadaModalMB:hover {
  color: $cor-primaria;
}

.linknb.router-link-exact-active,
.linknb-mobile.router-link-exact-active
  {
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

//Menu Mobile

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

.mobile-links{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.mobile-menu-toggle {
  position: absolute;
  top: 2.3rem;
  right: 1.5rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
}

.right-language-mobile img{
  margin-top: 35px;
}

.right-language-mobile:hover {
  filter: grayscale(0);
  transform: scale(1.2);
}

.linknb-mobile{
  color: $cor-light;
  padding: 1rem;
  margin: 0 1rem;
  text-decoration: none;
  margin-bottom: 25px;
}

#btnChamadaModalMB {
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: $cor-light;
  font-weight: 400;
  font-size: 1rem;
  transition: 0.3s ease;
}

.menu-icon,
.menu-icon::before,
.menu-icon::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 3px;
  background-color: $cor-dark;
  transition: transform .3s ease;
}


.menu-icon::before {
  top: -6px;
}

.menu-icon::after {
  top: 6px;
}

.menu-icon.open {
  background-color: $cor-light;
  transform: rotate(45deg);
}

.menu-icon.open::before {
  background-color: $cor-light;
  transform: rotate(90deg);
  top: 0;
}

.menu-icon.open::after {
  background-color: $cor-light;
  transform: rotate(90deg);
  top: 0;
}

//Modal

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: $bgmodal;
}

#btnChamadaModal {
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: $cor-light;
  font-weight: 200;
  font-size: 1rem;
  transition: 0.3s ease;
}


.modal-content {
  background-color: $cor-light;
  margin: 5% auto;
  padding: 20px;
  border-radius: 16px;
  width: 60%;
  overflow: hidden;
}

.interface h3 {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding-bottom: 20px;
}

form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

input, 
textarea {
  width: 80%;
  padding: 1.25rem;
  margin-bottom: 1rem;
  color: $cor-textDark;
  border: .7px solid $icon-off;
  border-radius: 6px;
  transition: border-color .3s, box-shadow .3s;
}

input:hover, input:focus,
textarea:hover, textarea:focus {
  outline: none;
  border-color: $cor-primaria;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.201);
}

textarea {
  min-height: 12.5rem;
  resize: vertical;
}

.btn-enviar {
  border: none;
  width: 80%;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  background-color: $cor-primaria;
  color: $cor-light;
  transition: .3s ease-in-out;
}

.btn-enviar:hover,
.btn-enviar:focus {
  outline: none;
  transform: scale(1.1);
  box-shadow: 0px 0px 8px $shadow;
}

.btn-enviar:disabled {
  cursor: not-allowed;
  background-color: $icon-off;
}

.close {
  color: #aaaaaa;
  margin-top: -20px;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.success, 
.erroe {
  text-align: center;
}

.success {
  color: greenyellow;
}

.error {
  color: tomato;
}

@media screen and (max-width: 1050px){
  .nav-container{
    font-size: 14px;
    margin: 0 1rem;
  }

  .linknb {
    padding: 0;
  }
}

@media (max-width: 789px) {
  .mobile-menu-toggle {
    display: block;
  }
  
  .nav-container{
    display: none;
  }

  .right-language{
    display: none;
  }

  .global {
    display: flex;
    justify-content: flex-start;
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
