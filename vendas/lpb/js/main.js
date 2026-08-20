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
  initModelsShowroom();
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

/* ── 8. Showroom de Modelos ao Vivo (Carrossel Swipe + Seletor de Cores) ──── */
function initModelsShowroom() {
  const track = document.getElementById('models-carousel-track');
  const prevBtn = document.getElementById('models-btn-prev');
  const nextBtn = document.getElementById('models-btn-next');
  const dots = document.querySelectorAll('.models-dot');
  const paletteBtns = document.querySelectorAll('.models-palette-btn');
  const slides = document.querySelectorAll('.models-slide');

  if (!track || !slides.length) return;

  let activeIndex = 0;

  function scrollToSlide(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    activeIndex = index;

    const slideWidth = track.clientWidth;
    track.scrollTo({
      left: slideWidth * activeIndex,
      behavior: 'smooth'
    });

    updateDots();
  }

  function updateDots() {
    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === activeIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => scrollToSlide(activeIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => scrollToSlide(activeIndex + 1));
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-models-slide'), 10);
      scrollToSlide(idx);
    });
  });

  // Atualiza dot ativo no scroll touch / manual
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const slideWidth = track.clientWidth || 1;
      const newIndex = Math.round(track.scrollLeft / slideWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < slides.length) {
        activeIndex = newIndex;
        updateDots();
      }
    }, 50);
  }, { passive: true });

  // Seletor Global de Paleta (Troca todos os modelos simultaneamente)
  paletteBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      paletteBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const color = btn.getAttribute('data-models-color'); // 'midnight' ou 'rose'
      const colorLabel = color === 'midnight' ? 'Midnight' : 'Rosé';

      slides.forEach((slide) => {
        const iframe = slide.querySelector('.showroom-iframe');
        const badge = slide.querySelector('.showroom-badge-text');
        const btnLink = slide.querySelector('.models-slide-btn');
        const modelKey = slide.getAttribute('data-slide-model');
        const prettyModelName = modelKey ? modelKey.charAt(0).toUpperCase() + modelKey.slice(1) : '';

        if (iframe) {
          const newSrc = color === 'rose' ? iframe.getAttribute('data-src-rose') : iframe.getAttribute('data-src-midnight');
          if (newSrc && iframe.src !== newSrc) {
            iframe.style.opacity = '0.25';
            setTimeout(() => {
              iframe.src = newSrc;
              iframe.style.opacity = '1';
            }, 120);
          }
        }

        if (badge && modelKey) {
          const mechanicLabels = {
            glamour: '🎬 Carrossel Imersivo',
            harmonia: '🧩 Mosaico Visual',
            classico: '📋 Lista Editorial'
          };
          const prefix = mechanicLabels[modelKey] || prettyModelName;
          badge.textContent = `${prefix} · ${colorLabel}`;
        }

        if (btnLink) {
          const newLink = color === 'rose' ? btnLink.getAttribute('data-link-rose') : btnLink.getAttribute('data-link-midnight');
          if (newLink) {
            btnLink.href = newLink;
          }
        }
      });
    });
  });
}


