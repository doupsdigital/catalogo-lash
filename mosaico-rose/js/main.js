/* ==========================================================================
   LASHMENU — MODELO MOSAICO (JS INTERATIVO COM FILTROS, ANIMAÇÕES E MODAL)
   ========================================================================== */

const PROCEDIMENTOS = [
  {
    id: 'brasileiro',
    cat: 'volumes',
    catLabel: 'Extensão em Y',
    title: 'Volume Brasileiro',
    preco: 'R$ 150',
    duracao: '1h30',
    img: 'assets/img/volume-brasileiro.png',
    destaque: true,
    desc: 'Fios em formato Y tecnológicos que preenchem as falhas naturais, criando um efeito de rímel marcante, leve e com excelente retenção.',
    specs: [
      ['Investimento', 'R$ 150'],
      ['Manutenção', 'R$ 90 (até 20 dias)'],
      ['Duração', '1h30 em cabine'],
      ['Efeito', 'Preenchimento & Leveza']
    ]
  },
  {
    id: 'hibrido',
    cat: 'volumes',
    catLabel: 'Volume & Fio a Fio',
    title: 'Volume Híbrido',
    preco: 'R$ 150',
    duracao: '1h30',
    img: 'assets/img/volume-hibrido.png',
    tall: true,
    desc: 'A fusão perfeita entre a delicadeza do clássico fio a fio e tufos de volume, proporcionando textura irregular e densidade sob medida.',
    specs: [
      ['Investimento', 'R$ 150'],
      ['Manutenção', 'R$ 90 (até 20 dias)'],
      ['Duração', '1h30 em cabine'],
      ['Efeito', 'Textura & Densidade']
    ]
  },
  {
    id: 'gatinho',
    cat: 'mapping',
    catLabel: 'Mapping de Olhar',
    title: 'Mapping Gatinho',
    preco: 'Incluso',
    duracao: 'Design',
    img: 'assets/img/mapping-gatinho.png',
    desc: 'Crescimento milimétrico dos fios em direção ao canto externo. Alonga o olhar, cria um efeito felino refinado e valoriza o formato dos olhos.',
    specs: [
      ['Estilo de Mapping', 'Alongado / Felino'],
      ['Indicado para', 'Olhos amendoados e redondos'],
      ['Combinação', 'Brasileiro, Híbrido e Fox']
    ]
  },
  {
    id: 'egipcio',
    cat: 'volumes',
    catLabel: 'Extensão em W',
    title: 'Volume Egípcio',
    preco: 'R$ 150',
    duracao: '1h30',
    img: 'assets/img/volume-egipcio.png',
    desc: 'Fios em formato W que geram um efeito de volume denso, uniforme e aveludado sem sobrecarregar a raiz dos cílios naturais.',
    specs: [
      ['Investimento', 'R$ 150'],
      ['Manutenção', 'R$ 90 (até 20 dias)'],
      ['Duração', '1h30 em cabine'],
      ['Efeito', 'Densidade & Volume']
    ]
  },
  {
    id: 'fox',
    cat: 'volumes',
    catLabel: 'Assinatura',
    title: 'Fox Eyes',
    preco: 'R$ 150',
    duracao: '1h30',
    img: 'assets/img/fox-eyes.png',
    tall: true,
    desc: 'O desenho de maior sucesso do estúdio: canto externo esticado e alinhado para um visual sensual, sofisticado e marcante.',
    specs: [
      ['Investimento', 'R$ 150'],
      ['Manutenção', 'R$ 90 (até 20 dias)'],
      ['Duração', '1h30 em cabine'],
      ['Efeito', 'Lifting & Olhar Felino']
    ]
  },
  {
    id: 'classico',
    cat: 'volumes',
    catLabel: 'Fio a Fio Clássico',
    title: 'Clássico Fio a Fio',
    preco: 'R$ 150',
    duracao: '1h30',
    img: 'assets/img/classico-fio-a-fio.png',
    desc: 'Um fio de extensão colado sobre cada fio natural saudável. O resultado mais elegante e discreto: parece o seu cílio natural com rímel perfeito.',
    specs: [
      ['Investimento', 'R$ 150'],
      ['Manutenção', 'R$ 90 (até 20 dias)'],
      ['Duração', '1h30 em cabine'],
      ['Efeito', 'Natural & Discreto']
    ]
  },
  {
    id: 'boneca',
    cat: 'mapping',
    catLabel: 'Mapping de Olhar',
    title: 'Mapping Boneca',
    preco: 'Incluso',
    duracao: 'Design',
    img: 'assets/img/mapping-boneca.png',
    desc: 'Fios com maior comprimento posicionados estrategicamente no centro da íris. Abre e ilumina o olhar, proporcionando aspecto doce e jovial.',
    specs: [
      ['Estilo de Mapping', 'Olhar Aberto / Centralizado'],
      ['Indicado para', 'Olhos caídos ou fundos'],
      ['Combinação', 'Clássico e Brasileiro']
    ]
  },
  {
    id: 'lifting',
    cat: 'especiais',
    catLabel: 'Cílios Naturais',
    title: 'Lash Lifting & Tintura',
    preco: 'R$ 150',
    duracao: '1h',
    img: 'assets/img/lash-lifting.png',
    destaque: true,
    desc: 'Tratamento de curvatura e nutrição intensa nos seus próprios cílios naturais com tintura preta. Zero manutenção e durabilidade de 6 a 8 semanas.',
    specs: [
      ['Investimento', 'R$ 150'],
      ['Duração do procedimento', '1h em cabine'],
      ['Durabilidade do efeito', '6 a 8 semanas'],
      ['Manutenção diária', 'Zero manutenção']
    ]
  },
  {
    id: 'esquilo',
    cat: 'mapping',
    catLabel: 'Mapping de Olhar',
    title: 'Mapping Esquilo',
    preco: 'Incluso',
    duracao: 'Design',
    img: 'assets/img/mapping-esquilo.png',
    desc: 'Pico de comprimento posicionado exatamente no arco da sobrancelha. Ideal para disfarçar pálpebra caída e criar um efeito de lifting imediato.',
    specs: [
      ['Estilo de Mapping', 'Lifting da Pálpebra'],
      ['Indicado para', 'Pálpebras gordinhas ou caídas'],
      ['Combinação', 'Híbrido e Egípcio']
    ]
  },
  {
    id: 'remocao',
    cat: 'especiais',
    catLabel: 'Segurança & Saúde',
    title: 'Remoção Segura',
    preco: 'R$ 50',
    duracao: '30min',
    img: 'assets/img/remocao.png',
    desc: 'Remoção química indolor realizada com gel removedor específico que dissolve a cola sem arrancar ou danificar nenhum fio natural.',
    specs: [
      ['Investimento', 'R$ 50'],
      ['Duração', '30 minutos'],
      ['Segurança', 'Preserva os fios naturais 100%']
    ]
  },
  {
    id: 'cuidados',
    cat: 'especiais',
    catLabel: 'Guia de Durabilidade',
    title: 'Cuidados Pós-Aplicação',
    preco: 'Guia',
    duracao: 'Diário',
    img: 'assets/img/cuidados.jpg',
    desc: 'Orientações práticas para prolongar a retenção dos seus cílios: evitar água nas primeiras 24h, higienizar com shampoo neutro e escovar diariamente.',
    specs: [
      ['Primeiras 24h', 'Sem água ou vapor direto'],
      ['Higienização', 'Shampoo neutro para cílios'],
      ['Rotina diária', 'Escovinha seca 1x ao dia']
    ]
  }
];

