gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const DATA = [
  { id: 'classico', cat: 'cilios', catLabel: 'Fio a fio', title: 'Clássico', meta: 'R$150 · 1h30',
    img: 'assets/img/classico.jpg', alt: 'Extensão de cílios clássico fio a fio', ratio: '0.78',
    desc: 'Um fio de extensão para cada fio natural. O resultado mais discreto da casa: parece cílio seu, só melhor.',
    rows: [['Investimento', 'R$ 150'], ['Manutenção', 'R$ 90'], ['Duração', '1h30'], ['Retorno', '15 a 20 dias']] },
  { id: 'brasileiro', cat: 'cilios', catLabel: 'Volume', title: 'Volume Brasileiro', meta: 'R$150 · 1h30',
    img: 'assets/img/volume-brasileiro.jpg', alt: 'Volume brasileiro em cílios', ratio: '1.05',
    desc: 'Fios em Y que preenchem as falhas e criam efeito de rímel leve, sem peso no olhar.',
    rows: [['Investimento', 'R$ 150'], ['Manutenção', 'R$ 90'], ['Duração', '1h30'], ['Retorno', '15 a 20 dias']] },
  { id: 'boneca', cat: 'mapping', catLabel: 'Mapping', title: 'Boneca', meta: 'Olhar aberto',
    img: 'assets/img/mapping-boneca.jpg', alt: 'Mapping boneca desenhado no olho', ratio: '1.2',
    desc: 'Fios mais longos no centro do olho. Abre o olhar e arredonda — ideal para quem quer um efeito doce e desperto.',
    rows: [['Efeito', 'Olho arredondado'], ['Combina com', 'Clássico e Brasileiro']] },
  { id: 'egipcio', cat: 'cilios', catLabel: 'Volume', title: 'Volume Egípcio', meta: 'R$150 · 1h30',
    img: 'assets/img/volume-egipcio.jpg', alt: 'Aplicação de volume egípcio', ratio: '0.8',
    desc: 'Desenho marcado com fios em leque e pontas definidas. Para quem quer presença sem perder a naturalidade.',
    rows: [['Investimento', 'R$ 150'], ['Manutenção', 'R$ 90'], ['Duração', '1h30'], ['Retorno', '15 a 20 dias']] },
  { id: 'gatinho', cat: 'mapping', catLabel: 'Mapping', title: 'Gatinho', meta: 'Olhar alongado',
    img: 'assets/img/mapping-gatinho.jpg', alt: 'Mapping gatinho com efeito alongado', ratio: '0.95',
    desc: 'Crescimento gradual até o canto externo. Alonga, puxa o olhar para cima e afina o formato do olho.',
    rows: [['Efeito', 'Olho alongado'], ['Combina com', 'Egípcio e Fox Eyes']] },
  { id: 'hibrido', cat: 'cilios', catLabel: 'Volume', title: 'Volume Híbrido', meta: 'R$150 · 1h30',
    img: 'assets/img/volume-hibrido.jpg', alt: 'Volume híbrido de cílios', ratio: '1.15',
    desc: 'Mistura de fio a fio e volume no mesmo desenho: textura de cílio real com a densidade do volume.',
    rows: [['Investimento', 'R$ 150'], ['Manutenção', 'R$ 90'], ['Duração', '1h30'], ['Retorno', '15 a 20 dias']] },
  { id: 'esquilo', cat: 'mapping', catLabel: 'Mapping', title: 'Esquilo', meta: 'Olhar levantado',
    img: 'assets/img/mapping-esquilo.jpg', alt: 'Mapping esquilo em cílios', ratio: '0.82',
    desc: 'Pico entre o centro e o canto externo. Levanta a pálpebra caída e dá um lifting visual imediato.',
    rows: [['Efeito', 'Lifting do olhar'], ['Combina com', 'Híbrido e Lash Lifting']] },
  { id: 'fox', cat: 'cilios', catLabel: 'Assinatura', title: 'Fox Eyes', meta: 'R$150 · 1h30',
    img: 'assets/img/fox-eyes.jpg', alt: 'Efeito fox eyes em cílios', ratio: '1.0',
    desc: 'O desenho mais pedido: canto externo esticado, olhar felino e simétrico. Exige mapping milimétrico.',
    rows: [['Investimento', 'R$ 150'], ['Manutenção', 'R$ 90'], ['Duração', '1h30'], ['Retorno', '15 a 20 dias']] },
  { id: 'lifting', cat: 'cilios', catLabel: 'Sem extensão', title: 'Lash Lifting', meta: 'R$150 · 1h',
    img: 'assets/img/lash-lifting.jpg', alt: 'Procedimento de lash lifting', ratio: '0.85',
    desc: 'Curvatura no seu próprio fio, com nutrição e tintura. Zero manutenção diária, efeito de 6 a 8 semanas.',
    rows: [['Investimento', 'R$ 150'], ['Manutenção', 'R$ 90'], ['Duração', '1h']] },
  { id: 'combo', cat: 'cuidados', catLabel: 'Combo', title: 'Cílios + Design', meta: '2h de sessão',
    img: 'assets/img/combo.jpg', alt: 'Design de sobrancelha em cabine', ratio: '1.1',
    desc: 'Extensão e design de sobrancelha na mesma visita. Reserve 2h — saia com o rosto inteiro alinhado.',
    rows: [['Duração', '2h'], ['Investimento', 'A combinar']] },
  { id: 'manutencao', cat: 'cuidados', catLabel: 'Regras', title: 'Manutenção', meta: '15 a 20 dias',
    img: 'assets/img/manutencao.jpg', alt: 'Escovinha de cílios em detalhe', ratio: '0.9',
    desc: 'A manutenção mantém o desenho e a saúde do fio natural. Feita entre 15 e 20 dias após a aplicação.',
    rows: [['Manutenção', 'R$ 90'], ['Após 25 dias', 'Valor reajustado'], ['Remoção', 'R$ 100']],
    bullets: ['Chegue sem maquiagem nos olhos.', 'Confirmo o horário 1 dia antes por WhatsApp.', 'Tolerância de 15 min de atraso.'] },
  { id: 'cuidados', cat: 'cuidados', catLabel: 'Pós-procedimento', title: 'Cuidados', meta: '5 regras de ouro',
    img: 'assets/img/cuidados.jpg', alt: 'Olho em detalhe após aplicação', ratio: '0.75',
    desc: 'A durabilidade do seu cílio depende dos primeiros dias. Cinco hábitos simples que mudam tudo.',
    rows: [['Primeiras 24h', 'Sem água nos olhos'], ['Rotina', 'Escovar 1x ao dia']],
    bullets: ['Evite água, vapor e sauna nas primeiras 24 horas.', 'Escove os fios pela manhã com a escovinha seca.', 'Não use rímel nem demaquilante oleoso.', 'Durma de lado ou de costas, evitando pressionar os fios.', 'Nunca puxe ou corte os fios — remoção só em cabine.'] }
];

