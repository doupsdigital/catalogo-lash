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
  initOption1Provador();
  initOption2CardSelectors();
  initOption3Carousel();
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

/* ── 8. Opção 1: Provador Interativo (Abas + Toggle de Cores) ─────────────── */
function initOption1Provador() {
  const modelBtns = document.querySelectorAll('.provador-model-btn');
  const colorBtns = document.querySelectorAll('.provador-color-btn');
  const imgEl = document.getElementById('provador-img');
  const badgeEl = document.getElementById('provador-badge');
  const tagEl = document.getElementById('provador-tag');
  const paletteTagEl = document.getElementById('provador-palette-tag');
  const titleEl = document.getElementById('provador-title');
  const descEl = document.getElementById('provador-desc');
  const checklistEl = document.getElementById('provador-checklist');
  const ctaEl = document.getElementById('provador-cta');
  const ctaTextEl = document.getElementById('provador-cta-text');

  if (!modelBtns.length || !imgEl) return;

  const data = {
    glamour: {
      title: 'Modelo Glamour',
      tag: 'Cinematográfico',
      desc: 'A experiência mais imersiva e cinematográfica com vídeo fluido na capa e carrossel completo de 13 procedimentos em tela cheia.',
      checklist: [
        '<strong>Vídeo Hero na capa:</strong> Transição instantânea sem corte.',
        '<strong>Carrossel imersivo:</strong> Navegação horizontal em tela cheia (100dvh).',
        '<strong>Modal de procedimentos:</strong> Tempo, investimento e orientações de manutenção.'
      ],
      midnight: {
        designer: 'Mariana Alves',
        img: '../../glamour-midnight/assets/img/Hero.png',
        link: '../../glamour-midnight/index.html'
      },
      rose: {
        designer: 'Mariana Alves',
        img: '../../glamour-rose/assets/img/Hero.png',
        link: '../../glamour-rose/index.html'
      }
    },
    harmonia: {
      title: 'Modelo Harmonia',
      tag: 'Mosaico Visual',
      desc: 'Mosaico moderno e encantador com fotos reais de cada mapping, chips de filtros inteligentes e foco na harmonização do olhar.',
      checklist: [
        '<strong>Grid fotográfico moderno:</strong> Visualização rica dos procedimentos.',
        '<strong>Filtros por categoria:</strong> Volumes, Mappings e Especiais.',
        '<strong>Visagismo em foco:</strong> Comparação intuitiva de resultados.'
      ],
      midnight: {
        designer: 'Amanda Carvalho',
        img: '../../harmonia-midnight/assets/img/Hero.png',
        link: '../../harmonia-midnight/index.html'
      },
      rose: {
        designer: 'Amanda Carvalho',
        img: '../../harmonia-rose/assets/img/Hero.png',
        link: '../../harmonia-rose/index.html'
      }
    },
    classico: {
      title: 'Modelo Clássico',
      tag: 'Lista Editorial',
      desc: 'Cardápio editorial limpo, prático e sofisticado. Acesso rápido e organizado a todos os serviços com máxima legibilidade.',
      checklist: [
        '<strong>Lista editorial limpa:</strong> Tipografia de alto luxo e contraste perfeito.',
        '<strong>Agilidade máxima:</strong> Decisão e agendamento em poucos segundos.',
        '<strong>100% responsivo:</strong> Leitura confortável em qualquer smartphone.'
      ],
      midnight: {
        designer: 'Bruna Carvalho',
        img: '../../classico-midnight/assets/img/Hero.png',
        link: '../../classico-midnight/index.html'
      },
      rose: {
        designer: 'Bruna Carvalho',
        img: '../../classico-rose/assets/img/Hero.png',
        link: '../../classico-rose/index.html'
      }
    }
  };

  let currentModel = 'glamour';
  let currentColor = 'midnight';

  function updateProvador() {
    const item = data[currentModel];
    const combo = item[currentColor];
    const colorLabel = currentColor === 'midnight' ? 'Midnight' : 'Rosé';
    const colorIcon = currentColor === 'midnight' ? '🖤' : '🎀';

    imgEl.style.opacity = '0.3';
    setTimeout(() => {
      imgEl.src = combo.img;
      imgEl.alt = `Prévia do ${item.title} (${colorLabel})`;
      imgEl.style.opacity = '1';
    }, 150);

    if (badgeEl) badgeEl.textContent = `${combo.designer} · ${item.title.replace('Modelo ', '')} ${colorLabel}`;
    if (tagEl) tagEl.textContent = item.tag;
    if (paletteTagEl) paletteTagEl.textContent = `${colorIcon} Versão ${colorLabel}`;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.desc;
    if (checklistEl) {
      checklistEl.innerHTML = item.checklist.map((li) => `<li>${li}</li>`).join('');
    }
    if (ctaEl) ctaEl.href = combo.link;
    if (ctaTextEl) ctaTextEl.textContent = `Testar ${item.title} (${colorLabel}) ao vivo`;
  }

  modelBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modelBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentModel = btn.getAttribute('data-model') || 'glamour';
      updateProvador();
    });
  });

  colorBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      colorBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentColor = btn.getAttribute('data-color') || 'midnight';
      updateProvador();
    });
  });
}

