<script setup>
import cardHome from '../components/cardHome.vue'
import { ref, onMounted, computed } from 'vue'

const showSpanDefault = ref(true);
const aboutVisible = ref(false);
const experienceVisible = ref(false);
const currentTechDescription = ref('');

// Skills section reactive data
const activeCategory = ref('all');
const activeSkill = ref(null);

// Skills data
const skills = ref([
  {
    name: 'Vue.js',
    key: 'vue',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
    category: 'frontend',
    level: 90,
    experience: 3
  },
  {
    name: 'JavaScript',
    key: 'js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
    category: 'frontend',
    level: 85,
    experience: 4
  },
  {
    name: 'TypeScript',
    key: 'ts',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
    category: 'frontend',
    level: 80,
    experience: 2
  },
  {
    name: 'HTML5',
    key: 'html',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
    category: 'frontend',
    level: 95,
    experience: 5
  },
  {
    name: 'CSS3',
    key: 'css',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
    category: 'frontend',
    level: 90,
    experience: 5
  },
  {
    name: 'Sass',
    key: 'sass',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg',
    category: 'frontend',
    level: 85,
    experience: 3
  },
  {
    name: 'Tailwind CSS',
    key: 'tailwind',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    category: 'frontend',
    level: 80,
    experience: 2
  },
  {
    name: 'Next.js',
    key: 'nextjs',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
    category: 'frontend',
    level: 75,
    experience: 1
  },
  {
    name: 'Python',
    key: 'python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    category: 'backend',
    level: 80,
    experience: 3
  },
  {
    name: 'Go',
    key: 'go',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg',
    category: 'backend',
    level: 75,
    experience: 1
  },
  {
    name: 'PostgreSQL',
    key: 'postgresql',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
    category: 'backend',
    level: 75,
    experience: 2
  },
  {
    name: 'Firebase',
    key: 'firebase',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg',
    category: 'backend',
    level: 70,
    experience: 2
  },
  {
    name: 'Supabase',
    key: 'supabase',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
    category: 'backend',
    level: 75,
    experience: 1
  },
  {
    name: 'Prisma',
    key: 'prisma',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg',
    category: 'backend',
    level: 70,
    experience: 1
  },
  {
    name: 'Figma',
    key: 'figma',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg',
    category: 'tools',
    level: 85,
    experience: 5
  },
  {
    name: 'Flutter',
    key: 'flutter',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg',
    category: 'frontend',
    level: 70,
    experience: 1
  },
  {
    name: 'Dart',
    key: 'dart',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg',
    category: 'frontend',
    level: 65,
    experience: 1
  }
]);

// Computed property for filtered skills
const filteredSkills = computed(() => {
  if (activeCategory.value === 'all') {
    return skills.value;
  }
  return skills.value.filter(skill => skill.category === activeCategory.value);
});

// Skills methods
const setActiveCategory = (category) => {
  activeCategory.value = category;
};

const setActiveSkill = (skill) => {
  activeSkill.value = skill;
};

const clearActiveSkill = () => {
  activeSkill.value = null;
};

const getSkillLevel = (level) => {
  if (level >= 85) return 'Expert';
  if (level >= 70) return 'Advanced';
  if (level >= 50) return 'Intermediate';
  return 'Beginner';
};

// Legacy methods for backward compatibility
const hideSpanDefault = (description) => {
  showSpanDefault.value = false;
  currentTechDescription.value = description;
}

const showSpanDefaultOnMouseLeave = () => {
  showSpanDefault.value = true;
  currentTechDescription.value = '';
}

