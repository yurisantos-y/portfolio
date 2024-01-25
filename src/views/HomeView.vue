<script setup>

</script>

<template>
  <div class="home-container">
    <h1>Olá! 👋 <br>
    Eu sou <span>Yuri Santos</span></h1>
    <p>
      Sou estudante de Ciência da Computação na UTFPR (Universidade <br>
      Tecnológica Federal do Paraná), com foco de aprendizado em front-end e <br>
       ciência de dados.
    </p>
    <div class="linkLP">
      <button>
        <a href="google.com"><img src="" alt="">link</a>
      </button>
    </div>
  </div>


  <div class="corpo">

  </div>

</template>

<style lang="scss">
@import '../scss/style.scss';

.home-container{
  height: 90vh;
  width: 100%;
  background-color: $cor-light;
  border-radius: 0 0 60px 60px;
  overflow-x: hidden;
}

.corpo{
  height: 2000px;
  background-color: $cor-dark;
}


</style>