// Elementos DOM
const mosaicoApp = document.querySelector('.mosaico-app');
const sections = document.querySelectorAll('.mosaico-app > section');
const gridEl = document.querySelector('[data-grid]');
const contadorEl = document.querySelector('[data-contador]');
const filtroBtns = document.querySelectorAll('.filtro-chip');
const modalEl = document.querySelector('[data-modal]');
const modalSheetEl = document.querySelector('[data-modal-sheet]');
const modalFecharEl = document.querySelector('[data-modal-fechar]');

let filtroAtivo = 'todos';
let itemAbertoId = null;

// IntersectionObserver para Disparar Animações por Seção
function initSectionObserver() {
  const observerOptions = {
    root: mosaicoApp,
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
        // Se saiu da seção de catálogo, reseta os cards para reanimar quando voltar
        if (entry.target.classList.contains('secao-catalogo')) {
          document.querySelectorAll('.tile').forEach((t) => {
            t.classList.remove('is-revealed');
          });
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

// Observer Individual para os Cards do Mosaico (Re-anima suavemente sempre que entra no viewport)
let tileObserver = null;

function initTileObserver() {
  if (tileObserver) {
    tileObserver.disconnect();
  }

  const observerOptions = {
    root: mosaicoApp,
    threshold: 0.08,
    rootMargin: '20px 0px 10px 0px'
  };

  let batchCount = 0;
  let batchTimer = null;

  tileObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const tile = entry.target;
      if (entry.isIntersecting) {
        const delay = (batchCount % 4) * 0.12;
        tile.style.animationDelay = `${delay}s`;
        tile.classList.add('is-revealed');
        
        batchCount++;
        clearTimeout(batchTimer);
        batchTimer = setTimeout(() => { batchCount = 0; }, 200);
      } else {
        // Ao sair do viewport, remove a classe para reanimar suavemente ao retornar
        tile.classList.remove('is-revealed');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.tile').forEach((tile) => {
    tileObserver.observe(tile);
  });
}

// Filtragem
function getItensVisiveis() {
  if (filtroAtivo === 'todos') return PROCEDIMENTOS;
  return PROCEDIMENTOS.filter(item => item.cat === filtroAtivo);
}

// Renderizar Grid Mosaico com animação escalonada
function renderGrid() {
  const lista = getItensVisiveis();
  contadorEl.textContent = `${lista.length} procedimento${lista.length === 1 ? '' : 's'} no mosaico`;

  gridEl.innerHTML = '';

  lista.forEach((item, index) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'tile';
    tile.style.animationDelay = `${(index % 8) * 0.06}s`;

    if (item.destaque) tile.classList.add('tile--destaque');
    if (item.tall) tile.classList.add('tile--tall');

    tile.innerHTML = `
      <img src="${item.img}" alt="${item.title}" class="tile__foto" loading="lazy">
      <div class="tile__scrim"></div>
      <div class="tile__conteudo">
        <span class="tile__cat">${item.catLabel}</span>
        <h3 class="tile__titulo">${item.title}</h3>
        <div class="tile__rodape-info">
          <span class="tile__preco">${item.preco}</span>
          <span class="tile__duracao">${item.duracao}</span>
        </div>
      </div>
    `;

    tile.addEventListener('click', () => abrirModal(item.id));
    gridEl.appendChild(tile);
  });

  initTileObserver();
}

// Filtros
filtroBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filtroBtns.forEach(b => b.classList.remove('is-ativo'));
    btn.classList.add('is-ativo');
    filtroAtivo = btn.dataset.filter;
    renderGrid();
  });
});