onMounted(() => {
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
      const skillsSection = document.querySelector('.skills-section');

      if (aboutSection) {
        aboutSection.dataset.section = 'about';
        observer.observe(aboutSection);
      }

      if (experienceSection) {
        experienceSection.dataset.section = 'experience';
        observer.observe(experienceSection);
      }

      if (skillsSection) {
        skillsSection.dataset.section = 'skills';
        observer.observe(skillsSection);
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
                d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
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
    </div>

    <!-- <h2 id="titleProjetos">{{ $t('salutation.projects') }}</h2> -->
    <!-- Chamada do Card -->
    <cardHome />

  </div>



  <div class="corpo">

    <div class="btnProjects">
      <button><a href="/projects">{{ $t('card.seeMore') }}</a></button>
    </div>



    <div class="experiencia" :class="{ 'animate__animated animate__fadeIn': experienceVisible }">
      <h2 class="experience-title animate__animated" :class="{ 'animate__fadeInDown': experienceVisible }">
        Experience
      </h2>
      
      <div class="timeline-container animate__animated" :class="{ 'animate__fadeInUp': experienceVisible }">
        <!-- Timeline Line -->
        <div class="timeline-line"></div>
        
        <!-- Experience Cards -->
        <div class="timeline-item">

          <div class="timeline-date">Dec 2024 - Feb 2025</div>
          <div class="experience-card">
            <div class="job-header">
              <h3>Software Engineer</h3>
              <p class="company">Toggle Innovations LLC</p>
            </div>
            <div class="job-description">
              <ul>
                <li>Developed client, portal, and admin websites from concept to launch within a 3-month period, ensuring a cohesive and responsive design.</li>
                <li>Collaborated with cross-functional teams to align website functionality with business goals and user needs.</li>
              </ul>
            </div>
            <div class="tech-stack">
              <span class="tech-tag">React</span>
              <span class="tech-tag">NodeJS</span>
              <span class="tech-tag">MongoDB</span>
              <span class="tech-tag">Firebase</span>
            </div>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-date">July 2024 - Dec 2024</div>
          <div class="experience-card">
            <div class="job-header">
              <h3>Full Stack Web Developer</h3>
              <p class="company">Blast Catering LLC</p>
            </div>
            <div class="job-description">
              <ul>
                <li>Optimized the customer-facing website by analyzing user analytics and enhancing key features, achieving up to 2x faster load times and a 60% improvement in user engagement.</li>
                <li>Improved code quality and application efficiency by implementing best practices and shifting processing from client-side to server-side, reducing resource consumption by 45% and increasing maintainability by 30%.</li>
              </ul>
            </div>
            <div class="tech-stack">
              <span class="tech-tag">React</span>
              <span class="tech-tag">TypeScript</span>
              <span class="tech-tag">NodeJS</span>
              <span class="tech-tag">MongoDB</span>
            </div>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-date">Sept 2022 - June 2024</div>
          <div class="experience-card">
            <div class="job-header">
              <h3>Software Engineer</h3>
              <p class="company">Washon LLC</p>
            </div>
            <div class="job-description">
              <ul>
                <li>Revamped client application using Flutter/Dart, enhancing organization, scalability, and code quality by 2x.</li>
                <li>Implemented the BLOC pattern and integrated Dio for API call management, reducing response times by 50%.</li>
                <li>Minimized production crashes and optimized error handling with Flutter Bloc and Firebase.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="skills-section">
      <div class="skills-container">
        <div class="skills-header">
          <h2>{{ $t('know.titleKnow') }}</h2>
          <p class="skills-subtitle">{{ $t('know.subtitle') }}</p>
        </div>
        
        <div class="skills-categories">
          <div 
            class="category" 
            :class="{ active: activeCategory === 'all' }"
            @click="setActiveCategory('all')"
          >
            <h3>All</h3>
            <p>{{ $t('know.allDesc') || 'All technologies' }}</p>
          </div>
          <div 
            class="category frontend" 
            :class="{ active: activeCategory === 'frontend' }"
            @click="setActiveCategory('frontend')"
          >
            <h3>Frontend</h3>
            <p>{{ $t('know.frontendDesc') }}</p>
          </div>
          <div 
            class="category backend" 
            :class="{ active: activeCategory === 'backend' }"
            @click="setActiveCategory('backend')"
          >
            <h3>Backend</h3>
            <p>{{ $t('know.backendDesc') }}</p>
          </div>
          <div 
            class="category tools" 
            :class="{ active: activeCategory === 'tools' }"
            @click="setActiveCategory('tools')"
          >
            <h3>Tools & Design</h3>
            <p>{{ $t('know.toolsDesc') }}</p>
          </div>
        </div>

        <div class="skills-grid">
          <div 
            v-for="skill in filteredSkills" 
            :key="skill.name"
            class="skill-card"
            :class="skill.category"
            @mouseenter="setActiveSkill(skill)"
            @mouseleave="clearActiveSkill"
          >
            <div class="skill-icon">
              <img :src="skill.icon" :alt="skill.name" />
            </div>
            <div class="skill-content">
              <h4>{{ skill.name }}</h4>
              <div class="skill-level">
                <div class="level-bar">
                  <div 
                    class="level-fill" 
                    :style="{ width: skill.level + '%' }"
                    :data-level="skill.level"
                  ></div>
                </div>
                <span class="level-text">{{ getSkillLevel(skill.level) }}</span>
              </div>
              <div class="experience-badge">
                {{ skill.experience }}+ {{ $t('know.yearsExp') }}
              </div>
            </div>
            <div class="skill-overlay">
              <p>{{ $t('know.' + skill.key) }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="logofooter">
      <img src="../assets/logo.png" alt="logo em Y laranja">
    </div>
  </div>

</template>

<style lang="scss">
@import '../scss/style.scss';

// Responsive Breakpoints
$mobile: 480px;
$tablet: 768px;
$desktop-small: 992px;
$desktop: 1200px;

.main,
body {
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
  overflow-x: hidden;
  border: 1.25rem solid $cor-dark;

  @media (max-width: $tablet) {
    border-width: 0.625rem;
    border-radius: 2rem;
  }

  @media (max-width: $mobile) {
    border-width: 0.3125rem;
    border-radius: 1.5rem;
  }
}

.apresentacao {
  margin-top: 13rem;
  margin-left: auto;
  margin-right: auto;
  color: $cor-textDark;
  cursor: default;
  text-align: center;

  @media (max-width: $tablet) {
    margin-top: 8rem;
  }

  @media (max-width: $mobile) {
    margin-top: 6rem;
  }
}

.apresentacao h1 {
  font-weight: 800;
  font-size: 3.6rem;
  color: $cor-textDark;
  margin-bottom: -0.3125rem;
  text-align: center;

  @media (max-width: $desktop-small) {
    font-size: 3rem;
  }

  @media (max-width: $tablet) {
    font-size: 2.5rem;
  }

  @media (max-width: $mobile) {
    font-size: 1.2rem;
  }
}

.apresentacao h2 {
  width: 90vw;
  font-size: 3.6rem;
  font-weight: 800;
  letter-spacing: -0.1875rem;
  color: $cor-textDark;
  text-align: center;
  margin: 0 auto;

  @media (max-width: $desktop-small) {
    font-size: 3rem;
  }

  @media (max-width: $tablet) {
    font-size: 2.5rem;
    letter-spacing: -0.125rem;
  }

  @media (max-width: $mobile) {
    font-size: 1.3rem;
    letter-spacing: -0.0625rem;
    width: 95vw;
  }
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

  @media (max-width: $desktop-small) {
    font-size: 3rem;
  }

  @media (max-width: $tablet) {
    font-size: 2.5rem;
  }

  @media (max-width: $mobile) {
    font-size: 2rem;
  }
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

  @media (max-width: $tablet) {
    font-size: 1rem;
    line-height: 1.5rem;
    max-width: 90%;
  }

  @media (max-width: $mobile) {
    font-size: 0.9rem;
    line-height: 1.4rem;
    margin-top: 0.5rem;
  }
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

  @media (max-width: $tablet) {
    width: 14rem;
    height: 2.2rem;
  }

  @media (max-width: $mobile) {
    width: 12rem;
    height: 2rem;
    margin-top: 1rem;
  }
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

  @media (max-width: $mobile) {
    width: 1.25rem;

    svg {
      width: 100%;
      height: auto;
    }
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

  @media (max-width: $desktop-small) {
    font-size: 1.6rem;
    margin-top: 8rem;
  }

  @media (max-width: $tablet) {
    font-size: 1.4rem;
    margin-top: 6rem;
  }

  @media (max-width: $mobile) {
    font-size: 1.2rem;
    margin-top: 5rem;
  }
}

.corpo {
  margin-top: 22rem;
  background-color: $cor-dark;
  color: $cor-light;

  @media (max-width: $desktop-small) {
    margin-top: 18rem;
  }

  @media (max-width: $tablet) {
    margin-top: 15rem;
  }

  @media (max-width: $mobile) {
    margin-top: 12rem;
  }
}

.btnProjects {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20rem 0 auto;

  @media (max-width: $desktop-small) {
    margin: 15rem 0 auto;
  }

  @media (max-width: $tablet) {
    margin: -8rem 0 auto;
  }

  @media (max-width: $mobile) {
    margin: -5rem 0 auto;
  }
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

  @media (max-width: $tablet) {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: $mobile) {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }
}

.conteudos p {
  display: flex;
  justify-content: start;
  text-align: center;
  line-height: 2rem;

  @media (max-width: $mobile) {
    line-height: 1.6rem;
  }
}

.conteudoAbout,
.experiencia {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
  padding: 4rem 2rem;

  @media (max-width: $desktop-small) {
    flex-direction: column;
    padding: 3rem 1rem;
  }

  @media (max-width: $tablet) {
    padding: 2rem 1rem;
    
    .card {
      margin-top: 2rem;

      img {
        max-width: 100%;
        height: auto;
      }
    }
  }
}

// New Experience Section Styles
.experiencia {
  background-color: $cor-dark;
  color: $cor-light;
  width: 100%;
  padding: 6rem 0;
  position: relative;
}

.experience-title {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 4rem;
  color: $cor-light;
  
  @media (max-width: $tablet) {
    font-size: 2.5rem;
    margin-bottom: 3rem;
  }

  @media (max-width: $mobile) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
}

.timeline-container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.timeline-line {
  position: absolute;
  left: 2rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, 
    rgba(237, 76, 92, 0.8) 0%, 
    rgba(255, 157, 99, 0.8) 50%,
    rgba(237, 76, 92, 0.8) 100%
  );
  
  @media (max-width: $tablet) {
    left: 1rem;
  }
  
  @media (max-width: $mobile) {
    left: 0.5rem;
  }
}

.timeline-item {
  position: relative;
  margin-bottom: 4rem;
  padding-left: 4rem;
  
  @media (max-width: $tablet) {
    padding-left: 3rem;
    margin-bottom: 3rem;
  }
  
  @media (max-width: $mobile) {
    padding-left: 2rem;
    margin-bottom: 2.5rem;
  }
}

.timeline-date {
  position: absolute;
  left: -12rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: $cor-light;
  font-weight: 600;
  white-space: nowrap;
  
  @media (max-width: $desktop-small) {
    position: relative;
    left: 0;
    top: 0;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: $mobile) {
    font-size: 0.8rem;
  }
}

.experience-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, rgba(237, 76, 92, 1) 0%, rgba(255, 157, 99, 1) 100%);
  }
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 30px rgba(237, 76, 92, 0.2);
  }
  
  @media (max-width: $tablet) {
    padding: 1.5rem;
  }
  
  @media (max-width: $mobile) {
    padding: 1rem;
  }
}

