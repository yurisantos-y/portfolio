<script setup>
import cardHome from '../components/cardHome.vue'
import { ref, onMounted } from 'vue'

const showSpanDefault = ref(true);
const aboutVisible = ref(false);
const experienceVisible = ref(false);
const currentTechDescription = ref('');

const hideSpanDefault = (description) => {
  showSpanDefault.value = false;
  currentTechDescription.value = description;
}

const showSpanDefaultOnMouseLeave = () => {
  showSpanDefault.value = true;
  currentTechDescription.value = '';
}

onMounted(() => {
  // Removida a adição dinâmica do Devicon stylesheet (agora está no index.html)
  
  // Verificar se o IntersectionObserver é suportado
  if ('IntersectionObserver' in window) {
    // Opções para o observador
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.2 // 20% visível para ativar
    };

    // Função de callback para as seções
    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        // Obter o ID da seção sendo observada
        const id = entry.target.dataset.section;
        
        if (entry.isIntersecting) {
          // Atualizar estado baseado no ID da seção
          if (id === 'about') {
            aboutVisible.value = true;
          } else if (id === 'experience') {
            experienceVisible.value = true;
          }
          
          // Para melhor performance, parar de observar após ativar
          observer.unobserve(entry.target);
          
          console.log(`Seção ${id} agora é visível.`);
        }
      });
    };

    // Criar o observador
    const observer = new IntersectionObserver(handleIntersect, options);
    
    // Observar elementos com delay para garantir que o DOM está pronto
    setTimeout(() => {
      // Adicionar atributos data-section aos elementos para identificação
      const aboutSection = document.querySelector('.conteudoAbout');
      const experienceSection = document.querySelector('.experiencia');
      
      if (aboutSection) {
        aboutSection.dataset.section = 'about';
        observer.observe(aboutSection);
      }
      
      if (experienceSection) {
        experienceSection.dataset.section = 'experience';
        observer.observe(experienceSection);
      }
    }, 300);
  } else {
    // Fallback para navegadores que não suportam IntersectionObserver
    // Simplesmente mostrar as animações
    aboutVisible.value = true;
    experienceVisible.value = true;
  }
})
</script>

<template>
  <div class="main">

    <div class="home-container">
      <div class="apresentacao">
        <h1 id="nameTitulo">{{ $t('salutation.hello') }} <span>Yuri Santos</span></h1>
        <h2>{{ $t('salutation.myname') }} </h2>
        <p>{{ $t('salutation.legend') }}</p>
      </div>
      <div class="linkLP">
        <a href="https://github.com/yurisantos-y" target="_blank">
          <button class="btnSocial" id="btnGithub">
            <svg xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
            </svg>
          </button>
        </a>

        <a href="https://www.linkedin.com/in/yurisantos-y" target="_blank">
          <button class="btnSocial" id="btnLinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
            </svg>
          </button>
        </a>

        <a href="https://www.instagram.com/yurisantos.y/" target="_blank">
          <button class="btnSocial" id="btnInstagram">
            <svg xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
            </svg>
          </button>
        </a>

        <a href="https://api.whatsapp.com/send?phone=5511950552953" target="_blank">
          <button class="btnSocial" id="btnWpp">
            <svg xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
              d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
          </button>
        </a>

        <a href="mailto:yuri01.sp@gmail.com">
          <button class="btnSocial" id="btnEmail">
            <svg xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
            </svg>
          </button>
        </a>


      </div>
      <h2 id="titleProjetos">{{ $t('salutation.projects') }}</h2>

      <!-- Chamada do Card -->
      <cardHome />


    </div>
  </div>

  <div class="corpo">

    <div class="btnProjects">
      <button><a href="/projects">{{ $t('card.seeMore') }}</a></button>          
    </div>

    <div class="conteudoAbout" :class="{ 'animate__animated animate__fadeIn': aboutVisible }">
      <div class="text-container">
        <h2 class="animate__animated" :class="{ 'animate__fadeInDown': aboutVisible }">{{ $t('about.titleAbout') }}</h2>
        <div class="lineAbout">
          <p class="animate__animated" :class="{ 'animate__fadeIn': aboutVisible }">{{ $t('about.text') }}</p>
        </div>
        <a href="/about">
          <button class="btnAbout animate__animated" id="btnNewButton" :class="{ 'animate__fadeInUp': aboutVisible }">
            {{ $t('about.btnAbout') }}
          </button>
        </a>
      </div>
      <div class="card">
        <img src="../assets/aboutMe.png" alt="Projeto 2">
      </div>
    </div>

    <hr id="hr" class="animate__animated" :class="{ 'animate__fadeIn': aboutVisible }">

    <div class="experiencia" :class="{ 'animate__animated animate__fadeIn': experienceVisible }">
      <div class="card">
        <img src="../assets/experience.png" alt="Projeto 2">
      </div>
      <div class="text-container">
        <h2 class="animate__animated" :class="{ 'animate__fadeInDown': experienceVisible }">{{ $t('experience.titleExperience') }}</h2>
        <div class="flexExperience">
          <p class="animate__animated" :class="{ 'animate__fadeIn': experienceVisible }">{{ $t('experience.textExperience') }}</p>
        </div>
        <a href="/about">
          <button class="btnExp animate__animated" id="btnNewButton" :class="{ 'animate__fadeInUp': experienceVisible }">
            {{ $t('experience.titleExperience') }}
          </button>
        </a>
      </div>
    </div>


    <div class="conhecimento">
      <h2>{{ $t('know.titleKnow') }}</h2>
      <span v-if="showSpanDefault" id="spanDefault">{{ $t('know.textDefault') }}</span>
      <span v-else id="spanDefault">{{ currentTechDescription }}</span>
      <div class="tech-container">
        <div class="tech-item" style="top: 20%; left: 15%; --order: 1;" @mouseover="hideSpanDefault($t('know.vue'))" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" />
        </div>
        <div class="tech-item" style="top: 28%; left: 35%; --order: 2;" @mouseover="hideSpanDefault($t('know.html'))" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" />
        </div>
        <div class="tech-item" style="top: 45%; left: 22%;" @mouseover="hideSpanDefault($t('know.css'))" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" />
        </div>
        <div class="tech-item" style="top: 18%; left: 60%; --order: 4;" @mouseover="hideSpanDefault($t('know.ts'))" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" />
        </div>
        <div class="tech-item" style="top: 38%; left: 52%; --order: 5;" @mouseover="hideSpanDefault($t('know.js'))" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" />
        </div>
        <div class="tech-item" style="top: 60%; left: 40%; --order: 6;" @mouseover="hideSpanDefault($t('know.sass'))" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg" />
        </div>
        <div class="tech-item" style="top: 25%; left: 75%; --order: 7;" @mouseover="hideSpanDefault($t('know.python'))" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" />
        </div>
        <div class="tech-item" style="top: 55%; left: 70%; --order: 8;" @mouseover="hideSpanDefault($t('know.postgresql'))" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" />
        </div>
        <div class="tech-item" style="top: 70%; left: 60%; --order: 9;" @mouseover="hideSpanDefault($t('know.figma'))" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" />
        </div>
        <div class="tech-item" style="top: 72%; left: 22%; --order: 10;" @mouseover="hideSpanDefault($t('know.flutter') || 'Flutter')" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg" />
        </div>
        <div class="tech-item" style="top: 85%; left: 40%; --order: 11;" @mouseover="hideSpanDefault($t('know.tailwind') || 'Tailwind CSS')" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" />
        </div>
        <div class="tech-item" style="top: 50%; left: 85%; --order: 12;" @mouseover="hideSpanDefault($t('know.nextjs') || 'Next.js')" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" />
        </div>
        <div class="tech-item" style="top: 80%; left: 75%; --order: 13;" @mouseover="hideSpanDefault($t('know.dart') || 'Dart')" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg" />
        </div>
        <div class="tech-item" style="top: 15%; left: 88%; --order: 14;" @mouseover="hideSpanDefault($t('know.firebase') || 'Firebase')" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg" />
        </div>
        <div class="tech-item" style="top: 90%; left: 55%; --order: 15;" @mouseover="hideSpanDefault($t('know.supabase') || 'Supabase')" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" />
        </div>
        <div class="tech-item" style="top: 75%; left: 88%; --order: 16;" @mouseover="hideSpanDefault($t('know.prisma') || 'Prisma')" @mouseleave="showSpanDefaultOnMouseLeave">
          <img height="50px" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg" />
        </div>
      </div>
      <div class="bolaConhecimento"></div>
    </div>

    <div class="logofooter">
      <img src="../assets/logo.png" alt="logo em Y laranja">
    </div>
  </div>

