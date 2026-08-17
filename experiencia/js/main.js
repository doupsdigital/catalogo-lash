gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Barra de progresso ---------- */
const barra = document.querySelector('[data-progresso]');
if (barra) {
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => { barra.style.width = (self.progress * 100).toFixed(2) + '%'; },
  });
}

/* ---------- Rótulo do capítulo ---------- */
const capituloEl = document.querySelector('[data-capitulo]');
if (capituloEl && !reduceMotion) {
  document.querySelectorAll('[data-chapter]').forEach((section) => {
    const chapter = section.getAttribute('data-chapter');
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 40%',
      onEnter: () => { capituloEl.textContent = chapter; },
      onEnterBack: () => { capituloEl.textContent = chapter; },
    });
  });
}

/* ---------- CTA flutuante ---------- */
const cta = document.querySelector('[data-cta]');
const heroScene = document.querySelector('[data-scene="hero"]');
if (cta) {
  if (reduceMotion) {
    gsap.set(cta, { opacity: 1, y: 0 });
    cta.style.pointerEvents = 'auto';
  } else if (heroScene) {
    gsap.fromTo(
      cta,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: { trigger: heroScene, start: '55% top', end: '85% top', scrub: 1 },
        onUpdate() { cta.style.pointerEvents = gsap.getProperty(cta, 'opacity') > .6 ? 'auto' : 'none'; },
      },
    );
  }
}

