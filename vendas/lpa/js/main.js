/* ---------- Checkout links (substituir pelos links reais quando disponíveis) ---------- */
const ESSENTIAL_CHECKOUT_URL = '#pacotes'; // TODO: substituir pelo link de checkout do Pacote Essencial
const CUSTOM_CHECKOUT_URL = '#pacotes'; // TODO: substituir pelo link de checkout do Pacote Customizado

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Checkout CTAs ---------- */
  document.querySelectorAll('[data-checkout="essential"]').forEach((el) => {
    el.setAttribute('href', ESSENTIAL_CHECKOUT_URL);
  });
  document.querySelectorAll('[data-checkout="custom"]').forEach((el) => {
    el.setAttribute('href', CUSTOM_CHECKOUT_URL);
  });

  /* ---------- Reveal on scroll ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Header solid on scroll ---------- */
  const topo = document.querySelector('[data-topo]');
  const onScrollHeader = () => {
    if (window.scrollY > 40) topo.classList.add('is-solido');
    else topo.classList.remove('is-solido');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Demo: tabs de estilo ---------- */
  const demoFrame = document.querySelector('[data-demo-frame]');
  const demoTabs = document.querySelectorAll('[data-demo-src]');

  function setDemo(src) {
    if (!demoFrame || demoFrame.getAttribute('src') === src) return;
    demoFrame.setAttribute('src', src);
    demoTabs.forEach((tab) => {
      const active = tab.dataset.demoSrc === src;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  demoTabs.forEach((tab) => {
    tab.addEventListener('click', () => setDemo(tab.dataset.demoSrc));
  });

  /* ---------- Cards de estilo: "Ver ao vivo" leva até a demo ---------- */
  document.querySelectorAll('[data-ver-demo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setDemo(btn.dataset.verDemo);
      document.querySelector('#demo').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Sticky CTA (mobile) ---------- */
  const stickyCta = document.querySelector('[data-sticky-cta]');
  const heroEl = document.querySelector('#hero');
  const pacotesEl = document.querySelector('#pacotes');
  const ctaFinalEl = document.querySelector('#cta-final');

  let pastHero = false;
  let insideExcluded = false;

  if (stickyCta && heroEl) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { pastHero = !entry.isIntersecting; });
      updateSticky();
    }, { threshold: 0 });
    heroObserver.observe(heroEl);

    const excludedObserver = new IntersectionObserver((entries) => {
      insideExcluded = entries.some((entry) => entry.isIntersecting);
      updateSticky();
    }, { threshold: 0.2 });
    if (pacotesEl) excludedObserver.observe(pacotesEl);
    if (ctaFinalEl) excludedObserver.observe(ctaFinalEl);

    function updateSticky() {
      stickyCta.classList.toggle('is-visible', pastHero && !insideExcluded);
    }
  }
});
