gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Entrada do título da capa — animação de carregamento, não ligada ao scroll. */
const heroTitulo = document.querySelector('.hero__titulo');
if (heroTitulo) {
  if (reduceMotion) {
    gsap.set(heroTitulo, { opacity: 1, y: 0 });
  } else {
    gsap.fromTo(
      heroTitulo,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1.1, delay: 0.15, ease: 'power2.out' },
    );
  }
}

if (!reduceMotion) {
  /* Revela textos/itens ao entrar na viewport, escrubado pela posição do scroll. */
  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          end: 'top 58%',
          scrub: 1,
        },
      },
    );
  });

  /* Barra de capítulo: rótulo atualizado por ScrollTrigger conforme o capítulo ativo. */
  const label = document.querySelector('[data-chapter-label]');
  if (label) {
    document.querySelectorAll('[data-chapter]').forEach((section) => {
      const chapter = section.getAttribute('data-chapter');
      ScrollTrigger.create({
        trigger: section,
        start: 'top 55%',
        end: 'bottom 40%',
        onEnter: () => { label.textContent = chapter; },
        onEnterBack: () => { label.textContent = chapter; },
      });
    });
  }
} else {
  gsap.set('.reveal', { opacity: 1, y: 0 });
}