</template>

<style lang="scss">
@import '../scss/style.scss';

.main, body {
  overflow-x: hidden;
  background-color: $cor-dark;
}



.home-container {
  height: 100vh;
  width: 100%;
  background-image: url(../assets/bg.svg);
  background-color: $cor-light;
  background-position: center;
  background-size: cover;
  border-radius: 3.75rem 3.75rem 3.75rem 3.75rem;
  /* Alterado para ter bordas arredondadas em todos os cantos */
  overflow-x: hidden;
  border: 1.25rem solid $cor-dark;
}

.apresentacao {
  margin-top: 13rem;
  margin-left: auto;
  margin-right: auto;
  color: $cor-textDark;
  cursor: default;
  text-align: center;
}

.apresentacao h1 {
  font-weight: 800;
  font-size: 3.6rem;
  color: $cor-textDark;
  margin-bottom: -0.3125rem;
  text-align: center;
}

.apresentacao h2 {
  width: 90vw;
  font-size: 3.6rem;
  font-weight: 800;
  letter-spacing: -0.1875rem;
  color: $cor-textDark;
  text-align: center;
  margin: 0 auto;
}

#nameTitulo span {
  background: rgb(237, 76, 92);
  background: linear-gradient(135deg, rgba(237, 76, 92, 1) 0%, rgba(255, 157, 99, 1) 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 300% 300%;
  animation: gradiente 2s ease-in-out infinite;
  font-size: 3.6rem;
  text-align: center;
}

.apresentacao p {
  max-width: 60rem;
  margin-top: 0.625rem;
  line-height: 1.8rem;
  color: $text-gray;
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
  margin: 0 auto;
}

.linkLP {
  display: flex;
  width: 15.625rem;
  height: 2.5rem;
  border-radius: 0.375rem;
  background-color: $bg-icon;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1.625rem;
  justify-content: space-around;
  align-items: center;
}

.linkLP button {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 1.5625rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
  margin: 0 auto;
  fill: $icon-off;

  &:hover {
    transform: scale(1.2);
    transition: fill 0.3s ease, transform 0.3s ease;
  }
}

#btnGithub:hover {
  fill: $git;
}

#btnLinkedIn:hover {
  fill: $linkedIn;
}

#btnInstagram:hover {
  fill: $cor-primaria;
}

#btnEmail:hover {
  fill: $git;
}

#btnWpp:hover {
  fill: $wpp;
}


#titleProjetos {
  font-weight: 700;
  font-size: 1.8rem;
  text-align: center;
  position: absolute;
  color: $cor-textDark;
  width: 100%;
  margin-top: 10rem;
  transform: translateY(-50%);
}

.corpo {
  margin-top: 22rem;
  background-color: $cor-dark;
  color: $cor-light;
}

.btnProjects {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20rem 0 auto;
}

.btnProjects a {
  text-decoration: none;
  color: $cor-light;
}

.conteudos {
  display: flex;
  align-items: center;
  justify-content: center;
}

.conteudos a {
  text-decoration: none;
}

.conteudos h2 {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 1.875rem;
}

.conteudos p {
  display: flex;
  justify-content: start;
  text-align: center;
  line-height: 2rem;
}

.conteudoAbout,
.experiencia {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
}

.conteudoAbout a,
.experiencia a {
  text-decoration: none;
}

.conteudoAbout h2,
.experiencia h2 {
  margin-bottom: 1.875rem;
  font-size: 2rem;
  font-weight: 600;
}

.conteudoAbout p,
.experiencia p {
  width: 85%;
  max-width: 100%;
  margin: 0 auto;
  font-size: 1.2rem;
  line-height: 2rem;
  text-align: justify;
}

.conteudoAbout {
  margin-top: 3.75rem;
}

#hr {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-top: 3.75rem;
  margin-bottom: 3.75rem;
  max-width: 70%;
  height: 0.03125rem;
  background-color: $transparente;
  border: none;
  border-radius: 0.125rem;
}


