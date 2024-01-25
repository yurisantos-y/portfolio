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
}

.cardProjeto{
  width: 150px;
  height: 150px;
  background-color: $cor-primaria;
  margin-right: 10px;
}
</style>
