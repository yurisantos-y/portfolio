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
  width: 100%;
  max-width: 960px;
  //overflow-x: hidden;
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

  .card-container {
    max-width: 95%;
    margin-top: -8rem;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
  }
  
  .cardProjeto .description {
    padding: 1.5rem;
    /* Para dispositivos touch, mostrar a descrição parcialmente visível */
    transform: translateY(55px);
  }

  /* Em dispositivos touch, melhorar as interações */
  @media (hover: none) {
    .cardProjeto .description {
      transform: translateY(55px);
    }
    
    .cardProjeto .description p {
      max-height: 0;
      opacity: 0;
    }
    
    .cardProjeto:active .description {
      transform: translateY(0);
    }
    
    .cardProjeto:active .description p {
      max-height: 100px;
      opacity: 1;
      margin-bottom: 1rem;
    }
    
    .cardProjeto:active .btnTela {
      transform: translateY(0);
      opacity: 1;
      transition-delay: 0.1s;
    }
    
    .cardProjeto:active .description-list {
      transform: translateY(0);
      opacity: 1;
      transition-delay: 0.2s;
    }
    
    .cardProjeto:active .card-image {
      filter: brightness(0.3);
    }
    
    .cardProjeto:active .tela {
      opacity: 1;
    }
  }

@media screen and (max-width: 1600px) {
  .card-container {
    max-width: 95%;
    margin-top: 2rem;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
  }
  
}

@media screen and (max-width: 1030px) {
  .card-container {
    max-width: 95%;
    margin-top: -5rem;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
  }
  
}

@media screen and (max-width: 1024px) {
  .card-container {
    max-width: 95%;
    margin-top: -12rem;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
  }
  
}

@media screen and (max-width: 878px) {
  .card-container {
    max-width: 95%;
    margin-top: -19rem;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
  }
  
}

@media screen and (max-width: 480px) {
  .cardProjeto {
    height: 250px;
  }
  
  .cardProjeto .description h2 {
    font-size: 1.3rem;
  }
  
  .cardProjeto .description p {
    font-size: 0.8rem;
  }
  
  .description-list li {
    padding: 3px 10px;
    font-size: 0.7rem;
  }
  
  .cardProjeto .conteudoTela {
    padding-top: 4rem;
  }
  
  .cardProjeto .btnTela {
    padding: 10px 20px;
    font-size: 0.85rem;
  }
  
  /* Pré-carrega parte da descrição para visibilidade imediata */
  .cardProjeto .description h2 {
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .card-container {
    max-width: 95%;
    margin-top: -24rem;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
  }
}


@media screen and (max-width: 375px) {
  .card-container {
    max-width: 95%;
    margin-top: -24rem;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
  }

  .cardProjeto {
    height: 220px;
  }
  
  .cardProjeto .description {
    padding: 1rem;
    transform: translateY(45px);
  }
  
  .cardProjeto .description h2 {
    font-size: 1.2rem;
    margin-bottom: 0.3rem;
  }
  
  .description-list {
    margin-top: 0.8rem;
    gap: 5px;
  }
  
  .cardProjeto .conteudoTela {
    padding-top: 3rem;
  }
}

@media screen and (max-width: 360px) {
  .card-container {
    max-width: 95%;
    margin-top: -24rem;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
  }
  
  .cardProjeto {
    height: 210px;
    margin: 0;
  }
  
  .cardProjeto .description {
    transform: translateY(55px);
  }
  
  .cardProjeto .btnTela {
    padding: 8px 16px;
    font-size: 0.75rem;
  }
  
  .description-list {
    gap: 4px;
  }
  
  .description-list li {
    padding: 3px 8px;
    font-size: 0.65rem;
  }
}

@media screen and (max-width: 320px) {

  .card-container {
    max-width: 95%;
    margin-top: -12rem;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
  }
  
  .cardProjeto {
    height: 190px;
  }
  
  .cardProjeto .description h2 {
    font-size: 1.1rem;
    margin-bottom: 0.2rem;
  }
  
  .cardProjeto .description p {
    font-size: 0.75rem;
    line-height: 1.3;
  }
  
  .cardProjeto .btnTela {
    padding: 6px 14px;
    font-size: 0.7rem;
  }
  
  .description-list li {
    padding: 2px 6px;
    font-size: 0.6rem;
  }
  
  .cardProjeto .conteudoTela {
    padding-top: 2.5rem;
  }
}
</style>