.btnAbout,
.btnExp,
.btnProjects button {
  border: none;
  background-color: $cor-primaria;
  color: $cor-light;
  padding: 0.3125rem 0.9375rem 0.3125rem 0.9375rem;
  border-radius: 0.3125rem;
  margin-top: 0.625rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  transition: .3s ease-in-out;
  margin-top: 1.5625rem;
  font-size: 1rem;
  box-shadow: 0px 0px 15px $shadow;
  cursor: pointer;
}


.btnAbout:hover,
.btnExp:hover,
.btnProjects button:hover {
  background-color: $hover;
  transform: scale(1.2);
}

.conhecimento {
  position: relative;
  width: 100%;
  height: 100vh;
}


.conhecimento h2 {
  color: $cor-light;
  margin-left: 12%;
  margin-top: 1.875rem;
  margin-bottom: 1.5625rem;
  font-weight: 500;
  font-size: 2.5rem;
}

#spanDefault {
  margin-left: 12%;
  font-weight: 400;
  font-size: 1rem;
}

.conhecimento svg {
  max-width: 2.5rem;
}

.conhecimento button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;

  margin-top: 5%;
  width: 5rem;
  height: 5rem;
  max-width: 5rem;
  max-height: 5rem;
  background-color: $transparente;
  border-radius: 0.625rem;
  border: 0.03125rem solid $cor-light;
  color: $cor-light;
  cursor: pointer;
  animation: appear 0.6s ease-out;
  opacity: 0;
  animation-fill-mode: forwards;
}


.bolaConhecimento {
  position: absolute;
  width: 5.625rem;
  height: 5.625rem;
  border-radius: 50%;
  background-color: $cor-primaria;
  top: 65%;
  left: 14%;
  filter: blur(3.75rem);
}

.logofooter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  margin: 0 auto;
  padding: 1.25rem;
  overflow: hidden;
  transition: .3s ease-in-out;
}

.logofooter img {
  overflow: hidden;
  width: 5%;
}

.logofooter:hover {
  overflow: hidden;
  rotate: 10deg;
}

#titleProjetos {
  font-weight: 700;
  font-size: 1.8rem;
  text-align: center;
  margin-top: 11rem;
}

@media screen and (max-width: 1582px) {
  #titleProjetos {
    margin-top: 4rem;
  }
}

@media screen and (max-width: 1024px) {
  .home-container {
    height: 90vh;
  }

  .apresentacao h1 {
    font-size: 3rem;
  }

  .apresentacao h2 {
    font-size: 3rem;
  }

  .apresentacao p {
    max-width: 43.75rem;
  }

  .linkLP {
    width: 12.5rem;
    height: 2.1875rem;
  }

  .btnSocial {
    width: 1.25rem;
  }

  #titleProjetos {
    font-size: 1.5rem;
  }

  .conteudos h2 {
    font-size: 2rem;
  }

  .conteudos p {
    line-height: 1.8rem;
  }

  .conteudoAbout h2,
  .experiencia h2 {
    font-size: 1.8rem;
  }

  .conteudoAbout p,
  .experiencia p {
    width: 43.75rem;
    font-size: 1rem;
  }

  .btnAbout,
  .btnExp,
  .btnProjects button {
    font-size: 0.8rem;
  }

  .conhecimento h2 {
    font-size: 2rem;
  }

  .conhecimento button {
    width: 4.375rem;
    height: 4.375rem;
    max-width: 4.375rem;
    max-height: 4.375rem;
  }

  .btnVue {
    top: 12%;
    left: 60%;
  }

  .btnHtml {
    top: 20%;
    left: 70%;
  }

  .btnCss {
    top: 32%;
    left: 62%;
  }

  .btnTs {
    top: 40%;
    left: 75%;
  }

  .btnJs {
    top: 50%;
    left: 58%;
  }

  .btnSass {
    top: 58%;
    left: 69%;
  }

  .btnPython {
    top: 67%;
    left: 79%;
  }

  .btnMysql {
    top: 70%;
    left: 60%;
  }

  .btnFigma {
    top: 83%;
    left: 70%;
  }

  .btnMysql img {
    max-width: 3.125rem;
  }

  .btnJs img,
  .btnTs img {
    max-width: 1.75rem;
    margin-top: 50%;
    margin-left: 30%;
  }

  .btnVue svg,
  .btnSass svg {
    max-width: 2.8125rem;
  }

  .divVue p,
  .divTs p,
  .divJs p,
  .divFigma p,
  .divHtml p,
  .divmySql p,
  .divPython p,
  .divSass p,
  .divCss p {
    font-size: 0.9rem;
    margin-left: 10%;
    max-width: 50%;
  }

  .bolaConhecimento {
    width: 4.375rem;
    height: 4.375rem;
    top: 60%;
    left: 10%;
    filter: blur(2.5rem);
  }
}

@media screen and (max-width: 960px) {
  .corpo {
    margin-top: 15rem;
  }
}

