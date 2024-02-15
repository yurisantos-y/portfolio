<script setup>
import cardHome from '../components/cardHome.vue'
import { ref } from 'vue'

const showSpanDefault = ref(true);

const hideSpanDefault = () => {
  showSpanDefault.value = false;
}

const showSpanDefaultOnMouseLeave = () => {
  showSpanDefault.value = true;
}
</script>

<template>
  <div class="home-container">
    <div class="apresentacao">
      <h1 id="nameTitulo">{{ $t('salutation.hello') }} <span>Yuri Santos</span></h1>
      <h2>{{ $t('salutation.myname') }} </h2>
      <p>{{ $t('salutation.legend') }}</p>
    </div>
    <div class="bolaLP">

    </div>
    <div class="linkLP">
      <button class="btnSocial" id="btnGithub">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
      </button>
      <button class="btnSocial" id="btnLinkedIn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>
      </button>
      <button class="btnSocial" id="btnInstagram">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
      </button>
      <button class="btnSocial" id="btnWpp">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
      </button>
      <button class="btnSocial" id="btnEmail">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>
      </button>
    </div>
    <div>
      <h2 id="titleProjetos">{{ $t( 'salutation.projects' ) }}</h2>
    </div>

    <!-- Chamada do Card -->
  <cardHome/>


  </div>

  <div class="corpo">
    <div class="conteudos">
      <div class="conteudoAbout">
        <h2>{{ $t( 'about.titleAbout' ) }}</h2>
          <div class="lineAbout">
            <p>{{ $t( 'about.text' ) }}</p>
          </div>
          <a href="/about">
            <button class="btnAbout" id="btnNewButton">{{ $t('about.btnAbout') }}</button>
          </a> 
      </div>

      <div class="experiencia">
        <h2>{{ $t( 'experience.titleExperience' ) }}</h2>
        <div class="flexExperience">
          <p>{{ $t( 'experience.textExperience' ) }}</p>
        </div>
        <a href="/about">
        <button class="btnExp" id="btnNewButton">{{ $t('experience.titleExperience') }}</button>
        </a>
      </div>      
    </div>


    <div class="conhecimento">
      <h2>{{ $t( 'know.titleKnow' ) }}</h2>
      <span v-if="showSpanDefault" id="spanDefault">{{ $t( 'know.textDefault' ) }}</span>

      <div class="divVue">
        <p id="paragrafoVue">{{$t('know.vue')}}</p>
        <button class="btnVue" @mouseover="hideSpanDefault" @mouseleave="showSpanDefaultOnMouseLeave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M356.9 64.3H280l-56 88.6-48-88.6H0L224 448 448 64.3h-91.1zm-301.2 32h53.8L224 294.5 338.4 96.3h53.8L224 384.5 55.7 96.3z"/></svg>
        </button>
      </div>

      <div class="divHtml">
        <p id="paragrafoHtml">{{$t('know.html')}}</p>
        <button class="btnHtml" @mouseover="hideSpanDefault" @mouseleave="showSpanDefaultOnMouseLeave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M0 32l34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z"/></svg>
        </button>
      </div>

      <div class="divCss">
        <p id="paragrafoCss">{{$t('know.css')}}</p>
        <button class="btnCss" @mouseover="hideSpanDefault" @mouseleave="showSpanDefaultOnMouseLeave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M0 32l34.9 395.8L192 480l157.1-52.2L384 32H0zm313.1 80l-4.8 47.3L193 208.6l-.3 .1h111.5l-12.8 146.6-98.2 28.7-98.8-29.2-6.4-73.9h48.9l3.2 38.3 52.6 13.3 54.7-15.4 3.7-61.6-166.3-.5v-.1l-.2 .1-3.6-46.3L193.1 162l6.5-2.7H76.7L70.9 112h242.2z"/></svg>
        </button>
      </div>

      <div class="divTs">
        <p id="paragrafoTs">{{$t('know.ts')}}</p>
        <button class="btnTs" @mouseover="hideSpanDefault" @mouseleave="showSpanDefaultOnMouseLeave">
          <img src="../assets/TS.svg" alt="">
        </button>
      </div>

      <div class="divJs">
        <p id="paragrafoJs">{{$t('know.js')}}</p>
        <button class="btnJs" @mouseover="hideSpanDefault" @mouseleave="showSpanDefaultOnMouseLeave">
          <img src="../assets/JS.svg" alt="">
        </button>
      </div>

      <div class="divSass">
        <p id="paragrafoSass">{{$t('know.sass')}}</p>
        <button class="btnSass" @mouseover="hideSpanDefault" @mouseleave="showSpanDefaultOnMouseLeave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M301.8 378.9c-.3 .6-.6 1.1 0 0zm249.1-87a131.2 131.2 0 0 0 -58 13.5c-5.9-11.9-12-22.3-13-30.1-1.2-9.1-2.5-14.5-1.1-25.3s7.7-26.1 7.6-27.2-1.4-6.6-14.3-6.7-24 2.5-25.3 5.9a122.8 122.8 0 0 0 -5.3 19.1c-2.3 11.7-25.8 53.5-39.1 75.3-4.4-8.5-8.1-16-8.9-22-1.2-9.1-2.5-14.5-1.1-25.3s7.7-26.1 7.6-27.2-1.4-6.6-14.3-6.7-24 2.5-25.3 5.9-2.7 11.4-5.3 19.1-33.9 77.3-42.1 95.4c-4.2 9.2-7.8 16.6-10.4 21.6-.4 .8-.7 1.3-.9 1.7 .3-.5 .5-1 .5-.8-2.2 4.3-3.5 6.7-3.5 6.7v.1c-1.7 3.2-3.6 6.1-4.5 6.1-.6 0-1.9-8.4 .3-19.9 4.7-24.2 15.8-61.8 15.7-63.1-.1-.7 2.1-7.2-7.3-10.7-9.1-3.3-12.4 2.2-13.2 2.2s-1.4 2-1.4 2 10.1-42.4-19.4-42.4c-18.4 0-44 20.2-56.6 38.5-7.9 4.3-25 13.6-43 23.5-6.9 3.8-14 7.7-20.7 11.4-.5-.5-.9-1-1.4-1.5-35.8-38.2-101.9-65.2-99.1-116.5 1-18.7 7.5-67.8 127.1-127.4 98-48.8 176.4-35.4 189.8-5.6 19.4 42.5-41.9 121.6-143.7 133-38.8 4.3-59.2-10.7-64.3-16.3-5.3-5.9-6.1-6.2-8.1-5.1-3.3 1.8-1.2 7 0 10.1 3 7.9 15.5 21.9 36.8 28.9 18.7 6.1 64.2 9.5 119.2-11.8 61.8-23.8 109.9-90.1 95.8-145.6C386.5 18.3 293-.2 204.6 31.2c-52.7 18.7-109.7 48.1-150.7 86.4-48.7 45.6-56.5 85.3-53.3 101.9 11.4 58.9 92.6 97.3 125.1 125.7-1.6 .9-3.1 1.7-4.5 2.5-16.3 8.1-78.2 40.5-93.7 74.7-17.5 38.8 2.9 66.6 16.3 70.4 41.8 11.6 84.6-9.3 107.6-43.6s20.2-79.1 9.6-99.5c-.1-.3-.3-.5-.4-.8 4.2-2.5 8.5-5 12.8-7.5 8.3-4.9 16.4-9.4 23.5-13.3-4 10.8-6.9 23.8-8.4 42.6-1.8 22 7.3 50.5 19.1 61.7 5.2 4.9 11.5 5 15.4 5 13.8 0 20-11.4 26.9-25 8.5-16.6 16-35.9 16-35.9s-9.4 52.2 16.3 52.2c9.4 0 18.8-12.1 23-18.3v.1s.2-.4 .7-1.2c1-1.5 1.5-2.4 1.5-2.4v-.3c3.8-6.5 12.1-21.4 24.6-46 16.2-31.8 31.7-71.5 31.7-71.5a201.2 201.2 0 0 0 6.2 25.8c2.8 9.5 8.7 19.9 13.4 30-3.8 5.2-6.1 8.2-6.1 8.2a.3 .3 0 0 0 .1 .2c-3 4-6.4 8.3-9.9 12.5-12.8 15.2-28 32.6-30 37.6-2.4 5.9-1.8 10.3 2.8 13.7 3.4 2.6 9.4 3 15.7 2.5 11.5-.8 19.6-3.6 23.5-5.4a82.2 82.2 0 0 0 20.2-10.6c12.5-9.2 20.1-22.4 19.4-39.8-.4-9.6-3.5-19.2-7.3-28.2 1.1-1.6 2.3-3.3 3.4-5C434.8 301.7 450.1 270 450.1 270a201.2 201.2 0 0 0 6.2 25.8c2.4 8.1 7.1 17 11.4 25.7-18.6 15.1-30.1 32.6-34.1 44.1-7.4 21.3-1.6 30.9 9.3 33.1 4.9 1 11.9-1.3 17.1-3.5a79.5 79.5 0 0 0 21.6-11.1c12.5-9.2 24.6-22.1 23.8-39.6-.3-7.9-2.5-15.8-5.4-23.4 15.7-6.6 36.1-10.2 62.1-7.2 55.7 6.5 66.6 41.3 64.5 55.8s-13.8 22.6-17.7 25-5.1 3.3-4.8 5.1c.5 2.6 2.3 2.5 5.6 1.9 4.6-.8 29.2-11.8 30.3-38.7 1.6-34-31.1-71.4-89-71.1zm-429.2 144.7c-18.4 20.1-44.2 27.7-55.3 21.3C54.6 451 59.3 421.4 82 400c13.8-13 31.6-25 43.4-32.4 2.7-1.6 6.6-4 11.4-6.9 .8-.5 1.2-.7 1.2-.7 .9-.6 1.9-1.1 2.9-1.7 8.3 30.4 .3 57.2-19.1 78.3zm134.4-91.4c-6.4 15.7-19.9 55.7-28.1 53.6-7-1.8-11.3-32.3-1.4-62.3 5-15.1 15.6-33.1 21.9-40.1 10.1-11.3 21.2-14.9 23.8-10.4 3.5 5.9-12.2 49.4-16.2 59.2zm111 53c-2.7 1.4-5.2 2.3-6.4 1.6-.9-.5 1.1-2.4 1.1-2.4s13.9-14.9 19.4-21.7c3.2-4 6.9-8.7 10.9-13.9 0 .5 .1 1 .1 1.6-.1 17.9-17.3 30-25.1 34.8zm85.6-19.5c-2-1.4-1.7-6.1 5-20.7 2.6-5.7 8.6-15.3 19-24.5a36.2 36.2 0 0 1 1.9 10.8c-.1 22.5-16.2 30.9-25.9 34.4z"/></svg>
        </button>
      </div>

      <div class="divPython">
        <p id="paragrafoPython">{{$t('know.python')}}</p>
        <button class="btnPython" @mouseover="hideSpanDefault" @mouseleave="showSpanDefaultOnMouseLeave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M439.8 200.5c-7.7-30.9-22.3-54.2-53.4-54.2h-40.1v47.4c0 36.8-31.2 67.8-66.8 67.8H172.7c-29.2 0-53.4 25-53.4 54.3v101.8c0 29 25.2 46 53.4 54.3 33.8 9.9 66.3 11.7 106.8 0 26.9-7.8 53.4-23.5 53.4-54.3v-40.7H226.2v-13.6h160.2c31.1 0 42.6-21.7 53.4-54.2 11.2-33.5 10.7-65.7 0-108.6zM286.2 404c11.1 0 20.1 9.1 20.1 20.3 0 11.3-9 20.4-20.1 20.4-11 0-20.1-9.2-20.1-20.4 .1-11.3 9.1-20.3 20.1-20.3zM167.8 248.1h106.8c29.7 0 53.4-24.5 53.4-54.3V91.9c0-29-24.4-50.7-53.4-55.6-35.8-5.9-74.7-5.6-106.8 .1-45.2 8-53.4 24.7-53.4 55.6v40.7h106.9v13.6h-147c-31.1 0-58.3 18.7-66.8 54.2-9.8 40.7-10.2 66.1 0 108.6 7.6 31.6 25.7 54.2 56.8 54.2H101v-48.8c0-35.3 30.5-66.4 66.8-66.4zm-6.7-142.6c-11.1 0-20.1-9.1-20.1-20.3 .1-11.3 9-20.4 20.1-20.4 11 0 20.1 9.2 20.1 20.4s-9 20.3-20.1 20.3z"/></svg>
        </button>
      </div>

      <div class="divmySql">
        <p id="paragrafoMysql">{{$t('know.mysql')}}</p>
        <button class="btnMysql" @mouseover="hideSpanDefault" @mouseleave="showSpanDefaultOnMouseLeave">
          <img src="../assets/mySQL.svg" alt="">
        </button>
      </div>

      <div class="divFigma">
        <p id="paragrafoFigma">{{$t('know.figma')}}</p>
        <button class="btnFigma" @mouseover="hideSpanDefault" @mouseleave="showSpanDefaultOnMouseLeave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M14 95.8C14 42.9 56.9 0 109.8 0H274.2C327.1 0 370 42.9 370 95.8C370 129.3 352.8 158.8 326.7 175.9C352.8 193 370 222.5 370 256C370 308.9 327.1 351.8 274.2 351.8H272.1C247.3 351.8 224.7 342.4 207.7 326.9V415.2C207.7 468.8 163.7 512 110.3 512C57.5 512 14 469.2 14 416.2C14 382.7 31.2 353.2 57.2 336.1C31.2 319 14 289.5 14 256C14 222.5 31.2 193 57.2 175.9C31.2 158.8 14 129.3 14 95.8zM176.3 191.6H109.8C74.2 191.6 45.4 220.4 45.4 256C45.4 291.4 74 320.2 109.4 320.4C109.5 320.4 109.7 320.4 109.8 320.4H176.3V191.6zM207.7 256C207.7 291.6 236.5 320.4 272.1 320.4H274.2C309.7 320.4 338.6 291.6 338.6 256C338.6 220.4 309.7 191.6 274.2 191.6H272.1C236.5 191.6 207.7 220.4 207.7 256zM109.8 351.8C109.7 351.8 109.5 351.8 109.4 351.8C74 352 45.4 380.8 45.4 416.2C45.4 451.7 74.6 480.6 110.3 480.6C146.6 480.6 176.3 451.2 176.3 415.2V351.8H109.8zM109.8 31.4C74.2 31.4 45.4 60.2 45.4 95.8C45.4 131.4 74.2 160.2 109.8 160.2H176.3V31.4H109.8zM207.7 160.2H274.2C309.7 160.2 338.6 131.4 338.6 95.8C338.6 60.2 309.7 31.4 274.2 31.4H207.7V160.2z"/></svg>
        </button>

      </div>
      <div class="bolaConhecimento"></div>
    </div>
  </div>