if (!reduceMotion) {

  /* ---------- 01 Abertura ---------- */
  const heroImg = document.querySelector('[data-hero-img]');
  const heroVeil = document.querySelector('[data-hero-veil]');
  const heroTitulo = document.querySelector('[data-hero-titulo]');
  const heroCue = document.querySelector('[data-hero-cue]');

  if (heroScene) {
    const heroTl = gsap.timeline({
      scrollTrigger: { trigger: heroScene, start: 'top top', end: 'bottom top', scrub: 1 },
    });
    heroTl.fromTo(heroImg, { scale: 1.04, y: 0 }, { scale: 1.22, y: -26, ease: 'none', duration: 1 }, 0);
    heroTl.fromTo(heroVeil, { opacity: .85 }, { opacity: 1, ease: 'none', duration: 1 }, 0);
    heroTl.fromTo(heroCue, { opacity: 1 }, { opacity: 0, ease: 'none', duration: .125 }, 0);
    heroTl.fromTo(heroTitulo, { y: 0 }, { y: -90, ease: 'none', duration: 1 }, 0);
    heroTl.to(heroTitulo, { opacity: 0, ease: 'none', duration: .385 }, .45);
  }

  /* ---------- 02 Sobre ---------- */
  const sobreScene = document.querySelector('[data-scene="sobre"]');
  const sobreImg = document.querySelector('[data-sobre-img]');
  const beats = Array.from(document.querySelectorAll('[data-beat]'));

  if (sobreScene) {
    const sobreTl = gsap.timeline({
      scrollTrigger: { trigger: sobreScene, start: 'top top', end: 'bottom top', scrub: 1 },
    });
    sobreTl.fromTo(sobreImg, { scale: 1.14, y: 20 }, { scale: 1.02, y: -20, ease: 'none', duration: 1 }, 0);

    const n = beats.length;
    beats.forEach((beat, i) => {
      const start = i / n;
      const span = 1 / n;
      const fade = span * .22;
      sobreTl.to(beat, {
        keyframes: {
          '0%': { opacity: 0, y: 34, filter: 'blur(5px)' },
          '100%': { opacity: 1, y: 0, filter: 'blur(0px)' },
        },
        ease: 'none',
        duration: fade,
      }, start);
      sobreTl.to(beat, {
        keyframes: {
          '0%': { opacity: 1, y: 0, filter: 'blur(0px)' },
          '100%': { opacity: 0, y: -34, filter: 'blur(5px)' },
        },
        ease: 'none',
        duration: fade,
      }, start + span - fade);
    });
  }

  /* ---------- 03 Mapping ---------- */
  const mappingScene = document.querySelector('[data-scene="mapping"]');
  const eyeImgs = Array.from(document.querySelectorAll('[data-eye]'));
  const mapCards = Array.from(document.querySelectorAll('[data-mapcard]'));
  const eyeBtns = Array.from(document.querySelectorAll('[data-eyebtn]'));
  let activeEye = 0;

  function setActiveEye(i) {
    if (i === activeEye) return;
    activeEye = i;
    eyeImgs.forEach((el) => el.classList.toggle('is-ativa', +el.dataset.eye === i));
    mapCards.forEach((el) => el.classList.toggle('is-ativo', +el.dataset.mapcard === i));
    eyeBtns.forEach((el) => el.classList.toggle('is-ativo', +el.dataset.eyebtn === i));
  }

  eyeBtns.forEach((btn) => {
    const i = +btn.dataset.eyebtn;
    btn.addEventListener('click', () => setActiveEye(i));
    btn.addEventListener('mouseenter', () => setActiveEye(i));
  });

  if (mappingScene) {
    ScrollTrigger.create({
      trigger: mappingScene,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        const idx = Math.min(2, Math.floor(self.progress * 3));
        setActiveEye(idx);
      },
    });
  }

  /* ---------- 04 Título procedimentos ---------- */
  const tituloScene = document.querySelector('[data-scene="titulo"]');
  const tituloWrap = document.querySelector('[data-titulo-wrap]');
  const tituloLinha = document.querySelector('[data-titulo-linha]');

  if (tituloScene) {
    const tituloTl = gsap.timeline({
      scrollTrigger: { trigger: tituloScene, start: 'top top', end: 'bottom top', scrub: 1 },
    });
    tituloTl.fromTo(tituloWrap, { scale: .9, y: 0 }, { scale: 1.02, y: -40, ease: 'none', duration: 1 }, 0);
    tituloTl.to(tituloWrap, { opacity: 1, ease: 'none', duration: .22 }, 0);
    tituloTl.to(tituloWrap, { opacity: 0, ease: 'none', duration: .2 }, .8);
    tituloTl.fromTo(tituloLinha, { height: 0 }, { height: 46, ease: 'none', duration: .7 }, 0);
  }

  /* ---------- Linhas — revela ao entrar, esmaece ao sair (escrubado). ---------- */
  document.querySelectorAll('.reveal-linha').forEach((el) => {
    gsap.to(el, {
      keyframes: {
        '0%': { opacity: 0, y: 30 },
        '20%': { opacity: 1, y: 0 },
        '80%': { opacity: 1, y: 0 },
        '100%': { opacity: 0, y: -14 },
      },
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  });

  /* ---------- 05 Cuidados ---------- */
  const cuidadosScene = document.querySelector('[data-scene="cuidados"]');
  const cuidadosImg = document.querySelector('[data-cuidados-img]');
  const trilha = document.querySelector('[data-trilha]');
  const trilhaBarra = document.querySelector('[data-trilha-barra]');

  if (cuidadosScene && trilha) {
    const maxX = () => Math.max(0, trilha.scrollWidth - window.innerWidth + 40);
    const cuidadosTl = gsap.timeline({
      scrollTrigger: { trigger: cuidadosScene, start: 'top top', end: 'bottom top', scrub: 1 },
    });
    cuidadosTl.fromTo(cuidadosImg, { scale: 1.1, y: 15 }, { scale: 1.02, y: -15, ease: 'none', duration: 1 }, 0);
    cuidadosTl.fromTo(trilha, { x: 0 }, { x: () => -maxX(), ease: 'none', duration: 1 }, 0);
    cuidadosTl.fromTo(trilhaBarra, { width: '20%' }, { width: '100%', ease: 'none', duration: 1 }, 0);
  }

  /* ---------- Parallax full-bleed (fotos de contato) ---------- */
  const contatoImg = document.querySelector('[data-contato-img]');
  if (contatoImg) {
    const section = contatoImg.closest('.exp-contato__foto-wrap');
    gsap.fromTo(
      contatoImg,
      { yPercent: -6, scale: 1.1 },
      {
        yPercent: 6,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
      },
    );
  }

} else {
  gsap.set('.reveal-linha, .exp-agenda__titulo, .exp-agenda__grade, .exp-contato__acoes', { opacity: 1, y: 0 });
  gsap.set('[data-beat="0"]', { opacity: 1, y: 0, filter: 'blur(0px)' });
  gsap.set('[data-titulo-wrap]', { opacity: 1 });
}
