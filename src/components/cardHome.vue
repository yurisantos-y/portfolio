<template>
  <div class="card-container">
    <div class="cardProjeto">
      <div class="card-content">
        <img src="../assets/projeto1.jpeg" alt="Projeto 1" class="card-image">
        <div class="card-details">
          <div class="tela">
            <div class="conteudoTela">
              <a href="https://yurisantos-y.github.io/linkbio/" target="_blank">
                <button class="btnTela">{{ $t('card.titlebtn')}}</button>
              </a>
            </div>
          </div>
          <div class="description">
            <h2>LinkBio</h2>
            <p>{{ $t('card.linkbioDesc')}}</p>
            <ul class="description-list">
              <li>HTML</li>
              <li>CSS</li>
              <li>JavaScript</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="cardProjeto">
      <div class="card-content">
        <img src="../assets/projeto2.jpeg" alt="Projeto 2" class="card-image" id="secondProject">
        <div class="card-details">
          <div class="tela">
            <div class="conteudoTela">
              <a href="https://prosperecf.com.br/" target="_blank">
                <button class="btnTela">{{ $t('card.titlebtn')}}</button>
              </a>
            </div>
          </div>
          <div class="description">
            <h2>Prosperecf</h2>
            <p>{{ $t('card.prosperecfDesc')}}</p>
            <ul class="description-list">
              <li>HTML</li>
              <li>CSS</li>
              <li>JavaScript</li>
              <li>PHP</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
// Using regular script tag instead of script setup to avoid TypeScript errors
// with the global $t function
export default {
  name: 'CardHome'
}
</script>

<style lang="scss">
@import '../scss/style.scss';

.card-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 90%;
  overflow: visible;
}

.cardProjeto {
  position: relative;
  width: 450px;
  height: 400px;
  max-width: 85vw;
  border-radius: 16px;
  margin: 0 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.cardProjeto:hover {
  transform: translateY(-15px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  position: absolute;
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1), filter 0.5s ease;
}

.cardProjeto:hover .card-image {
  transform: scale(1.05);
  filter: brightness(0.3);
}

.cardProjeto .tela {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 2;
}

.cardProjeto:hover .tela {
  opacity: 1;
}

.cardProjeto .conteudoTela {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start; /* Mantém o alinhamento no topo */
  justify-content: center; /* Centraliza horizontalmente */
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 6rem; /* Alterado para 1rem conforme solicitado */
}

.cardProjeto .btnTela {
  border: 1px solid $cor-light;
  padding: 12px 24px;
  background-color: transparent;
  color: $cor-light;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  transform: translateY(20px);
  opacity: 0;
}

.cardProjeto:hover .btnTela {
  transform: translateY(0);
  opacity: 1;
  transition-delay: 0.1s;
}

.cardProjeto .btnTela:hover {
  background-color: $cor-light;
  color: $cor-primaria;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
}

.cardProjeto .description {
  position: absolute;
  width: 100%;
  padding: 2rem;
  bottom: 0;
  left: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, transparent 100%);
  color: $cor-light;
  z-index: 3;
  transform: translateY(70px);
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  text-align: left;
}

.cardProjeto:hover .description {
  transform: translateY(0);
}

.cardProjeto .description h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: $cor-light;
  letter-spacing: -0.3px;
}

.cardProjeto .description p {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.5;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.6s ease, opacity 0.6s ease, margin 0.6s ease;
}

.cardProjeto:hover .description p {
  max-height: 100px;
  opacity: 1;
  margin-bottom: 1rem;
}

.description-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 1rem;
  transform: translateY(10px);
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;
  transition-delay: 0s;
}

.cardProjeto:hover .description-list {
  transform: translateY(0);
  opacity: 1;
  transition-delay: 0.2s;
}

.description-list li {
  padding: 4px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  color: $cor-light;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  list-style: none;
}

.description-list li:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(200px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media screen and (max-width: 960px) {
  .card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  @media screen and (max-width: 760px) {
    .card-container{
      margin-top: -15%;
      max-width: 90vw;
    }
  }

  @media screen and (max-width: 536px) {

    .card-container{
      margin-top: -35%;
      max-width: 90vw;
    }

  }

  @media screen and (max-width: 360px) {

    .card-container{
      margin-top: -50%;
      max-width: 90vw;
    }
  }
}  
  </style>