</template>

<style lang="scss">
@import '../scss/style.scss';

.home-container {
  height: 100vh;
  width: 100%;
  background-image: url(../assets/bg.svg);
  background-color: $cor-light;
  background-position: center;
  background-size: cover;
  border-radius: 0 0 60px 60px;
  overflow-x: hidden;
}

.apresentacao{
  margin-top: 13%;
  margin-left: auto;
  margin-right: auto;
  color: $cor-textDark;
  cursor: default;
  text-align: center;
}

.apresentacao h1{
  font-weight: 800;
  font-size: 3.6rem;
  color: $cor-textDark;
  margin-bottom: -5px;
  text-align: center;
}

.apresentacao h2{
  width: 90vw;
  font-size: 3.6rem;
  font-weight: 800;
  letter-spacing: -3px;
  color: $cor-textDark;
  text-align: center;
  margin: 0 auto;
}

#nameTitulo span {
  background: rgb(237,76,92);
  background: linear-gradient(135deg, rgba(237,76,92,1) 0%, rgba(255,157,99,1) 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 300% 300%;
  animation: gradiente 2s ease-in-out infinite;
  font-size: 3.6rem;
  text-align: center;
}

.apresentacao p{
  max-width: 60vw;
  margin-top: 10px;
  line-height: 1.8rem;
  color: $text-gray;
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
  margin: 0 auto;
}

