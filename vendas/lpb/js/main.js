/* ==========================================================================
   LASHMENU — SCRIPTS DE INTERAÇÃO E ANIMAÇÕES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initScrollReveal();
  initCounters();
  initFaqAccordion();
  initStyleTabs();
  initSmoothScroll();
  initMockupSlider();
});

/* ── 1. Header Scroll Effect ─────────────────────────────────────────────── */
function initHeaderScroll() {
  const header = document.querySelector('.header-nav');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ── 2. Scroll Reveal Animations ─────────────────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ── 3. Animated Counters ────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1200;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(eased * target);

      el.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ── 4. Mockup Live Preview & Visibility Controller ────────────────────── */
function initMockupSlider() {
  const nameLabel = document.getElementById('preview-screen-name');
  const iframe = document.getElementById('vitrine-preview-frame');
  const mockupWrapper = document.querySelector('.hero-mockup-wrapper');

  // Atualiza label do badge superior da tela
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'VITRINE_SCREEN_CHANGE') {
      const labelMap = {
        'Hero': 'Capa Oficial',
        'Procedimentos': 'Procedimentos & Valores',
        'Manutenção e Cuidados': 'Manutenção & Cuidados',
        'Agendamento': 'Orientações & Agendamento',
        'Contato': 'Contato & WhatsApp'
      };
      if (nameLabel) {
        nameLabel.textContent = labelMap[event.data.label] || event.data.label || 'Catálogo ao vivo';
      }
    }
  });

  if (!iframe || !mockupWrapper) return;

  // Dispara o tour apenas quando o celular estiver no campo de visão e reseta ao sair
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      try {
        if (entry.isIntersecting) {
          iframe.contentWindow?.postMessage({ type: 'START_TOUR' }, '*');
        } else {
          iframe.contentWindow?.postMessage({ type: 'RESET_TOUR' }, '*');
          if (nameLabel) {
            nameLabel.textContent = 'Capa Oficial';
          }
        }
      } catch (e) {}
    });
  }, {
    threshold: 0.25
  });

  // Trata carregamento do iframe
  iframe.addEventListener('load', () => {
    const rect = mockupWrapper.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible) {
      iframe.contentWindow?.postMessage({ type: 'START_TOUR' }, '*');
    }
  });

  observer.observe(mockupWrapper);
}

/* ── 5. FAQ Accordion ────────────────────────────────────────────────────── */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
      } else {
        item.classList.add('is-open');
      }
    });
  });
}

/* ── 6. Style Demo Switcher / Tabs ────────────────────────────────────────── */
function initStyleTabs() {
  const tabBtns = document.querySelectorAll('.demo-tab-btn');
  const iframe = document.querySelector('[data-demo-frame]');
  
  if (!tabBtns.length) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const src = btn.getAttribute('data-demo-src');
      if (iframe && src) {
        iframe.src = src;
      }
    });
  });
}

/* ── 7. Smooth Scroll for Anchor Links ───────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