.job-header {
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.4rem;
    font-weight: 700;
    color: $cor-light;
    margin-bottom: 0.5rem;
    margin-top: 0;
    
    @media (max-width: $mobile) {
      font-size: 1.2rem;
    }
  }
  
  .company {
    font-size: 1rem;
    color: rgba(237, 76, 92, 1);
    font-weight: 600;
    margin: 0;
    
    @media (max-width: $mobile) {
      font-size: 0.9rem;
    }
  }
}

.job-description {
  margin-bottom: 1.5rem;
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      position: relative;
      padding-left: 1.2rem;
      margin-bottom: 0.8rem;
      color: $text-gray;
      line-height: 1.6;
      font-size: 0.95rem;
      
      &:before {
        content: "▶";
        position: absolute;
        left: 0;
        color: rgba(255, 157, 99, 1);
        font-size: 0.7rem;
        top: 0.2rem;
      }
      
      @media (max-width: $mobile) {
        font-size: 0.85rem;
        padding-left: 1rem;
      }
    }
  }
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  
  .tech-tag {
    background: rgba(255, 255, 255, 0.1);
    color: $cor-light;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(237, 76, 92, 0.2);
      border-color: rgba(237, 76, 92, 0.5);
      transform: translateY(-2px);
    }
    
    @media (max-width: $mobile) {
      font-size: 0.7rem;
      padding: 0.25rem 0.6rem;
    }
  }
}

