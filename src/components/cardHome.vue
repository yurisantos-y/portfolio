<script>
</script>

<template>
  <div class="card-container">
    <div class="cardProjeto"></div>
    <div class="cardProjeto"></div>
  </div>
</template>

<style lang="scss">
@import '../scss/style.scss';

.card-container {
  display: flex;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 580px;
}

.cardProjeto{
  width: 450px;
  height: 450px;
  background-color: $cor-primaria;
  border-radius: 16px;
  margin-right: 10px;
}
</style>
