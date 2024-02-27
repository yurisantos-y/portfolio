<template>
  <div class="container">
    <div class="text">
      <img src="../assets/logo.png" alt="logo em Y laranja">
      <h2>{{ $t('thank.text') }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView',
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
    },
  },
};
</script>

<style lang="scss">
@import '../scss/style.scss';

.container {
  width: 100vw;
  height: 100vh;
  background-color: $cor-light;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container a {
  text-decoration: none;
}

.text {
  display: inline;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: $cor-textDark;
}

.text h1 {
  margin-top: 8%;
  font-size: 2.8rem;
  margin-bottom: 20px;
}
.text img {
  width: 30%;
}

@media (max-width: 768px) {
  .text h1 {
    font-size: 2rem;
  }

  .text p {
    font-size: 1rem;
    max-width: 90%;
    margin-bottom: 40px;
  }

  .contrate {
    font-size: 0.9rem;
    padding: 16px 28px;
  }
}

@media (max-width: 480px) {
  .text h1 {
    font-size: 1.8rem;
  }

  .text p {
    font-size: 0.9rem;
    max-width: 100%;
    margin-bottom: 30px;
  }

  .contrate {
    font-size: 0.8rem;
    padding: 12px 24px;
  }
}
</style>