.linkLP{
  width: 250px;
  height: 40px;
  border-radius: 6px;
  background-color: $bg-icon;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-top: 26px;
  justify-content: center;
  align-items: center;
}

.btnSocial {
  width: 25px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  margin: 0 auto;
  display: flex;
  align-items: center;
  fill: $icon-off;

  &:hover {
    transform: scale(1.2);
    transition: fill 0.3s ease, transform 0.3s ease;
  }
}

#btnGithub:hover{ fill: $git;}
#btnLinkedIn:hover{ fill: $linkedIn;}
#btnInstagram:hover{ fill: $cor-primaria; }
#btnEmail:hover{ fill: $git;}
#btnWpp:hover{ fill: $wpp; }


#titleProjetos {
  font-weight: 700;
  font-size: 1.8rem;
  text-align: center;
  position: absolute;
  color: $cor-textDark;
  width: 100%;
  top: 84%;
  transform: translateY(-50%);
}

.corpo{
  height: 1300px;
  background-color: $cor-dark;
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
  margin-bottom: 30px;
}

.conteudos p {
  display: flex;
  justify-content: start;
  text-align: left;
  line-height: 2rem;
}

.conteudoAbout, .experiencia {
  flex: 1;
  margin-right: 40px;
  margin-bottom: 30px;
  max-width: 40%;
}

