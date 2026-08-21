/* ==========================================================================
   LASHMENU — MOTOR DINÂMICO MULTI-TENANT DE RENDERIZAÇÃO DE CATÁLOGOS
   ========================================================================== */

(async function initDynamicCatalog() {
  const loader = document.getElementById('catalog-loader');
  const errorScreen = document.getElementById('catalog-error');
  const app = document.getElementById('catalog-app');
  const themeStylesheet = document.getElementById('theme-stylesheet');

  // 1. Extração do Subdomínio / Slug
  function getSlug() {
    const urlParams = new URLSearchParams(window.location.search);
    const querySlug = urlParams.get('slug') || urlParams.get('c') || urlParams.get('p');
    if (querySlug) return querySlug.toLowerCase().trim();

    // Tenta obter do Path (ex: /catalogo/marialuiza ou /c/marialuiza)
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2 && (pathParts[0] === 'catalogo' || pathParts[0] === 'c')) {
      return pathParts[1].toLowerCase().trim();
    }

    // Tenta obter do Subdomínio (ex: marialuiza.lashmenu.com)
    const hostname = window.location.hostname;
    const hostParts = hostname.split('.');
    if (hostParts.length >= 3 && hostParts[0] !== 'www' && hostParts[0] !== 'lashmenu-vendas') {
      return hostParts[0].toLowerCase().trim();
    }

    return null;
  }

  const slug = getSlug();

  if (!slug) {
    if (loader) loader.classList.add('is-hidden');
    if (errorScreen) errorScreen.classList.add('is-active');
    return;
  }

  // 2. Busca os Dados no Supabase
  try {
    const SUPABASE_URL = 'https://wffhptpsafllsmcsoiih.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZmhwdHBzYWZsbHNtY3NvaWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODkyMTYsImV4cCI6MjEwMjg2NTIxNn0.nwpvIwl8V6_KGIp5e5oeraAcGyt3oo8Kdam2hp6ajSQ';

    const orderRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?slug=eq.${encodeURIComponent(slug)}&select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!orderRes.ok) throw new Error('Falha ao buscar pedido');
    const orders = await orderRes.json();

    if (!orders || orders.length === 0) {
      if (loader) loader.classList.add('is-hidden');
      if (errorScreen) errorScreen.classList.add('is-active');
      return;
    }

    const order = orders[0];

    // Busca os Procedimentos Vinculados
    const servicesRes = await fetch(`${SUPABASE_URL}/rest/v1/order_services?order_id=eq.${order.id}&order=order_index.asc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    const services = servicesRes.ok ? await servicesRes.json() : [];

    // 3. Aplica o Tema Escolhido (Modelo + Paleta)
    const model = order.model_id || 'glamour';
    const color = order.color_id || 'midnight';
    const themePath = `../${model}-${color}/css/style.css`;
    if (themeStylesheet) {
      themeStylesheet.href = themePath;
    }

    document.title = `${order.client_name} — Catálogo Digital Oficial`;

    // 4. Renderiza o Template
    renderCatalog(order, services, model, color);

    // Oculta loader
    if (loader) {
      setTimeout(() => loader.classList.add('is-hidden'), 200);
    }
  } catch (err) {
    console.error('Erro na renderização do catálogo:', err);
    if (loader) loader.classList.add('is-hidden');
    if (errorScreen) errorScreen.classList.add('is-active');
  }

  // 5. Função de Renderização do Modelo
  function renderCatalog(order, services, model, color) {
    const designerName = order.client_name || 'Lash Designer';
    const cleanPhone = (order.whatsapp || '').replace(/\D/g, '');
    const instagram = (order.instagram || '').replace(/^@/, '');
    const location = order.location || '';
    const heroPhrase = order.hero_phrase || 'Especialista em extensão de cílios e visagismo do olhar.';
    
    // Mídia de Capa
    const isVideo = order.cover_media_type === 'video' && order.cover_media_url;
    const coverMediaHtml = isVideo
      ? `<video class="hero__foto hero__video" src="${order.cover_media_url}" autoplay muted loop playsinline preload="auto"></video>`
      : `<img src="${order.cover_media_url || `../${model}-${color}/assets/img/Hero.png`}" alt="${designerName}" class="hero__foto" onerror="this.src='../glamour-midnight/assets/img/hero.jpg'">`;

    // Renderiza os Cards de Procedimentos
    const servicesCardsHtml = services.map((svc, idx) => {
      const priceText = svc.price ? `R$ ${svc.price}` : 'Sob Consulta';
      const durationText = svc.duration ? `· ${svc.duration}` : '';
      const maintenanceText = svc.maintenance ? `· Manut: R$ ${svc.maintenance}` : '';
      const photoUrl = svc.photo_url || `../glamour-midnight/assets/img/hero.jpg`;

      return `
        <article class="card-procedimento" data-idx="${idx}" tabindex="0" role="button" aria-label="Ver detalhes de ${svc.name}">
          <div class="card-procedimento__foto-box">
            <img src="${photoUrl}" alt="${svc.name}" class="card-procedimento__foto" loading="lazy" onerror="this.src='../glamour-midnight/assets/img/hero.jpg'">
          </div>
          <div class="card-procedimento__info">
            <h3 class="card-procedimento__nome">${svc.name}</h3>
            <p class="card-procedimento__sub">${svc.category || 'Extensão de Cílios'}</p>
            <div class="card-procedimento__detalhes">
              <span class="card-procedimento__preco">${priceText}</span>
              <span class="card-procedimento__tempo">${durationText}</span>
            </div>
            ${svc.maintenance ? `<span class="card-procedimento__manut">${maintenanceText}</span>` : ''}
          </div>
        </article>
      `;
    }).join('');

    // Estrutura Principal da Vitrine
    app.innerHTML = `
      <div class="vitrine">
        <!-- 1. HERO CAPA -->
        <section class="hero" data-screen-label="Capa">
          <div class="hero__foto-wrap">
            ${coverMediaHtml}
          </div>
          <div class="hero__scrim"></div>
          <div class="hero__conteudo">
            <div class="hero__selo">
              <span>Seja Bem Vinda</span>
            </div>
            <div class="hero__titulo">
              <h1>${designerName}<br><em>Lash Designer</em></h1>
              <div class="hero__filete"></div>
              <p class="hero__frase">${heroPhrase}</p>
              <p class="hero__frase-cilios">Cílios pensados para o <em>seu olhar</em> — técnica segura, desenho personalizado.</p>
            </div>
            <div class="hero__scroll-cue">
              <span>Deslize</span>
              <div class="hero__scroll-linha"></div>
            </div>
          </div>
        </section>

        <!-- 2. SEÇÃO DE PROCEDIMENTOS -->
        <section class="procedimentos" id="catalogo" data-screen-label="Procedimentos">
          <div class="procedimentos__foto-wrap">
            <img src="${order.cover_media_url || `../${model}-${color}/assets/img/Hero.png`}" alt="${designerName}" class="procedimentos__foto" onerror="this.src='../glamour-midnight/assets/img/hero.jpg'">
          </div>
          <div class="procedimentos__scrim"></div>
          <div class="procedimentos__conteudo">
            <span class="etiqueta">Catálogo</span>
            <div class="procedimentos__corpo">
              <p class="procedimentos__frase">Procedimentos</p>
              <p class="procedimentos__dica">(Toque nos cards para ver detalhes e agendar)</p>
              <div class="procedimentos__lista">
                ${servicesCardsHtml}
              </div>
            </div>
          </div>
        </section>

        <!-- 3. FOOTER / AGENDAMENTO DIRETO -->
        <footer class="procedimentos__rodape">
          <div class="container-rodape">
            <a href="https://api.whatsapp.com/send?phone=${cleanPhone}&text=Ol%C3%A1%2C%20${encodeURIComponent(designerName)}!%20Estava%20olhando%20seu%20cat%C3%A1logo%20e%20gostaria%20de%20agendar%20um%20hor%C3%A1rio." target="_blank" rel="noopener noreferrer" class="btn-whatsapp-flutuante">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.767-2.587 5.768-5.766.001-3.18-2.586-5.767-5.768-5.767zm9.969 5.766c-.002 5.519-4.49 9.998-10 9.998-1.758 0-3.414-.467-4.869-1.282l-5.131 1.346 1.374-5.011c-.91-1.503-1.374-3.238-1.374-5.051 0-5.52 4.488-10 10-10 5.514 0 10 4.48 10 10z"/></svg>
              <span>Agendar com ${designerName.split(' ')[0]}</span>
            </a>
            ${instagram ? `<a href="https://instagram.com/${instagram}" target="_blank" rel="noopener noreferrer" class="link-instagram">@${instagram}</a>` : ''}
            ${location ? `<p class="texto-localizacao">📍 ${location}</p>` : ''}
          </div>
        </footer>

        <!-- 4. MODAL DE DETALHES DO PROCEDIMENTO -->
        <div class="modal-overlay is-hidden" id="modal-procedimento" aria-hidden="true">
          <div class="modal-backdrop" id="modal-backdrop"></div>
          <div class="modal-container">
            <button type="button" class="modal-fechar" id="modal-close-btn" aria-label="Fechar modal">✕</button>
            <div class="modal-foto-wrap">
              <img src="" alt="" class="modal-foto" id="modal-img">
            </div>
            <div class="modal-conteudo">
              <span class="modal-categoria" id="modal-cat">Técnica</span>
              <h2 class="modal-titulo" id="modal-title">Procedimento</h2>
              
              <div class="modal-precos">
                <div class="modal-preco-box">
                  <span class="modal-label">Aplicação</span>
                  <span class="modal-valor" id="modal-price">R$ 0,00</span>
                </div>
                <div class="modal-preco-box">
                  <span class="modal-label">Duração</span>
                  <span class="modal-valor" id="modal-duration">0h00</span>
                </div>
                <div class="modal-preco-box" id="modal-maint-box">
                  <span class="modal-label">Manutenção</span>
                  <span class="modal-valor" id="modal-maintenance">R$ 0,00</span>
                </div>
              </div>

              <div class="modal-descricoes">
                <div class="modal-bloco" id="modal-desc-block">
                  <h4>Sobre o Procedimento</h4>
                  <p id="modal-desc"></p>
                </div>
                <div class="modal-bloco" id="modal-effect-block">
                  <h4>Efeito no Olhar</h4>
                  <p id="modal-effect"></p>
                </div>
                <div class="modal-bloco" id="modal-rec-block">
                  <h4>Regra de Manutenção</h4>
                  <p id="modal-rec"></p>
                </div>
              </div>

              <a href="#" target="_blank" rel="noopener noreferrer" class="btn-modal-agendar" id="modal-whatsapp-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.767-2.587 5.768-5.766.001-3.18-2.586-5.767-5.768-5.767zm9.969 5.766c-.002 5.519-4.49 9.998-10 9.998-1.758 0-3.414-.467-4.869-1.282l-5.131 1.346 1.374-5.011c-.91-1.503-1.374-3.238-1.374-5.051 0-5.52 4.488-10 10-10 5.514 0 10 4.48 10 10z"/></svg>
                <span>Agendar este Procedimento</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    // 6. Interatividade do Modal
    initModalEvents(services, designerName, cleanPhone);
  }

  function initModalEvents(services, designerName, cleanPhone) {
    const modal = document.getElementById('modal-procedimento');
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('modal-close-btn');

    const modalImg = document.getElementById('modal-img');
    const modalCat = document.getElementById('modal-cat');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDuration = document.getElementById('modal-duration');
    const modalMaintenance = document.getElementById('modal-maintenance');
    const modalMaintBox = document.getElementById('modal-maint-box');

    const modalDesc = document.getElementById('modal-desc');
    const modalDescBlock = document.getElementById('modal-desc-block');
    const modalEffect = document.getElementById('modal-effect');
    const modalEffectBlock = document.getElementById('modal-effect-block');
    const modalRec = document.getElementById('modal-rec');
    const modalRecBlock = document.getElementById('modal-rec-block');
    const modalWhatsappBtn = document.getElementById('modal-whatsapp-btn');

    const closeModal = () => {
      if (modal) {
        modal.classList.add('is-hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    };

    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    document.querySelectorAll('.card-procedimento').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-idx'), 10);
        const svc = services[idx];
        if (!svc) return;

        if (modalImg) modalImg.src = svc.photo_url || '../glamour-midnight/assets/img/hero.jpg';
        if (modalCat) modalCat.textContent = svc.category || 'Extensão de Cílios';
        if (modalTitle) modalTitle.textContent = svc.name;
        if (modalPrice) modalPrice.textContent = svc.price ? `R$ ${svc.price}` : 'Sob Consulta';
        if (modalDuration) modalDuration.textContent = svc.duration || 'Consulte';

        if (svc.maintenance && modalMaintBox && modalMaintenance) {
          modalMaintBox.style.display = 'flex';
          modalMaintenance.textContent = `R$ ${svc.maintenance}`;
        } else if (modalMaintBox) {
          modalMaintBox.style.display = 'none';
        }

        if (svc.description && modalDesc && modalDescBlock) {
          modalDescBlock.style.display = 'block';
          modalDesc.textContent = svc.description;
        } else if (modalDescBlock) {
          modalDescBlock.style.display = 'none';
        }

        if (svc.effect && modalEffect && modalEffectBlock) {
          modalEffectBlock.style.display = 'block';
          modalEffect.textContent = svc.effect;
        } else if (modalEffectBlock) {
          modalEffectBlock.style.display = 'none';
        }

        if (svc.recommendation && modalRec && modalRecBlock) {
          modalRecBlock.style.display = 'block';
          modalRec.textContent = svc.recommendation;
        } else if (modalRecBlock) {
          modalRecBlock.style.display = 'none';
        }

        if (modalWhatsappBtn) {
          const msg = `Olá, ${designerName.split(' ')[0]}! Estava vendo seu catálogo digital e quero agendar o procedimento: *${svc.name}* (R$ ${svc.price || ''}).`;
          modalWhatsappBtn.href = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
        }

        if (modal) {
          modal.classList.remove('is-hidden');
          modal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }
})();