/* ── 9. Opção 2: Cards com Mini-Seletor de Cor Integrado ─────────────────── */
function initOption2CardSelectors() {
  const cards = document.querySelectorAll('.opt2-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    const pills = card.querySelectorAll('.opt2-pill');
    const img = card.querySelector('.opt2-card-img');
    const cta = card.querySelector('.opt2-cta');

    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pills.forEach((p) => p.classList.remove('is-active'));
        pill.classList.add('is-active');

        const color = pill.getAttribute('data-color');
        const link = pill.getAttribute('data-link');

        if (img) {
          const newSrc = color === 'rose' ? img.getAttribute('data-img-rose') : img.getAttribute('data-img-midnight');
          if (newSrc) {
            img.style.opacity = '0.3';
            setTimeout(() => {
              img.src = newSrc;
              img.style.opacity = '1';
            }, 120);
          }
        }

        if (cta && link) {
          cta.href = link;
        }
      });
    });
  });
}

/* ── 10. Opção 3: Carrossel Horizontal Swipe com Seletor Global ──────────── */
function initOption3Carousel() {
  const track = document.getElementById('opt3-carousel-track');
  const prevBtn = document.getElementById('opt3-btn-prev');
  const nextBtn = document.getElementById('opt3-btn-next');
  const dots = document.querySelectorAll('.opt3-dot');
  const paletteBtns = document.querySelectorAll('.opt3-palette-btn');
  const slides = document.querySelectorAll('.opt3-slide');

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
      const idx = parseInt(dot.getAttribute('data-slide'), 10);
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
    }, 60);
  }, { passive: true });

  // Seletor Global de Paleta (Troca todos os slides de uma vez)
  paletteBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      paletteBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const color = btn.getAttribute('data-opt3-color'); // 'midnight' ou 'rose'

      slides.forEach((slide) => {
        const img = slide.querySelector('.opt3-slide-img');
        const cta = slide.querySelector('.opt3-slide-cta');

        if (img) {
          const newSrc = color === 'rose' ? img.getAttribute('data-img-rose') : img.getAttribute('data-img-midnight');
          if (newSrc) {
            img.style.opacity = '0.3';
            setTimeout(() => {
              img.src = newSrc;
              img.style.opacity = '1';
            }, 120);
          }
        }

        if (cta) {
          const newLink = color === 'rose' ? cta.getAttribute('data-link-rose') : cta.getAttribute('data-link-midnight');
          if (newLink) {
            cta.href = newLink;
          }
        }
      });
    });
  });
}

