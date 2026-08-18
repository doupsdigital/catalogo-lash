document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = document.querySelectorAll('.vitrine > section');
  const fotoWraps = document.querySelectorAll(
    '.hero__foto-wrap, .sobre__foto-wrap, .manutencao__foto-wrap, .cuidados__foto-wrap, .contato__foto-wrap'
  );

  // Set initial scales for photo wraps
  if (fotoWraps.length > 0 && typeof gsap !== 'undefined') {
    gsap.set(fotoWraps, { scale: 1 });
  }

  // IntersectionObserver to handle active section snap detection & animations (1 scroll = 1 section snap model)
  const observerOptions = {
    root: document.querySelector('.vitrine'),
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const section = entry.target;
      const wrap = section.querySelector(
        '.hero__foto-wrap, .sobre__foto-wrap, .manutencao__foto-wrap, .cuidados__foto-wrap, .contato__foto-wrap'
      );

      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        section.classList.add('is-active');

        // Ken Burns zoom effect on background photo when section becomes active
        if (wrap && !reduceMotion && typeof gsap !== 'undefined') {
          gsap.to(wrap, {
            scale: 1.08,
            duration: 7,
            ease: 'sine.out',
            overwrite: 'auto',
          });
        }
      } else {
        section.classList.remove('is-active');

        // Reset photo scale smoothly when section is left
        if (wrap && !reduceMotion && typeof gsap !== 'undefined') {
          gsap.to(wrap, {
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
});

/* ---------- Detalhe do procedimento (modal) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PROCEDIMENTOS = [
    {
      id: 'brasileiro', img: 'assets/img/volume-brasileiro.png', alt: 'Volume brasileiro em cílios',
      cat: 'Volume', nome: 'Volume Brasileiro',
      desc: 'Fios em Y que preenchem as falhas e criam efeito de rímel leve, sem peso no olhar.',
      specs: [['Investimento', 'R$ 150'], ['Manutenção', 'R$ 90'], ['Duração', '1h30'], ['Retorno', '15 a 20 dias']],
    },
    {
      id: 'hibrido', img: 'assets/img/volume-hibrido.png', alt: 'Volume híbrido de cílios',
      cat: 'Volume', nome: 'Volume Híbrido',
      desc: 'Mistura de fio a fio e volume no mesmo desenho: textura de cílio real com a densidade do volume.',
      specs: [['Investimento', 'R$ 150'], ['Manutenção', 'R$ 90'], ['Duração', '1h30'], ['Retorno', '15 a 20 dias']],
    },
    {
      id: 'egipcio', img: 'assets/img/volume-egipcio.png', alt: 'Aplicação de volume egípcio',
      cat: 'Volume', nome: 'Volume Egípcio',
      desc: 'Desenho marcado com fios em leque e pontas definidas. Presença sem perder a naturalidade.',
      specs: [['Investimento', 'R$ 150'], ['Manutenção', 'R$ 90'], ['Duração', '1h30'], ['Retorno', '15 a 20 dias']],
    },
    {
      id: 'foxeyes', img: 'assets/img/fox-eyes.png', alt: 'Efeito fox eyes em cílios',
      cat: 'Assinatura', nome: 'Fox Eyes',
      desc: 'O desenho mais pedido da casa: canto externo esticado, olhar felino e simétrico. Exige mapping milimétrico.',
      specs: [['Investimento', 'R$ 150'], ['Manutenção', 'R$ 90'], ['Duração', '1h30'], ['Retorno', '15 a 20 dias']],
    },
    {
      id: 'lifting', img: 'assets/img/lash-lifting.png', alt: 'Procedimento de lash lifting',
      cat: 'Sem extensão', nome: 'Lash Lifting',
      desc: 'Curvatura no seu próprio fio, com nutrição e tintura. Zero manutenção diária, efeito de 6 a 8 semanas.',
      specs: [['Investimento', 'R$ 150'], ['Manutenção', 'R$ 90'], ['Duração', '1h']],
    },
    {
      id: 'classico', img: 'assets/img/classico-fio-a-fio.png', alt: 'Extensão de cílios clássico fio a fio',
      cat: 'Fio a fio', nome: 'Clássico Fio a Fio',
      desc: 'Um fio de extensão para cada fio natural. O resultado mais discreto da casa: parece cílio seu, só melhor.',
      specs: [['Investimento', 'R$ 150'], ['Manutenção', 'R$ 90'], ['Duração', '1h30'], ['Retorno', '15 a 20 dias']],
    },
    {
      id: 'remocao', img: 'assets/img/remocao.png', alt: 'Remoção de extensão de cílios',
      cat: 'Sessão única', nome: 'Remoção',
      desc: 'Remoção segura das extensões com produto específico, sem puxar ou danificar o fio natural.',
      specs: [['Investimento', 'R$ 100'], ['Duração', '45min']],
    },
  ];

  const vitrine = document.querySelector('.vitrine');
  const cards = document.querySelectorAll('.card-procedimento');
  const modal = document.querySelector('[data-detalhe]');
  const sheet = document.querySelector('[data-detalhe-sheet]');
  if (!vitrine || !modal || !sheet || cards.length === 0) return;

  let openId = null;

  function render(item) {
    const specsHtml = item.specs.map(([k, v]) => `
      <div class="detalhe-procedimento__spec">
        <span class="detalhe-procedimento__spec-k">${k}</span>
        <span class="detalhe-procedimento__spec-v">${v}</span>
      </div>
    `).join('');

    sheet.innerHTML = `
      <div class="detalhe-procedimento__foto-wrap">
        <img src="${item.img}" alt="${item.alt}" class="detalhe-procedimento__foto">
        <span class="detalhe-procedimento__scrim"></span>
        <button type="button" class="detalhe-procedimento__fechar" data-fechar aria-label="Fechar">×</button>
      </div>
      <div class="detalhe-procedimento__corpo">
        <span class="detalhe-procedimento__cat">${item.cat}</span>
        <h2 class="detalhe-procedimento__titulo">${item.nome}</h2>
        <p class="detalhe-procedimento__desc">${item.desc}</p>
        <div class="detalhe-procedimento__specs">${specsHtml}</div>
        <div class="detalhe-procedimento__acoes">
          <a href="https://wa.me/5511999999999" class="detalhe-procedimento__cta" target="_blank" rel="noopener">Quero esse</a>
          <button type="button" class="detalhe-procedimento__proximo" data-proximo aria-label="Próximo procedimento">→</button>
        </div>
      </div>
    `;

    sheet.querySelector('[data-fechar]').addEventListener('click', close);
    sheet.querySelector('[data-proximo]').addEventListener('click', next);
  }

  function open(id) {
    openId = id;
    const item = PROCEDIMENTOS.find((p) => p.id === id);
    if (!item) return;
    render(item);
    modal.hidden = false;
    vitrine.classList.add('modal-aberto');

    if (reduceMotion || typeof gsap === 'undefined') return;
    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: .2, ease: 'power1.out' });
    gsap.fromTo(sheet, { yPercent: 100 }, { yPercent: 0, duration: .42, ease: 'expo.out' });
  }

  function close() {
    const finish = () => {
      modal.hidden = true;
      vitrine.classList.remove('modal-aberto');
      openId = null;
    };
    if (reduceMotion || typeof gsap === 'undefined') { finish(); return; }
    gsap.to(sheet, { yPercent: 100, duration: .32, ease: 'power2.in' });
    gsap.to(modal, { opacity: 0, duration: .32, ease: 'power1.in', onComplete: finish });
  }

  function next() {
    const idx = PROCEDIMENTOS.findIndex((p) => p.id === openId);
    const nextItem = PROCEDIMENTOS[(idx + 1) % PROCEDIMENTOS.length];
    openId = nextItem.id;
    if (reduceMotion || typeof gsap === 'undefined') { render(nextItem); return; }
    gsap.to(sheet, {
      opacity: 0,
      duration: .12,
      ease: 'power1.in',
      onComplete: () => {
        render(nextItem);
        gsap.fromTo(sheet, { opacity: 0 }, { opacity: 1, duration: .18, ease: 'power1.out' });
      },
    });
  }

  cards.forEach((card) => {
    const id = card.dataset.proc;
    const item = PROCEDIMENTOS.find((p) => p.id === id);
    if (!item) return;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Ver detalhes de ' + item.nome);
    card.addEventListener('click', () => open(id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(id); }
    });
  });

  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
});