.text-container {
  @media (max-width: $desktop-small) {
    width: 100%;
    text-align: center;
  }
}

.conteudoAbout a {
  text-decoration: none;
}

.conteudoAbout h2 {
  margin-bottom: 1.875rem;
  font-size: 2rem;
  font-weight: 600;

  @media (max-width: $tablet) {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: $mobile) {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }
}

.conteudoAbout p {
  width: 85%;
  max-width: 100%;
  margin: 0 auto;
  font-size: 1.2rem;
  line-height: 2rem;
  text-align: justify;

  @media (max-width: $tablet) {
    width: 90%;
    font-size: 1.1rem;
    line-height: 1.8rem;
  }

  @media (max-width: $mobile) {
    width: 95%;
    font-size: 1rem;
    line-height: 1.6rem;
  }
}

.conteudoAbout {
  margin-top: 3.75rem;

  @media (max-width: $tablet) {
    margin-top: 3rem;
  }

  @media (max-width: $mobile) {
    margin-top: 2rem;
  }
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

  @media (max-width: $tablet) {
    margin-top: 3rem;
    margin-bottom: 3rem;
    max-width: 80%;
  }

  @media (max-width: $mobile) {
    margin-top: 2rem;
    margin-bottom: 2rem;
    max-width: 90%;
  }
}