@media screen and (max-width: 878px) {
  .home-container {
    height: 80vh;
  }

  .apresentacao {
    margin-top: 18%;
  }

  .apresentacao h1 {
    margin-top: 2.5rem;
    width: 80%;
    text-align: center;
    font-size: 2.3rem;
    margin: 0 auto;
  }

  .apresentacao h2 {
    display: none;
  }

  #nameTitulo span {
    font-size: 3rem;
  }

  .apresentacao p {
    margin-top: 2%;
    max-width: 53.125rem;
    font-size: 1rem;
  }

  .linkLP {
    width: 18.75rem;
    height: 2.1875rem;
  }

  .btnSocial {
    width: 1.5625rem;
  }

  .corpo {
    margin-top: 20rem;
  }



  .conteudos h2 {
    font-size: 1.8rem;margin-top: 2.5rem;
    width: 80%;
    text-align: center;
    font-size: 2.3rem;
    margin: 0 auto;
  }

  .apresentacao h2 {
    display: none;
  }

  #nameTitulo span {
    font-size: 3rem;
  }

  .apresentacao p {
    margin-top: 2%;
    max-width: 53.125rem;
    font-size: 1rem;
  }

  .linkLP {
    width: 18.75rem;
    height: 2.1875rem;
  }

  .btnSocial {
    width: 1.5625rem;
  }



  .conteudos p {
    line-height: 1.8rem;
  }

  .conteudoAbout p,
  .experiencia p {
    width: 43.75rem;
    font-size: 1rem;
    max-width: 200%;
  }

  .btnAbout,
  .btnExp {
    font-size: 0.9rem;
  }

  .conhecimento h2 {
    font-size: 2rem;
  }

  .conhecimento button {
    width: 3.75rem;
    height: 3.75rem;
    max-width: 3.75rem;
    max-height: 3.75rem;
    margin-top: 20%;
  }

  .btnVue {
    top: 12%;
    left: 60%;
  }

  .btnHtml {
    top: 20%;
    left: 70%;
  }

  .btnCss {
    top: 32%;
    left: 62%;
  }

  .btnTs {
    top: 40%;
    left: 75%;
  }

  .btnJs {
    top: 50%;
    left: 58%;
  }

  .btnSass {
    top: 58%;
    left: 69%;
  }

  .btnPython {
    top: 67%;
    left: 79%;
  }

  .btnMysql {
    top: 70%;
    left: 60%;
  }

  .btnFigma {
    top: 83%;
    left: 70%;
  }

  .btnMysql img {
    max-width: 3.125rem;
  }

  .btnJs img,
  .btnTs img {
    max-width: 1.75rem;
    margin-top: 50%;
    margin-left: 30%;
  }

  .btnVue svg,
  .btnSass svg {
    max-width: 2.8125rem;
  }

  .divVue p,
  .divTs p,
  .divJs p,
  .divFigma p,
  .divHtml p,
  .divmySql p,
  .divPython p,
  .divSass p,
  .divCss p {
    font-size: 0.9rem;
    margin-left: 10%;
    max-width: 50%;
  }

  .bolaConhecimento {
    width: 4.375rem;
    height: 4.375rem;
    top: 60%;
    left: 10%;
    filter: blur(2.5rem);
  }

  .conteudoAbout,
  .experiencia {
    flex-direction: column;
    margin: 1.875rem auto;
  }

  .conteudoAbout .text-container,
  .experiencia .text-container,
  .conteudoAbout .card,
  .experiencia .card {
    width: 40%;
  }

  .conteudoAbout .card,
  .experiencia .card {
    height: 12.5rem;
    margin: 0;
  }

  .tech-container .tech-item {
    width: 3.75rem;
    height: 3.75rem;
  }
  
  .tech-container {
    height: 60vh;
  }
  
  /* Ajustar posicionamento dos ícones de tecnologia no mobile */
  .tech-item[style*="top: 20%; left: 15%"] {
    top: 15% !important;
    left: 10% !important;
  }
  
  .tech-item[style*="top: 28%; left: 35%"] {
    top: 20% !important;
    left: 32% !important;
  }
  
  .tech-item[style*="top: 45%; left: 22%"] {
    top: 40% !important;
    left: 15% !important;
  }
  
  .tech-item[style*="top: 18%; left: 60%"] {
    top: 15% !important;
    left: 55% !important;
  }
  
  .tech-item[style*="top: 38%; left: 52%"] {
    top: 35% !important;
    left: 48% !important;
  }
  
  .tech-item[style*="top: 60%; left: 40%"] {
    top: 55% !important;
    left: 30% !important;
  }
  
  .tech-item[style*="top: 25%; left: 75%"] {
    top: 20% !important;
    left: 70% !important;
  }
  
  .tech-item[style*="top: 55%; left: 70%"] {
    top: 50% !important;
    left: 65% !important;
  }
  
  .tech-item[style*="top: 70%; left: 60%"] {
    top: 65% !important;
    left: 50% !important;
  }
  
  .tech-item[style*="top: 72%; left: 22%"] {
    top: 65% !important;
    left: 18% !important;
  }
  
  .tech-item[style*="top: 85%; left: 40%"] {
    top: 75% !important;
    left: 38% !important;
  }
  
  .tech-item[style*="top: 50%; left: 85%"] {
    top: 45% !important;
    left: 82% !important;
  }
  
  .tech-item[style*="top: 80%; left: 75%"] {
    top: 70% !important;
    left: 75% !important;
  }
  
  .tech-item[style*="top: 15%; left: 88%"] {
    top: 10% !important;
    left: 85% !important;
  }
  
  .tech-item[style*="top: 90%; left: 55%"] {
    top: 85% !important;
    left: 58% !important;
  }
  
  .tech-item[style*="top: 75%; left: 88%"] {
    top: 70% !important;
    left: 85% !important;
  }

  /* Melhorias gerais de responsividade */
  #spanDefault {
    margin-left: 5%;
    font-size: 0.9rem;
    display: block;
    width: 90%;
    text-align: center;
  }
  
  .conhecimento h2 {
    margin-left: 5%;
    text-align: center;
    font-size: 1.8rem;
  }
  
  .conteudoAbout .text-container,
  .experiencia .text-container {
    width: 90%;
    padding: 0 10px;
  }
  
  .conteudoAbout .card,
  .experiencia .card {
    width: 60%;
    margin: 20px 0;
  }
  
  .conteudoAbout .card img,
  .experiencia .card img {
    width: 100%;
    margin: 0 auto;
  }
  
  .bolaConhecimento {
    width: 3.75rem;
    height: 3.75rem;
    top: 50%;
    left: 15%;
  }
  
}

@media screen and (max-width: 480px) {
  .tech-container .tech-item {
    width: 3.125rem;
    height: 3.125rem;
  }
  
  .tech-container {
    height: 55vh;
  }

  .conteudoAbout .card,
  .experiencia .card {
    height: auto;
    width: 80%;
  }
  
  .conteudoAbout .card img,
  .experiencia .card img {
    width: 100%;
  }
  
  .logofooter img {
    width: 15%;
  }
  
  .apresentacao h1 {
    font-size: 1.8rem;
  }
  
  #nameTitulo span {
    font-size: 2rem;
  }
  
  .linkLP {
    width: 15.625rem;
    height: 2.5rem;
  }
  
  .btnProjects button,
  .btnAbout,
  .btnExp {
    padding: 0.5rem 1rem;
  }
  
  .conhecimento {
    height: 90vh;
  }
}