.conteudoAbout {
  margin-top: 500px;
}

.experiencia {
  margin-top: 500px;
}

.btnAbout, .btnExp {
  border: none;
  background-color: $cor-primaria;
  color: $cor-light;
  padding: 5px 15px 5px 15px;
  border-radius: 5px;
  margin-top: 10px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  transition: .3s ease-in-out;
  margin-top: 25px;
  font-size: 1rem;
  box-shadow: 0px 0px 15px $shadow;
  cursor: pointer;
}


.btnAbout:hover, .btnExp:hover {
  background-color: $hover;
  transform: scale(1.2);
}

.conhecimento {
  position: relative;
  width: 100%;
  height: 100vh;
}


.conhecimento h2{
  color: $cor-light;
  margin-left: 12%;
  margin-top: 30px;
  margin-bottom: 25px;
  font-weight: 500;
  font-size: 2.5rem;
}

#spanDefault{
  margin-left: 12%;
  font-weight: 400;
  font-size: 1rem;
}

.conhecimento svg{
  max-width: 40px;
}

.conhecimento button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 80px;
  height: 80px;
  max-width: 80px;
  max-height: 80px;
  background-color: $transparente;
  border-radius: 10px;
  border: 0.5px solid $cor-light;
  color: $cor-light;
  cursor: pointer;
  animation: appear linear both;
  animation-timeline: view(block);
  animation-range: cover 0% cover 15%;
}