.btnAbout,
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

  @media (max-width: $mobile) {
    font-size: 0.9rem;
    padding: 0.25rem 0.75rem;
    margin-top: 1.25rem;
  }
}


.btnAbout:hover,
.btnProjects button:hover {
  background-color: $hover;
  transform: scale(1.2);

  @media (max-width: $mobile) {
    transform: scale(1.1);
  }
}

// Modern Skills Section
.skills-section {
  position: relative;
  min-height: 100vh;
  padding: 6rem 2rem;

  @media (max-width: $tablet) {
    padding: 4rem 1.5rem;
  }

  @media (max-width: $mobile) {
    padding: 3rem 1rem;
  }
}

.skills-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.skills-header {
  text-align: center;
  margin-bottom: 4rem;

  h2 {
    color: $cor-light;
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, $cor-primaria 0%, lighten($cor-primaria, 10%) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: $tablet) {
      font-size: 2.5rem;
    }

    @media (max-width: $mobile) {
      font-size: 2rem;
    }
  }

  .skills-subtitle {
    color: $text-gray;
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;

    @media (max-width: $mobile) {
      font-size: 1rem;
    }
  }
}

.skills-categories {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: $tablet) {
    flex-wrap: wrap;
    gap: 1rem;
  }

  @media (max-width: $mobile) {
    flex-direction: column;
    gap: 0.5rem;
  }
}

.category {
  padding: 1rem 2rem;
  background: rgba($cor-light, 0.05);
  border: 1px solid rgba($cor-primaria, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  h3 {
    color: $cor-light;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  p {
    color: $text-gray;
    font-size: 0.9rem;
    margin: 0;
  }

  &:hover,
  &.active {
    transform: translateY(-5px);
    background: rgba($cor-primaria, 0.1);
    border-color: $cor-primaria;
    box-shadow: 0 10px 30px rgba($cor-primaria, 0.2);
  }

  &.active {
    background: rgba($cor-primaria, 0.15);
    border-color: $cor-primaria;
  }

  @media (max-width: $mobile) {
    padding: 0.8rem 1.5rem;
    
    h3 {
      font-size: 1rem;
    }
    
    p {
      font-size: 0.8rem;
    }
  }
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: $tablet) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.skill-card {
  position: relative;
  background: rgba($cor-light, 0.05);
  border: 1px solid rgba($cor-light, 0.1);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, $cor-primaria, lighten($cor-primaria, 15%));
    transform: scaleX(0);
    transition: transform 0.4s ease;
    transform-origin: left;
  }

  &:hover {
    transform: translateY(-8px);
    background: rgba($cor-light, 0.08);
    border-color: rgba($cor-primaria, 0.5);
    box-shadow: 
      0 20px 40px rgba($cor-primaria, 0.15),
      0 0 20px rgba($cor-primaria, 0.1);

    &::before {
      transform: scaleX(1);
    }

    .skill-overlay {
      opacity: 1;
      visibility: visible;
    }

    .skill-icon img {
      transform: scale(1.1) rotate(5deg);
    }
  }

  @media (max-width: $mobile) {
    padding: 1.5rem;
  }
}

.skill-icon {
  margin-bottom: 1.5rem;

  img {
    width: 60px;
    height: 60px;
    transition: all 0.4s ease;
    filter: drop-shadow(0 5px 15px rgba($cor-primaria, 0.3));

    @media (max-width: $mobile) {
      width: 50px;
      height: 50px;
    }
  }
}

