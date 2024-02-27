<template>
  <div class="container">
    <div class="loading">
      <h1>{{ $t('construction.text') }}</h1>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>

</script>

<style lang="scss">
@import '../scss/style.scss';

.container{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: $cor-light;
}

.loading {
  width: 70%;
  max-width: 70%;
}

.loading h1{
  display: inline;
  margin: 0 auto;
  font-size: 5rem;
  color: $cor-textDark;
}

.loading span{
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: $cor-textDark;
  margin: 0 auto;
  animation: bounce .6s cubic-bezier(0.6, 0.1, 1, 0.4);
  animation-iteration-count: infinite;
  animation-direction: alternate;
  margin-bottom: 10px;
  margin-left: 2%;
}

.loading span:nth-child(1) {
  animation-delay: .1s;
}

.loading span:nth-child(2) {
  animation-delay: .2s;
}

.loading span:nth-child(3) {
  animation-delay: .3s;
}

@keyframes bounce {
  to{
    transform: translateY(50px);
  }
}

@media screen and (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  
  .loading {
    width: 100%;
    max-width: 100%;
  }
  
  .loading h1 {
    font-size: 3rem;
  }
}

</style>