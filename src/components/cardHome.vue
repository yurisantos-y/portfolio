<template>
  <div class="card-container">
    <div class="cardProjeto">
      <div class="tela">
        <div class="conteudoTela">
          <button class="btnTela">website</button>
        </div>
      </div>
      <div class="description">
          <h1>LinkBio</h1>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum provident rem impedit,
                ratione nihil perspiciatis sed tenetur dolorem temporibus cum quos voluptate et expedita
                quaerat? Sed, harum! Vitae, quam necessitatibus?</p>
            <div id="listaDescription">
              <ul>
                <li>Oi</li>
                <li>Oi</li>
                <li>Oi</li>
                <li>Oi</li>
              </ul>
            </div>
      </div>
    </div>
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
  top: 85%;
}

.cardProjeto {
  position: relative;
  width: 450px;
  height: 450px;
  max-width: 450px;
  max-height: 450px;
  background-image: url('../assets/projeto1.jpeg');
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 16px;
  margin-right: 10px;
  overflow: hidden;

  .tela {
    width: 95%;
    height: 170px;
    backdrop-filter: blur(10px);
    margin: auto;
    margin-top: 10px;
    border-radius: 10px;
    border: 0.5px solid $cor-light;
  }

  .description {
    width: 100%;
    height: 260px;
    backdrop-filter: blur(90px);
    margin: auto;
    margin-top: 10px;
    border-radius: 16px;
    color: $cor-light;
  }  

  .description,
  .tela{
    display: none;
/*animation-name: slide;
    animation-duration: .3s;
    animation-timing-function: ease-in;
    animation-fill-mode: forwards; */
    animation: slide 1s ease forwards;
  }

  &:hover {
    .tela,
    .description {
      display: block;
    }
  }

}

.conteudoTela{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.btnTela {
  border: 0.5px solid $cor-light;
  padding: 10px;
  background-color: transparent;
  color: $cor-light;
  border-radius: 6px;
  transition: .3s;
  cursor: pointer;
}

.btnTela:hover{
  backdrop-filter: blur(2px);
  scale: 1.1;
}

.description{
  text-align: center;
}

.description h1{
  font-size: 2rem;
  font-weight: 500;
}

.description p{
  margin-bottom: 2%;
  font-size: 0.9em;
  font-weight: 300;
  text-align: left;
  padding: 12px;
}

#listaDescription {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: auto;
}

#listaDescription ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

#listaDescription li {
  display: inline-block;
  background-color: $icon-off;
  width: 170px;
  height: 32px;
  border-radius: 6px;
  text-align: center;
  margin: 5px;
}


@keyframes slide {
  to{
    opacity: 1;
  }
}
</style>
    