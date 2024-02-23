<template>
  <div>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span @click="showModal = false" class="close">&times;</span>
        <!-- Conteúdo do Modal -->
        <h2>Informações de Contato</h2>
        <p>Email: exemplo@email.com</p>
        <p>Telefone: (XX) XXXX-XXXX</p>
        <!-- Outras informações de contato -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: true // Defina como true para que o modal seja exibido inicialmente
    };
  }
};
</script>

<style>
/* Estilos para o modal */
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaaaaa;
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
</style>