const grid = document.querySelector('[data-grid]');
const contador = document.querySelector('[data-contador]');
const filtros = document.querySelectorAll('.filtro-chip');
const detalhe = document.querySelector('[data-detalhe]');
const detalheSheet = document.querySelector('[data-detalhe-sheet]');

let activeFilter = 'todos';
let openId = null;
let tileTriggers = [];

/* ---------- Grid ---------- */
function visibleData() {
  return activeFilter === 'todos' ? DATA : DATA.filter((d) => d.cat === activeFilter);
}

function renderGrid() {
  const list = visibleData();
  contador.textContent = `${list.length} trabalho${list.length === 1 ? '' : 's'} — toque para ver detalhes`;

  tileTriggers.forEach((t) => t.kill());
  tileTriggers = [];
  grid.innerHTML = '';

  list.forEach((d) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tile reveal';
    btn.style.setProperty('--ratio', d.ratio);
    btn.innerHTML = `
      <img src="${d.img}" alt="${d.alt}" class="tile__foto">
      <span class="tile__scrim"></span>
      <span class="tile__conteudo">
        <span class="tile__cat">${d.catLabel}</span>
        <span class="tile__titulo">${d.title}</span>
        <span class="tile__meta">${d.meta}</span>
      </span>
    `;
    btn.addEventListener('click', () => openDetalhe(d.id));
    grid.appendChild(btn);
  });

  if (reduceMotion) {
    gsap.set('.tile.reveal', { opacity: 1, y: 0 });
  } else {
    grid.querySelectorAll('.tile.reveal').forEach((tile) => {
      const tween = gsap.fromTo(
        tile,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: tile,
            start: 'top 92%',
            end: 'top 58%',
            scrub: 1,
          },
        },
      );
      tileTriggers.push(tween.scrollTrigger);
    });
  }
}