@media screen and (max-width: 375px) {
  .home-container {
    height: 80vh;
  }

  .apresentacao {
    margin-top: 18%;
  }

  .apresentacao h1 {
    margin-top: 2.5rem;
    width: 90%;
    text-align: center;
    font-size: 2rem;
    margin: 0 auto;
  }

  .apresentacao h2 {
    display: none;
  }

  #nameTitulo span {
    font-size: 2.7rem;
  }

  .apresentacao p {
    margin-top: 2%;
    max-width: 53.125rem;
    font-size: 1rem;
    text-align: center;
  }

  .linkLP {
    width: 18.75rem;
    height: 2.1875rem;
  }

  .btnSocial {
    width: 1.5625rem;
  }

  .conhecimento button {
    margin-top: 20%;
  }

  .home-container {
    height: auto;
    min-height: 80vh;
    border-radius: 2.5rem;
    border-width: 0.9375rem;
  }
  
  .apresentacao {
    margin-top: 25%;
    padding-bottom: 2.5rem;
  }
  
  .apresentacao h1 {
    font-size: 1.5rem;
  }
  
  #nameTitulo span {
    font-size: 1.7rem;
  }
  
  .apresentacao p {
    font-size: 0.9rem;
    line-height: 1.4rem;
  }
  
  .linkLP {
    width: 13.75rem;
    height: 2.1875rem;
  }
  
  .btnSocial {
    width: 1.25rem;
  }
  
  .conhecimento {
    height: 100vh;
  }
  
  .conhecimento h2 {
    font-size: 1.5rem;
  }
  
  #spanDefault {
    font-size: 0.8rem;
  }
  
  .tech-container .tech-item {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .tech-container .tech-item img {
    height: 1.875rem;
    width: 1.875rem;
  }
  
  .conteudoAbout p, 
  .experiencia p {
    font-size: 0.9rem;
    line-height: 1.6rem;
  }
  
  .conteudoAbout h2, 
  .experiencia h2 {
    font-size: 1.5rem;
  }
  
  #hr {
    margin-top: 1.875rem;
    margin-bottom: 1.875rem;
  }
  
  /* Ajuste dos cards em telas muito pequenas */
  .conteudoAbout,
  .experiencia {
    margin: 1.25rem auto;
    padding: 0 0.625rem;
  }
}

@media screen and (max-width: 320px) {
  .tech-container .tech-item {
    width: 2.1875rem;
    height: 2.1875rem;
  }
  
  .tech-container .tech-item img {
    height: 1.5625rem;
    width: 1.5625rem;
  }
  
  .apresentacao h1 {
    font-size: 1.3rem;
  }
  
  #nameTitulo span {
    font-size: 1.5rem;
  }
  
  .linkLP {
    width: 12.5rem;
  }
  
  .conhecimento {
    height: 80vh;
  }
  
  #titleProjetos {
    margin-top: 15%;
    font-size: 1.2rem;
  }
}

/* Melhorias para touch em dispositivos móveis */
@media (hover: none) {
  .tech-item {
    -webkit-tap-highlight-color: transparent;
  }
  
  .tech-item:active {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .btnAbout:active,
  .btnExp:active,
  .btnProjects button:active {
    background-color: $hover;
    transform: scale(1.1);
  }
}

@keyframes appear {
  from {
    opacity: 0;
    transform: translateY(-100px);
  }

  to {
    opacity: 1;
    translate: 0 0;
  }
}

@keyframes gradiente {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* Estilos para as animações de scroll */
.animate__animated {
  --animate-duration: 0.8s;
  opacity: 0;
  animation-fill-mode: both;
}

.animate__fadeIn {
  animation-name: fadeIn;
}

.animate__fadeInDown {
  animation-name: fadeInDown;
}

.animate__fadeInUp {
  animation-name: fadeInUp;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -40px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 40px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

/* Ajustes de tempo para as animações */
.animate__animated.animate__fadeIn {
  animation-duration: 1s;
}

.animate__animated.animate__fadeInDown {
  animation-duration: 0.8s;
}

.animate__animated.animate__fadeInUp {
  animation-duration: 0.8s;
}

/* Efeitos hover aprimorados para botões */
.btnAbout,
.btnExp {
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.btnAbout:before,
.btnExp:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s;
}

.btnAbout:hover:before,
.btnExp:hover:before {
  left: 100%;
}

.conteudoAbout,
.experiencia {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 3.75rem auto;
  flex-direction: row;
}

.conteudoAbout .text-container,
.experiencia .text-container {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1.25rem;
}

.conteudoAbout .card,
.experiencia .card {
  width: 30%;
  height: auto; /* Alterado de 300px para auto para se ajustar à altura da imagem */
  background-size: cover;
  background-position: center;
  border-radius: 1rem;
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  overflow: hidden; /* Adicionado para conter a imagem dentro dos limites do card */
}

.conteudoAbout .card img,
.experiencia .card img {
  width: 75%;
  height: auto;
  display: block; /* Remover espaço em branco sob a imagem */
  object-fit: contain; /* Garantir que a imagem mantenha sua proporção */
}

.conteudoAbout .card:hover,
.experiencia .card:hover {
  transform: translateY(-0.5rem);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(6.25rem, 1fr));
  gap: 1.25rem;
  margin-top: 1.25rem;
  justify-items: center;
  padding: 0 10%;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.tech-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  background-color: $transparente;
  border-radius: 0.625rem;
  border: 0.03125rem solid $cor-light;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.tech-item:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.1);
}

.tech-item i {
  font-size: 2.5rem;
  color: $cor-light;
  font-family: 'devicon' !important;
  display: inline-block;
}

.tooltip {
  visibility: hidden;
  width: 7.5rem;
  background-color: $cor-primaria;
  color: $cor-light;
  text-align: center;
  border-radius: 0.375rem;
  padding: 0.3125rem;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -3.75rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.tech-item:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

/* Responsive adjustments for tech grid */
@media screen and (max-width: 878px) {
  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
    gap: 0.9375rem;
    padding: 0 5%;
  }
  
  .tech-item {
    width: 4.375rem;
    height: 4.375rem;
  }
  
  .tech-item i {
    font-size: 2.1875rem;
  }
  
  .tooltip {
    width: 6.25rem;
    margin-left: -3.125rem;
    font-size: 0.9rem;
  }
}

@media screen and (max-width: 480px) {
  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(3.75rem, 1fr));
    gap: 0.625rem;
  }
  
  .tech-item {
    width: 3.75rem;
    height: 3.75rem;
  }
  
  .tech-item i {
    font-size: 1.875rem;
  }
}

.tech-container {
  position: relative;
  width: 90%;
  height: 70vh;
  margin: 0 auto;
}

.tech-container .tech-item {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  background-color: $transparente;
  border-radius: 0.625rem;
  border: 0.03125rem solid $cor-light;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  animation: appear 0.8s ease-out forwards;
  animation-delay: calc(var(--order) * 0.2s);
  opacity: 0;
  z-index: 2;
}

.tech-container .tech-item:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.1);
}