// Modal de Detalhes
function abrirModal(id) {
  const item = PROCEDIMENTOS.find(p => p.id === id);
  if (!item) return;

  itemAbertoId = id;
  const lista = getItensVisiveis();
  const idxAtual = lista.findIndex(p => p.id === id);
  const proxItem = lista[(idxAtual + 1) % lista.length];

  const mensagemWa = encodeURIComponent(`Olá Mariana! Gostaria de agendar o procedimento de ${item.title}.`);

  modalSheetEl.innerHTML = `
    <div class="modal__foto-wrap">
      <img src="${item.img}" alt="${item.title}" class="modal__foto">
      <div class="modal__scrim"></div>
      <button type="button" class="modal__fechar" aria-label="Fechar" onclick="fecharModal()">✕</button>
    </div>
    <div class="modal__corpo">
      <span class="modal__cat">${item.catLabel}</span>
      <h3 class="modal__titulo">${item.title}</h3>
      <p class="modal__desc">${item.desc}</p>
      
      <div class="modal__specs">
        ${item.specs.map(([k, v]) => `
          <div class="modal__spec">
            <span class="modal__spec-k">${k}</span>
            <span class="modal__spec-v">${v}</span>
          </div>
        `).join('')}
      </div>

      <div class="modal__acoes">
        <a href="https://wa.me/5511999999999?text=${mensagemWa}" target="_blank" rel="noopener" class="modal__cta">
          Agendar ${item.title} →
        </a>
        <button type="button" class="modal__proximo" title="Ver próximo procedimento" onclick="abrirModal('${proxItem.id}')">
          →
        </button>
      </div>
    </div>
  `;

  modalEl.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  modalEl.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

modalFecharEl.addEventListener('click', fecharModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalEl.hasAttribute('hidden')) {
    fecharModal();
  }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  renderGrid();
  initSectionObserver();
});
