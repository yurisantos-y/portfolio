<script>
  export default {
    methods: {
      setLocale(locale) {
        this.$i18n.locale = locale;
      }
    }
  }

</script>


<template>
  <div class="navbar">
    <nav class="nav-container">
      <div class="left-links">
        <RouterLink class="linknb" to="/about">{{ $t( 'navbar.about' ) }}</RouterLink>
        <RouterLink class="linknb" to="/">{{ $t( 'navbar.contact' ) }}</RouterLink>
        <RouterLink class="linknb" to="/">{{ $t( 'navbar.blog' ) }}</RouterLink>
      </div>
      <div class="center-logo">
        <img id="logonb" src="../assets/logo.png" alt="">
      </div>
      <div class="right-links">
        <RouterLink class="linknb" to="/">{{ $t( 'navbar.cv' ) }}</RouterLink>
        <RouterLink class="linknb" to="/">{{ $t( 'navbar.projects' ) }}</RouterLink>
        <button class="linknb" id="btn" @click="setLocale('en')">
          <img id="btnlanguage" src="../assets/language.png" alt="">
        </button>
      </div>
    </nav>
  </div>
</template>

<style lang="scss">
@import '../scss/style.scss';

.navbar {
  position: absolute;
  background-color: $cor-dark;
  width: 80vw;
  max-width: 1180px;
  margin: 30px auto 0;
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
}

#logonb {
  max-width: 3.5rem;
  max-height: 3.5rem;
  width: auto;
  height: auto;
}

#btn{
  background-color: transparent;
  border: none;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1.5rem;
  cursor: pointer;
}

#btnlanguage{
  width: 2rem;
  height: 2rem;
}


</style>