filtros.forEach((chip) => {
  chip.addEventListener('click', () => {
    activeFilter = chip.dataset.filter;
    filtros.forEach((c) => c.classList.toggle('is-ativo', c === chip));
    renderGrid();
  });
});

/* ---------- Detalhe ---------- */
function renderDetalhe(d) {
  const rowsHtml = d.rows
    .map(([k, v]) => `
      <div class="detalhe__spec">
        <span class="detalhe__spec-k">${k}</span>
        <span class="detalhe__spec-v">${v}</span>
      </div>
    `)
    .join('');

  const bulletsHtml = d.bullets && d.bullets.length
    ? `<div class="detalhe__bullets">${d.bullets.map((b) => `
        <div class="detalhe__bullet"><span>${b}</span></div>
      `).join('')}</div>`
    : '';

  detalheSheet.innerHTML = `
    <div class="detalhe__foto-wrap">
      <img src="${d.img}" alt="${d.alt}" class="detalhe__foto">
      <span class="detalhe__foto-scrim"></span>
      <button type="button" class="detalhe__fechar" data-detalhe-fechar aria-label="Fechar">×</button>
    </div>
    <div class="detalhe__corpo">
      <span class="detalhe__cat">${d.catLabel}</span>
      <h2 class="detalhe__titulo">${d.title}</h2>
      <p class="detalhe__desc">${d.desc}</p>
      <div class="detalhe__specs">${rowsHtml}</div>
      ${bulletsHtml}
      <div class="detalhe__acoes">
        <a href="https://wa.me/5511999999999" class="detalhe__cta" target="_blank" rel="noopener">Quero esse</a>
        <button type="button" class="detalhe__proximo" data-detalhe-proximo>→</button>
      </div>
    </div>
  `;

  detalheSheet.querySelector('[data-detalhe-fechar]').addEventListener('click', closeDetalhe);
  detalheSheet.querySelector('[data-detalhe-proximo]').addEventListener('click', nextDetalhe);
}

function openDetalhe(id) {
  openId = id;
  renderDetalhe(DATA.find((d) => d.id === id));
  detalhe.hidden = false;
  document.body.classList.add('modal-aberto');

  if (reduceMotion) {
    gsap.set(detalhe, { opacity: 1 });
    gsap.set(detalheSheet, { y: 0 });
  } else {
    gsap.fromTo(detalhe, { opacity: 0 }, { opacity: 1, duration: .18, ease: 'power1.out' });
    gsap.fromTo(detalheSheet, { yPercent: 100 }, { yPercent: 0, duration: .4, ease: 'expo.out' });
  }
}

function closeDetalhe() {
  const finish = () => {
    detalhe.hidden = true;
    document.body.classList.remove('modal-aberto');
    openId = null;
  };
  if (reduceMotion) {
    finish();
  } else {
    gsap.to(detalheSheet, { yPercent: 100, duration: .3, ease: 'power2.in' });
    gsap.to(detalhe, { opacity: 0, duration: .3, ease: 'power1.in', onComplete: finish });
  }
}

function nextDetalhe() {
  const idx = DATA.findIndex((d) => d.id === openId);
  const next = DATA[(idx + 1) % DATA.length];
  openId = next.id;

  if (reduceMotion) {
    renderDetalhe(next);
    return;
  }
  gsap.to(detalheSheet, {
    opacity: 0, duration: .12, ease: 'power1.in',
    onComplete: () => {
      renderDetalhe(next);
      gsap.fromTo(detalheSheet, { opacity: 0 }, { opacity: 1, duration: .18, ease: 'power1.out' });
    },
  });
}

detalhe.addEventListener('click', (e) => {
  if (e.target === detalhe) closeDetalhe();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !detalhe.hidden) closeDetalhe();
});

/* ---------- Entrada / seções ---------- */
if (!reduceMotion) {
  document.querySelectorAll('.mosaico__intro .reveal').forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: .8, delay: .1 + i * .08, ease: 'power2.out' },
    );
  });

  document.querySelectorAll('.mosaico__rodape .reveal').forEach((el) => {
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
  gsap.set('.mosaico__intro .reveal, .mosaico__rodape .reveal', { opacity: 1, y: 0 });
}

renderGrid();