/* Enhanced responsive styles for tech items */
@media screen and (max-width: 600px) {
  .tech-container {
    height: 60vh;
  }
  
  .tech-container .tech-item {
    width: 3.4375rem;
    height: 3.4375rem;
  }
  
  .tech-container .tech-item img {
    height: 2.1875rem;
    width: 2.1875rem;
  }
}

@media screen and (max-width: 480px) {
  .tech-container {
    height: 55vh;
  }
  
  .tech-container .tech-item {
    width: 3rem;
    height: 3rem;
  }
  
  .tech-container .tech-item img {
    height: 1.875rem;
    width: 1.875rem;
  }
}

@media screen and (max-width: 380px) {
  .tech-container {
    height: 50vh;
  }
  
  .tech-container .tech-item {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .tech-container .tech-item img {
    height: 1.5625rem;
    width: 1.5625rem;
  }
}

@media screen and (max-width: 878px) {
  .tech-container .tech-item {
    width: 3.75rem;
    height: 3.75rem;
  }
  
  .tech-container {
    height: 60vh;
  }
  
  /* Ajustar posicionamento dos ícones de tecnologia no mobile */
  .tech-item[style*="top: 20%; left: 15%"] {
    top: 15% !important;
    left: 10% !important;
  }
  
  .tech-item[style*="top: 28%; left: 35%"] {
    top: 20% !important;
    left: 32% !important;
  }
  
  .tech-item[style*="top: 45%; left: 22%"] {
    top: 40% !important;
    left: 15% !important;
  }
  
  .tech-item[style*="top: 18%; left: 60%"] {
    top: 15% !important;
    left: 55% !important;
  }
  
  .tech-item[style*="top: 38%; left: 52%"] {
    top: 35% !important;
    left: 48% !important;
  }
  
  .tech-item[style*="top: 60%; left: 40%"] {
    top: 55% !important;
    left: 30% !important;
  }
  
  .tech-item[style*="top: 25%; left: 75%"] {
    top: 20% !important;
    left: 70% !important;
  }
  
  .tech-item[style*="top: 55%; left: 70%"] {
    top: 50% !important;
    left: 65% !important;
  }
  
  .tech-item[style*="top: 70%; left: 60%"] {
    top: 65% !important;
    left: 50% !important;
  }
  
  .tech-item[style*="top: 72%; left: 22%"] {
    top: 65% !important;
    left: 18% !important;
  }
  
  .tech-item[style*="top: 85%; left: 40%"] {
    top: 75% !important;
    left: 38% !important;
  }
  
  .tech-item[style*="top: 50%; left: 85%"] {
    top: 45% !important;
    left: 82% !important;
  }
  
  .tech-item[style*="top: 80%; left: 75%"] {
    top: 70% !important;
    left: 75% !important;
  }
  
  .tech-item[style*="top: 15%; left: 88%"] {
    top: 10% !important;
    left: 85% !important;
  }
  
  .tech-item[style*="top: 90%; left: 55%"] {
    top: 85% !important;
    left: 58% !important;
  }
  
  .tech-item[style*="top: 75%; left: 88%"] {
    top: 70% !important;
    left: 85% !important;
  }

  /* Melhorias gerais de responsividade */
  #spanDefault {
    margin-left: 5%;
    font-size: 0.9rem;
    display: block;
    width: 90%;
    text-align: center;
  }
  
  .conhecimento h2 {
    margin-left: 5%;
    text-align: center;
    font-size: 1.8rem;
  }
  
  .conteudoAbout .text-container,
  .experiencia .text-container {
    width: 90%;
    padding: 0 10px;
  }
  
  .conteudoAbout .card,
  .experiencia .card {
    width: 60%;
    margin: 20px 0;
  }
  
  .conteudoAbout .card img,
  .experiencia .card img {
    width: 100%;
    margin: 0 auto;
  }
  
  .bolaConhecimento {
    width: 3.75rem;
    height: 3.75rem;
    top: 50%;
    left: 15%;
  }
}

@media screen and (max-width: 480px) {
  .tech-container .tech-item {
    width: 3.125rem;
    height: 3.125rem;
  }
  
  .tech-container {
    height: 55vh;
  }

  .conteudoAbout .card,
  .experiencia .card {
    height: auto;
    width: 80%;
  }
  
  .conteudoAbout .card img,
  .experiencia .card img {
    width: 100%;
  }
  
  .logofooter img {
    width: 15%;
  }
  
  .apresentacao h1 {
    font-size: 1.8rem;
  }
  
  #nameTitulo span {
    font-size: 2rem;
  }
  
  .linkLP {
    width: 15.625rem;
    height: 2.5rem;
  }
  
  .btnProjects button,
  .btnAbout,
  .btnExp {
    padding: 0.5rem 1rem;
  }
  
  .conhecimento {
    height: 90vh;
  }
}

@media screen and (max-width: 375px) {
  .home-container {
    height: 80vh;
  }

  .apresentacao {
    margin-top: 18%;
  }

  .apresentacao h1 {
    margin-top: 2.5rem;
    width: 90%;
    text-align: center;
    font-size: 2rem;
    margin: 0 auto;
  }

  .apresentacao h2 {
    display: none;
  }

  #nameTitulo span {
    font-size: 2.7rem;
  }

  .apresentacao p {
    margin-top: 2%;
    max-width: 53.125rem;
    font-size: 1rem;
    text-align: center;
  }

  .linkLP {
    width: 18.75rem;
    height: 2.1875rem;
  }

  .btnSocial {
    width: 1.5625rem;
  }

  .conhecimento button {
    margin-top: 20%;
  }

  .home-container {
    height: auto;
    min-height: 80vh;
    border-radius: 2.5rem;
    border-width: 0.9375rem;
  }
  
  .apresentacao {
    margin-top: 25%;
    padding-bottom: 2.5rem;
  }
  
  .apresentacao h1 {
    font-size: 1.5rem;
  }
  
  #nameTitulo span {
    font-size: 1.7rem;
  }
  
  .apresentacao p {
    font-size: 0.9rem;
    line-height: 1.4rem;
  }
  
  .linkLP {
    width: 13.75rem;
    height: 2.1875rem;
  }
  
  .btnSocial {
    width: 1.25rem;
  }
  
  .conhecimento {
    height: 100vh;
  }
  
  .conhecimento h2 {
    font-size: 1.5rem;
  }
  
  #spanDefault {
    font-size: 0.8rem;
  }
  
  .tech-container .tech-item {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .tech-container .tech-item img {
    height: 1.875rem;
    width: 1.875rem;
  }
  
  .conteudoAbout p, 
  .experiencia p {
    font-size: 0.9rem;
    line-height: 1.6rem;
  }
  
  .conteudoAbout h2, 
  .experiencia h2 {
    font-size: 1.5rem;
  }
  
  #hr {
    margin-top: 1.875rem;
    margin-bottom: 1.875rem;
  }
  
  /* Ajuste dos cards em telas muito pequenas */
  .conteudoAbout,
  .experiencia {
    margin: 1.25rem auto;
    padding: 0 0.625rem;
  }
}