.skill-content {
  h4 {
    color: $cor-light;
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 1rem;

    @media (max-width: $mobile) {
      font-size: 1.2rem;
    }
  }
}

.experience-badge {
  background: rgba($cor-primaria, 0.1);
  color: $cor-primaria;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  margin-top: 0.5rem;
  border: 1px solid rgba($cor-primaria, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: $mobile) {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }
}

.skill-level {
  .level-bar {
    width: 100%;
    height: 8px;
    background: rgba($cor-light, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;

    .level-fill {
      height: 100%;
      background: linear-gradient(90deg, $cor-primaria, lighten($cor-primaria, 15%));
      border-radius: 4px;
      transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;

      &::after {
        content: attr(data-level) '%';
        position: absolute;
        right: 8px;
        top: -25px;
        color: $cor-light;
        font-size: 0.8rem;
        font-weight: 600;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    }
  }

  .level-text {
    color: $cor-primaria;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.skill-card:hover .level-fill::after {
  opacity: 1;
}

.skill-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba($cor-primaria, 0.9), rgba($cor-primaria, 0.8));
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s ease;

  p {
    color: $cor-light;
    font-size: 1rem;
    text-align: center;
    line-height: 1.6;

    @media (max-width: $mobile) {
      font-size: 0.9rem;
      padding: 1rem;
    }
  }
}

.skills-stats {
  background: linear-gradient(135deg, rgba($cor-primaria, 0.1), rgba($cor-primaria, 0.05));
  border: 1px solid rgba($cor-primaria, 0.3);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  animation: fadeInUp 0.5s ease;

  @media (max-width: $mobile) {
    padding: 1.5rem;
  }
}

.stats-card {
  h3 {
    color: $cor-light;
    font-size: 1.8rem;
    margin-bottom: 1rem;
    font-weight: 600;

    @media (max-width: $mobile) {
      font-size: 1.5rem;
    }
  }

  p {
    color: $text-gray;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;

    @media (max-width: $mobile) {
      font-size: 1rem;
    }
  }

  .experience-years {
    span {
      color: $cor-primaria;
      font-size: 1.2rem;
      font-weight: 700;
      background: rgba($cor-primaria, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 25px;
      border: 1px solid rgba($cor-primaria, 0.3);

      @media (max-width: $mobile) {
        font-size: 1rem;
        padding: 0.4rem 0.8rem;
      }
    }
  }
}

// Animations
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skill-card {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.skill-card:nth-child(1) { animation-delay: 0.1s; }
.skill-card:nth-child(2) { animation-delay: 0.2s; }
.skill-card:nth-child(3) { animation-delay: 0.3s; }
.skill-card:nth-child(4) { animation-delay: 0.4s; }
.skill-card:nth-child(5) { animation-delay: 0.5s; }
.skill-card:nth-child(6) { animation-delay: 0.6s; }

// Legacy styles removal placeholder
.conhecimento {
  display: none; // Hide old section
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

  @media (max-width: $tablet) {
    width: 90%;
  }

  @media (max-width: $mobile) {
    width: 95%;
    padding: 1rem;
  }
}

.logofooter img {
  overflow: hidden;
  width: 5%;

  @media (max-width: $tablet) {
    width: 8%;
  }

  @media (max-width: $mobile) {
    width: 10%;
  }
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

  @media (max-width: $tablet) {
    margin-top: 8rem;
  }

  @media (max-width: $mobile) {
    margin-top: 6rem;
  }
}

// Add responsive layout for larger screens
@media (min-width: $desktop-small) {
  .conteudoAbout {
    flex-direction: row;
    gap: 3rem;
    padding: 0 5%;

    .text-container {
      width: 50%;
    }

    .card {
      width: 40%;

      img {
        max-width: 100%;
        height: auto;
      }
    }
  }
}

// Fix for small mobile screens
@media (max-width: 360px) {

  .apresentacao h1,
  .apresentacao h2,
  #nameTitulo span {
    font-size: 1.7rem;
  }

  .apresentacao p {
    font-size: 0.8rem;
  }

  .linkLP {
    width: 10rem;
  }

  .conteudoAbout p {
    font-size: 0.9rem;
    line-height: 1.4rem;
  }
}

// Animation for tech items
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

@keyframes appear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>