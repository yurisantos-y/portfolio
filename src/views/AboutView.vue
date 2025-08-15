<template>
  <div class="about-container">
    <div class="content">
      <h1>{{ $t('textAbout.title') }}</h1>
      <p>{{ $t('textAbout.desc') }}</p>
      <a href="mailto:yuri01.sp@gmail.com">{{ $t('textAbout.btn') }}</a>
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

.about-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #ffffff;
}

.content {
  max-width: 600px;
  text-align: center;
}

h1 {
  font-size: 1.5rem;
  font-weight: 400;
  color: #000000;
  margin-bottom: 2rem;
  letter-spacing: 0.5px;
}

p {
  font-size: 1rem;
  line-height: 1.6;
  color: #666666;
  margin-bottom: 2rem;
  font-weight: 300;
}

a {
  color: #000000;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 400;
  border-bottom: 1px solid #000000;
  padding-bottom: 2px;
  transition: opacity 0.2s ease;
}

a:hover {
  opacity: 0.6;
}

@media (max-width: 768px) {
  .about-container {
    padding: 1rem;
  }
  
  h1 {
    font-size: 1.3rem;
  }
  
  p {
    font-size: 0.9rem;
  }
}
</style>