@media screen and (max-width: 320px) {
  .tech-container .tech-item {
    width: 2.1875rem;
    height: 2.1875rem;
  }
  
  .tech-container .tech-item img {
    height: 1.5625rem;
    width: 1.5625rem;
  }
  
  .apresentacao h1 {
    font-size: 1.3rem;
  }
  
  #nameTitulo span {
    font-size: 1.5rem;
  }
  
  .linkLP {
    width: 12.5rem;
  }
  
  .conhecimento {
    height: 80vh;
  }
  
  #titleProjetos {
    margin-top: 15%;
    font-size: 1.2rem;
  }
}

/* Melhorias para touch em dispositivos móveis */
@media (hover: none) {
  .tech-item {
    -webkit-tap-highlight-color: transparent;
  }
  
  .tech-item:active {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .btnAbout:active,
  .btnExp:active,
  .btnProjects button:active {
    background-color: $hover;
    transform: scale(1.1);
  }
}

/* Melhorias na responsividade para dispositivos entre 1024px e 769px */
@media screen and (max-width: 1024px) and (min-width: 769px) {
  .home-container {
    height: 85vh;
    border-radius: 3.125rem;
    border-width: 1.125rem;
  }

  .apresentacao {
    margin-top: 15%;
  }

  .apresentacao h1 {
    font-size: 2.8rem;
  }

  .apresentacao h2 {
    font-size: 2.8rem;
    width: 85vw;
  }

  #nameTitulo span {
    font-size: 2.8rem;
  }

  .apresentacao p {
    max-width: 46.875rem;
    font-size: 1.1rem;
    line-height: 1.7rem;
  }

  .linkLP {
    width: 14.375rem;
    height: 2.375rem;
  }

  .btnSocial {
    width: 1.375rem;
  }


  .tech-container {
    height: 65vh;
  }

  .conhecimento h2 {
    font-size: 2.2rem;
    margin-left: 9%;
  }

  #spanDefault {
    font-size: 0.95rem;
    margin-left: 9%;
  }

  .conteudoAbout h2, 
  .experiencia h2 {
    font-size: 2rem;
  }

  .conteudoAbout p,
  .experiencia p {
    width: 50rem;
    font-size: 1.1rem;
    line-height: 1.9rem;
  }

  .conteudoAbout .card,
  .experiencia .card {
    width: 35%;
  }
}

/* Tablets pequenos e celulares grandes */
@media screen and (max-width: 878px) {
  .home-container {
    height: auto;
    min-height: 85vh;
    border-radius: 2.8125rem;
    border-width: 1rem;
  }

  .apresentacao {
    margin-top: 16%;
    padding-bottom: 2.5rem;
  }

  .apresentacao h1 {
    font-size: 2.2rem;
    width: 85%;
    margin: 0 auto;
    text-align: center;
  }

  .apresentacao h2 {
    font-size: 2.2rem;
    width: 85vw;
  }

  #nameTitulo span {
    font-size: 2.4rem;
  }

  .apresentacao p {
    max-width: 50rem;
    font-size: 1rem;
    line-height: 1.6rem;
    text-align: center;
  }


  /* Melhorias na seção de tecnologias */
  .conhecimento {
    height: 90vh;
  }

  .conhecimento h2 {
    font-size: 2rem;
    margin-left: 8%;
    text-align: center;
    margin-top: 1.25rem;
  }

  #spanDefault {
    font-size: 0.95rem;
    margin-left: 8%;
    display: block;
    width: 85%;
    text-align: center;
  }

  /* Ajustes nas seções Sobre e Experiência */
  .conteudoAbout,
  .experiencia {
    flex-direction: column;
    margin: 2.5rem auto;
    gap: 1.5625rem;
  }

  .conteudoAbout .text-container,
  .experiencia .text-container {
    width: 85%;
    padding: 0 0.9375rem;
    order: 1;
  }

  .conteudoAbout .card,
  .experiencia .card {
    width: 65%;
    height: auto;
    order: 0;
    margin: 0.625rem 0;
  }

  .conteudoAbout .card img,
  .experiencia .card img {
    width: 90%;
    display: block;
    margin: 0 auto;
  }

  .conteudoAbout h2, 
  .experiencia h2 {
    font-size: 1.8rem;
    text-align: center;
  }

  .conteudoAbout p,
  .experiencia p {
    width: 100%;
    font-size: 1rem;
    line-height: 1.7rem;
    text-align: center;
  }

  .btnAbout,
  .btnExp,
  .btnProjects button {
    font-size: 0.9rem;
    margin: 0 auto;
    display: block;
  }

  /* Ajuste na bolha de fundo */
  .bolaConhecimento {
    width: 4.375rem;
    height: 4.375rem;
    top: 60%;
    left: 12%;
    filter: blur(2.8125rem);
  }

  /* Ajuste no logo do footer */
  .logofooter img {
    width: 8%;
  }

  .corpo{
    margin-top: 45rem;
  }
}

@media screen and (max-width: 768px) {
  .corpo {
    margin-top: 35rem;
  }
}