.btnVue { top: 12%; left: 67%; }
.btnHtml { top: 20%; left: 79%; }
.btnCss { top: 32%; left: 69%; }
.btnTs { top: 40%; left: 82%; }
.btnJs { top: 50%; left: 63%; }
.btnSass { top: 58%; left: 74%; }
.btnPython { top: 67%; left: 84%; }
.btnMysql { top: 70%; left: 65%; }
.btnFigma { top: 83%; left: 75%; }

.btnMysql img{
  max-width: 70px;
}

.btnJs img, .btnTs img{
  max-width: 38px;
  margin-top: 50%;
  margin-left: 32%;
}

.btnVue svg, .btnSass svg{
  max-width: 55px;
}

.divVue p, .divTs  p, .divJs p, .divFigma p, .divHtml p, .divmySql p, .divPython p, .divSass p, .divCss p
 { display: none; position: absolute; }

.divVue:hover  p, .divTs:hover  p, .divJs:hover  p, .divFigma:hover  p, .divHtml:hover  p, .divmySql:hover  p, .divPython:hover  p,
.divSass:hover  p, .divCss:hover  p 
{ display: block; 
  position: absolute; 
  font-size: 1rem; 
  text-align: left;
  margin-left: 12%;
  max-width: 40%;
}


.bolaConhecimento{
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: $cor-primaria;
  top: 65%;
  left: 14%;
  filter: blur(60px);
}



@keyframes appear {
  from{
    opacity: 0;
    transform: translateY(-100px);
  }
  to{
    opacity: 1;
    translate: 0 0;
  }
}

@keyframes gradiente {
  0%{
    background-position: 0% 50%;
  }
  50%{
    background-position: 100% 50%;
  }
  100%{
    background-position: 0% 50%;
  }
}
</style>