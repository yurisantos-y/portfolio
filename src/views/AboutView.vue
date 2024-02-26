<template>
  <div class="container">
    <div class="text">
      <h1>{{ $t('textAbout.title') }}</h1>
      <p>{{ $t('textAbout.desc') }}</p>
      <a href="mailto:yuri01.sp@gmail.com">
        <button class="contrate">{{ $t('textAbout.btn') }}</button>
      </a>

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

.text p {
  color: $icon-off;
  font-size: 1.2rem;
  line-height: 200%;
  max-width: 70%;
  margin: 0 auto;
  margin-bottom: 55px;
}

.contrate {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  border: none;
  font-weight: 800;
  font-size: 1rem;
  background-color: $cor-primaria;
  color: $cor-light;
  border-radius: 4px;
  padding: 20px 32px;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}

.contrate:hover {
  scale: 1.2;
  background-color: $hover;
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