/* Tablets pequenos e celulares grandes */
@media screen and (max-width: 600px) {
  .home-container {
    border-radius: 2.5rem;
    border-width: 0.9375rem;
    min-height: 80vh;
  }

  .apresentacao {
    margin-top: 18%;
  }

  .apresentacao h1 {
    font-size: 1.9rem;
  }

  #nameTitulo span {
    font-size: 2.1rem;
  }

  .linkLP {
    width: 15.625rem;
    height: 2.1875rem;
  }

  .btnSocial {
    width: 1.375rem;
  }

  .conhecimento h2 {
    font-size: 1.7rem;
  }

  #spanDefault {
    font-size: 0.9rem;
    width: 90%;
  }

  .tech-container {
    height: 60vh;
  }

  .tech-container .tech-item {
    width: 3.75rem;
    height: 3.75rem;
  }

  .tech-container .tech-item img {
    height: 2.5rem;
    width: 2.5rem;
  }

  /* Melhorar o posicionamento dos ícones de tecnologia */
  .tech-item[style*="top: 20%; left: 15%"] {
    top: 15% !important;
    left: 12% !important;
  }
  
  .tech-item[style*="top: 28%; left: 35%"] {
    top: 22% !important;
    left: 32% !important;
  }
  
  .tech-item[style*="top: 45%; left: 22%"] {
    top: 38% !important;
    left: 18% !important;
  }
  
  .tech-item[style*="top: 55%; left: 40%"] {
    top: 48% !important;
    left: 36% !important;
  }

  .conteudoAbout .card,
  .experiencia .card {
    width: 75%;
  }

  #hr {
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
  }

  .logofooter img {
    width: 10%;
  }
}

/* Celulares médios */
@media screen and (max-width: 480px) {
  .home-container {
    border-radius: 2.1875rem;
    border-width: 0.75rem;
  }
  
  .apresentacao {
    margin-top: 20%;
  }
  
  .apresentacao h1 {
    font-size: 1.7rem;
  }
  
  #nameTitulo span {
    font-size: 1.9rem;
  }
  
  .apresentacao p {
    max-width: 53.125rem;
    font-size: 0.95rem;
    line-height: 1.5rem;
  }
  
  .linkLP {
    width: 13.75rem;
    height: 2.1875rem;
  }
  
  .btnSocial {
    width: 1.25rem;
  }
  
  .tech-container .tech-item {
    width: 3.125rem;
    height: 3.125rem;
  }
  
  .tech-container .tech-item img {
    height: 2rem;
    width: 2rem;
  }
  
  .conteudoAbout h2, 
  .experiencia h2 {
    font-size: 1.6rem;
  }
  
  .conteudoAbout p,
  .experiencia p {
    font-size: 0.95rem;
    line-height: 1.6rem;
  }
  
  .conteudoAbout .card,
  .experiencia .card {
    width: 85%;
  }
  
  .btnAbout,
  .btnExp,
  .btnProjects button {
    font-size: 0.8rem;
    padding: 0.3125rem 0.75rem;
  }
  
  .logofooter img {
    width: 12%;
  }
}

/* Celulares pequenos */
@media screen and (max-width: 375px) {
  .home-container {
    border-radius: 1.875rem;
    border-width: 0.625rem;
  }
  
  .apresentacao {
    margin-top: 22%;
    padding-bottom: 1.875rem;
  }
  
  .apresentacao h1 {
    font-size: 1.5rem;
  }
  
  #nameTitulo span {
    font-size: 1.7rem;
  }
  
  .apresentacao p {
    max-width: 56.25rem;
    font-size: 0.9rem;
    line-height: 1.4rem;
  }
  
  .linkLP {
    width: 12.5rem;
    margin-top: 1.25rem;
  }
  
  .tech-container .tech-item {
    width: 2.8125rem;
    height: 2.8125rem;
  }
  
  .tech-container .tech-item img {
    height: 1.75rem;
    width: 1.75rem;
  }
  
  .tech-container {
    height: 55vh;
  }
  
  .conhecimento h2 {
    font-size: 1.5rem;
  }
  
  #spanDefault {
    font-size: 0.85rem;
  }
  
  .conteudoAbout h2, 
  .experiencia h2 {
    font-size: 1.5rem;
  }
  
  .conteudoAbout p,
  .experiencia p {
    font-size: 0.9rem;
    line-height: 1.5rem;
  }
  
  #hr {
    margin-top: 1.875rem;
    margin-bottom: 1.875rem;
  }
}

/* Celulares muito pequenos */
@media screen and (max-width: 320px) {
  .apresentacao {
    margin-top: 25%;
  }
  
  .apresentacao h1 {
    font-size: 1.3rem;
  }
  
  #nameTitulo span {
    font-size: 1.5rem;
  }
  
  .linkLP {
    width: 11.25rem;
    height: 2rem;
  }
  
  .btnSocial {
    width: 1.125rem;
  }
  
  .tech-container .tech-item {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .tech-container .tech-item img {
    height: 1.5625rem;
    width: 1.5625rem;
  }
  
  .conteudoAbout h2, 
  .experiencia h2 {
    font-size: 1.4rem;
  }
  
  .conteudoAbout p,
  .experiencia p {
    font-size: 0.85rem;
    line-height: 1.4rem;
  }
  
  .btnAbout,
  .btnExp,
  .btnProjects button {
    font-size: 0.75rem;
    padding: 0.25rem 0.625rem;
  }
}

/* Melhorias para interações touch em dispositivos móveis */
@media (hover: none) {
  .tech-item {
    -webkit-tap-highlight-color: transparent;
  }
  
  .tech-item:active {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .btnAbout:active,
  .btnExp:active,
  .btnProjects button:active {
    background-color: $hover;
    transform: scale(1.1);
  }
}

/* Melhorias na responsividade para dispositivos entre 1024px e 769px */
@media screen and (max-width: 1024px) and (min-width: 769px) {
  .home-container {
    height: 85vh;
    border-radius: 3.125rem;
    border-width: 1.125rem;
  }

  .apresentacao {
    margin-top: 15%;
  }

  .apresentacao h1 {
    font-size: 2.8rem;
  }

  .apresentacao h2 {
    font-size: 2.8rem;
    width: 85vw;
  }

  #nameTitulo span {
    font-size: 2.8rem;
  }

  .apresentacao p {
    max-width: 46.875rem;
    font-size: 1.1rem;
    line-height: 1.7rem;
  }

  .linkLP {
    width: 14.375rem;
    height: 2.375rem;
  }

  .btnSocial {
    width: 1.375rem;
  }


  .tech-container {
    height: 65vh;
  }

  .conhecimento h2 {
    font-size: 2.2rem;
    margin-left: 9%;
  }

  #spanDefault {
    font-size: 0.95rem;
    margin-left: 9%;
  }

  .conteudoAbout h2, 
  .experiencia h2 {
    font-size: 2rem;
  }

  .conteudoAbout p,
  .experiencia p {
    width: 50rem;
    font-size: 1.1rem;
    line-height: 1.9rem;
  }

  .conteudoAbout .card,
  .experiencia .card {
    width: 35%;
  }
}
</style>