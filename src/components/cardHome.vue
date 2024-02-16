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
    
    <!-- Repeat the card structure for other projects -->
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

  <style lang="scss">
  @import '../scss/style.scss';

.card-container {
  display: flex; /* Alteração para flexbox */
  justify-content: center; /* Alinha os itens no centro horizontalmente */
  gap: 20px; /* Espaçamento entre os cards */
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 720px;
  overflow: hidden;
  border-radius: 16px;
}

.cardProjeto {
  position: relative;
  width: 450px;
  height: 450px;
  max-width: 450px;
  max-height: 450px;
  border-radius: 16px;
  margin: 0 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

.cardProjeto .card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  position: absolute;
  transition: transform 0.3s ease-in;
}

.cardProjeto:hover .card-image {
  transform: scale(1.2);
  filter: blur(10px) brightness(0.5);
}

.cardProjeto .tela {
  width: 95%;
  height: 170px;
  backdrop-filter: blur(10px);
  margin: auto;
  margin-top: 10px;
  border-radius: 10px;
  border: 0.5px solid $cor-light;
  z-index: 2;
  animation: fadeInUp .3s ease-in;
}

.cardProjeto .description {
  width: 100%;
  height: 260px;
  backdrop-filter: blur(90px);
  margin: auto;
  margin-top: 10px;
  border-radius: 16px;
  color: $cor-light;
  z-index: 3;
  animation: fadeInUp .3s ease-in;
}

.cardProjeto .description,
.cardProjeto .tela {
  display: none;
}

.cardProjeto:hover .tela,
.cardProjeto:hover .description {
  display: block;
}

.cardProjeto .conteudoTela {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.cardProjeto .btnTela {
  border: 0.5px solid $cor-light;
  padding: 10px;
  background-color: transparent;
  color: $cor-light;
  border-radius: 6px;
  transition: .3s;
  cursor: pointer;
}

.cardProjeto .btnTela:hover {
  backdrop-filter: blur(2px);
  scale: 1.1;
}

.cardProjeto .description {
  text-align: center;
}

.cardProjeto .description h1 {
  font-size: 2rem;
  font-weight: 500;
}

.cardProjeto .description p {
  margin-bottom: 2%;
  font-size: 0.9em;
  font-weight: 300;
  text-align: left;
  padding: 12px;
}

.cardProjeto #listaDescription {
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin: auto;
}

.cardProjeto #listaDescription ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.cardProjeto #listaDescription li {
  display: inline-block;
  background-color: $bgcard;
  width: 170px;
  height: 32px;
  border-radius: 6px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
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

@media (max-width: 960px) {
  .card-container {
    display: flex; /* Alteração para flexbox */
    flex-wrap: wrap; /* Permite que os itens flexíveis sejam dispostos em várias linhas */
    justify-content: center; /* Alinha os itens no centro horizontalmente */
    gap: 20px; /* Espaçamento entre os cards */
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 720px;
    overflow: hidden;
    border-radius: 16px;
  }
  
  .card-content {
    position: relative;
    width: 100%;
    max-width: 450px;
    height: 450px;
    max-height: 450px;
    border-radius: 16px;
    margin: 0 10px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease-in-out;
  }
}  
  </style>
