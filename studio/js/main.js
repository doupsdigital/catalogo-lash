gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Scroll-spy das abas ---------- */
const nav = document.querySelector('[data-tabs]');
if (nav) {
  const tabs = Array.from(nav.querySelectorAll('[data-tab]'));
  const sections = tabs.map((t) => document.getElementById(t.dataset.tab)).filter(Boolean);
  let current = null;
  let raf = null;

  const paint = (id) => {
    tabs.forEach((t) => t.classList.toggle('is-ativo', t.dataset.tab === id));
  };

  const sync = () => {
    const doc = document.scrollingElement || document.documentElement;
    const atBottom = doc.scrollTop >= doc.scrollHeight - doc.clientHeight - 2;
    let id = sections[0] && sections[0].id;
    if (atBottom) {
      id = sections[sections.length - 1].id;
    } else {
      sections.forEach((s) => {
        if (s.getBoundingClientRect().top <= 120) id = s.id;
      });
    }
    if (id === current) return;
    current = id;
    paint(id);
    const tab = tabs.find((t) => t.dataset.tab === id);
    if (tab) nav.scrollTo({ left: Math.max(0, tab.offsetLeft - 60), behavior: 'smooth' });
  };

  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = null; sync(); });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  sync();
}

/* ---------- Entrada da abertura — animação de carregamento, não ligada ao scroll. ---------- */
const aberturaTitulo = document.querySelector('.abertura__titulo');
if (aberturaTitulo) {
  if (reduceMotion) {
    gsap.set('.abertura__titulo, .abertura__lead, .abertura__badges', { opacity: 1, y: 0 });
  } else {
    gsap.fromTo(
      ['.abertura__titulo', '.abertura__lead', '.abertura__badges'],
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: .8, delay: .1, stagger: .08, ease: 'power2.out' },
    );
  }
}

/* ---------- Revela textos/itens ao entrar na viewport, escrubado pela posição do scroll. ---------- */
if (!reduceMotion) {
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
} else {
  gsap.set('.reveal', { opacity: 1, y: 0 });
}
