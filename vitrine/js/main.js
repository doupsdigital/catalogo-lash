gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Entrada do título do Hero — animação de carregamento, não ligada ao scroll. */
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
  /* Revela textos/cards ao entrar na viewport, escrubado pela posição do scroll. */
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

  /* Parallax vertical das fotos full-bleed, escrubado pela posição do scroll. */
  const fotoWraps = document.querySelectorAll(
    '.hero__foto-wrap, .sobre__foto-wrap, .manutencao__foto-wrap, .cuidados__foto-wrap, .contato__foto-wrap',
  );
  fotoWraps.forEach((wrap) => {
    const section = wrap.closest('section');
    gsap.fromTo(
      wrap,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      },
    );
  });

  /* Ken Burns: zoom leve e contínuo enquanto a seção está em tela — não
     escrubado pelo scroll, dispara ao entrar/sair via IntersectionObserver
     (mesmo padrão do ProcessSection/PinnedPortfolio nos outros projetos). */
  gsap.set(fotoWraps, { scale: 1 });
  fotoWraps.forEach((wrap) => {
    const section = wrap.closest('section');
    const observer = new IntersectionObserver(
      ([entry]) => {
        gsap.to(wrap, {
          scale: entry.isIntersecting ? 1.08 : 1,
          duration: entry.isIntersecting ? 8 : 0.6,
          ease: entry.isIntersecting ? 'sine.out' : 'power2.out',
          overwrite: 'auto',
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(section);
  });
} else {
  gsap.set('.reveal', { opacity: 1, y: 0 });
}
