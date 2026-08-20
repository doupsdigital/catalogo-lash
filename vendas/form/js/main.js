/* ==========================================================================
   LASHMENU — FORMULÁRIO DE ONBOARDING MULTI-STEP (JAVASCRIPT)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMultiStepNavigation();
  initModelAndColorSelection();
  initServicesBuilder();
  initPhotoDropzone();
  initPhoneMask();
  initSlugFormatter();
  initFormSubmission();
});

/* ── 1. Navegação Multi-Step com Validação ───────────────────────────────── */
let currentStep = 1;
const totalSteps = 4;

function initMultiStepNavigation() {
  const nextBtns = document.querySelectorAll('.btn-next-step');
  const prevBtns = document.querySelectorAll('.btn-prev-step');

  nextBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.getAttribute('data-next'), 10);
      if (validateStep(currentStep)) {
        goToStep(targetStep);
      }
    });
  });

  prevBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.getAttribute('data-prev'), 10);
      goToStep(targetStep);
    });
  });
}

function goToStep(stepNumber) {
  if (stepNumber < 1 || stepNumber > totalSteps) return;

  const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  const targetStepEl = document.querySelector(`.form-step[data-step="${stepNumber}"]`);

  if (currentStepEl && targetStepEl) {
    currentStepEl.classList.remove('is-active');
    targetStepEl.classList.add('is-active');
    currentStep = stepNumber;

    updateProgressBar(currentStep);
    updateSummaryTags();

    // Rola suavemente para o topo do formulário no mobile
    const formCard = document.querySelector('.form-card');
    if (formCard) {
      const topOffset = formCard.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  }
}

function updateProgressBar(step) {
  const progressBarFill = document.getElementById('progress-bar-fill');
  const nodes = document.querySelectorAll('.step-node');

  const percent = ((step) / totalSteps) * 100;
  if (progressBarFill) {
    progressBarFill.style.width = `${percent}%`;
  }

  nodes.forEach((node) => {
    const nodeStep = parseInt(node.getAttribute('data-step-node'), 10);
    node.classList.toggle('is-active', nodeStep === step);
    node.classList.toggle('is-completed', nodeStep < step);
  });
}

function validateStep(step) {
  const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
  if (!currentStepEl) return true;

  const requiredInputs = currentStepEl.querySelectorAll('input[required]');
  let isValid = true;

  requiredInputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add('is-invalid');
      input.focus();
      input.style.borderColor = '#dc2626';
      setTimeout(() => {
        input.style.borderColor = '';
      }, 2500);
    }
  });

  return isValid;
}

/* ── 2. Provador Interativo ao Vivo (Seleção de Modelo & Cor) ────────────── */
const provadorModels = {
  glamour: {
    tag: 'Cinematográfico',
    title: 'Modelo 01 — Glamour',
    desc: 'A experiência mais imersiva e cinematográfica com vídeo fluido na capa e carrossel de fotos ampliadas em tela cheia.',
    checklist: [
      '<strong>Vídeo Hero na capa:</strong> Transição instantânea sem corte.',
      '<strong>Carrossel imersivo:</strong> Navegação horizontal de fotos.',
      '<strong>Modal completo:</strong> Detalhes, duração e manutenção.'
    ],
    nameMidnight: 'Mariana Alves · Glamour Midnight',
    nameRose: 'Mariana Alves · Glamour Rosé',
    srcMidnight: '../../glamour-midnight/index.html?preview=1',
    srcRose: '../../glamour-rose/index.html?preview=1'
  },
  harmonia: {
    tag: 'Mosaico Visual',
    title: 'Modelo 02 — Harmonia',
    desc: 'Mosaico visual fotográfico com filtros dinâmicos por técnica e foco na harmonização e realce do olhar.',
    checklist: [
      '<strong>Grade de fotos inteligente:</strong> Filtro por técnica.',
      '<strong>Toque nos cards:</strong> Modal completo com detalhes.',
      '<strong>Design leve e arejado:</strong> Valoriza fotos reais.'
    ],
    nameMidnight: 'Amanda Carvalho · Harmonia Midnight',
    nameRose: 'Amanda Carvalho · Harmonia Rosé',
    srcMidnight: '../../harmonia-midnight/index.html?preview=1',
    srcRose: '../../harmonia-rose/index.html?preview=1'
  },
  classico: {
    tag: 'Editorial Chic',
    title: 'Modelo 03 — Clássico',
    desc: 'Cardápio editorial categorizado, limpo e direto ao ponto, ideal para leitura rápida e agendamento prático.',
    checklist: [
      '<strong>Categorias organizadas:</strong> Clássico, Volumes e Especiais.',
      '<strong>Layout editorial limpo:</strong> Alta sofisticação visual.',
      '<strong>Agendamento imediato:</strong> Botão direto no WhatsApp.'
    ],
    nameMidnight: 'Bruna Carvalho · Clássico Midnight',
    nameRose: 'Bruna Carvalho · Clássico Rosé',
    srcMidnight: '../../classico-midnight/index.html?preview=1',
    srcRose: '../../classico-rose/index.html?preview=1'
  }
};

let activeProvadorModel = 'glamour';
let activeProvadorColor = 'midnight';

function initModelAndColorSelection() {
  const modelBtns = document.querySelectorAll('.provador-model-btn');
  const colorBtns = document.querySelectorAll('.provador-color-btn');

  const iframe = document.getElementById('provador-iframe');
  const badge = document.getElementById('provador-badge');
  const tag = document.getElementById('provador-tag');
  const paletteTag = document.getElementById('provador-palette-tag');
  const title = document.getElementById('provador-title');
  const desc = document.getElementById('provador-desc');
  const checklist = document.getElementById('provador-checklist');

  const hiddenModel = document.getElementById('input-selected-model');
  const hiddenColor = document.getElementById('input-selected-color');

  function updateProvadorView() {
    const data = provadorModels[activeProvadorModel];
    if (!data) return;

    // Atualiza classes ativas
    modelBtns.forEach((b) => b.classList.toggle('is-active', b.getAttribute('data-model') === activeProvadorModel));
    colorBtns.forEach((b) => b.classList.toggle('is-active', b.getAttribute('data-color') === activeProvadorColor));

    // Atualiza textos
    if (tag) tag.textContent = data.tag;
    if (paletteTag) paletteTag.textContent = activeProvadorColor === 'midnight' ? '🖤 Versão Midnight' : '🎀 Versão Rosé';
    if (title) title.textContent = data.title;
    if (desc) desc.textContent = data.desc;

    if (badge) {
      badge.textContent = activeProvadorColor === 'midnight' ? data.nameMidnight : data.nameRose;
    }

    if (checklist) {
      checklist.innerHTML = data.checklist.map((item) => `<li>${item}</li>`).join('');
    }

    // Atualiza iframe
    if (iframe) {
      const newSrc = activeProvadorColor === 'midnight' ? data.srcMidnight : data.srcRose;
      if (iframe.src !== newSrc) {
        iframe.style.opacity = '0.25';
        setTimeout(() => {
          iframe.src = newSrc;
          iframe.style.opacity = '1';
        }, 100);
      }
    }

    // Atualiza campos ocultos do form
    if (hiddenModel) hiddenModel.value = activeProvadorModel;
    if (hiddenColor) hiddenColor.value = activeProvadorColor;

    updateSummaryTags();
  }

  modelBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeProvadorModel = btn.getAttribute('data-model');
      updateProvadorView();
    });
  });

  colorBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeProvadorColor = btn.getAttribute('data-color');
      updateProvadorView();
    });
  });
}

/* ── 3. Builder Dinâmico de Procedimentos ───────────────────────────────── */
const defaultServices = [
  { name: 'Volume Brasileiro', price: '160,00', duration: '2h', maintenance: '90,00' },
  { name: 'Volume Russo', price: '180,00', duration: '2h15', maintenance: '100,00' },
  { name: 'Fox Eyes', price: '190,00', duration: '2h', maintenance: '110,00' },
  { name: 'Lash Lifting', price: '130,00', duration: '1h15', maintenance: '-' },
  { name: 'Mega Volume', price: '220,00', duration: '2h30', maintenance: '130,00' }
];

function initServicesBuilder() {
  const container = document.getElementById('services-builder');
  const addBtn = document.getElementById('btn-add-service');
  if (!container || !addBtn) return;

  // Carrega procedimentos padrão
  defaultServices.forEach((svc) => renderServiceRow(container, svc));

  // Botão Adicionar
  addBtn.addEventListener('click', () => {
    renderServiceRow(container, { name: '', price: '', duration: '', maintenance: '' });
  });
}

function renderServiceRow(container, data) {
  const row = document.createElement('div');
  row.className = 'service-row-card';
  row.innerHTML = `
    <div class="service-mini-field">
      <label class="sm-label">Procedimento</label>
      <input type="text" class="sm-input service-name" placeholder="Ex: Volume Egípcio" value="${data.name || ''}" required>
    </div>
    <div class="service-mini-field">
      <label class="sm-label">Valor (R$)</label>
      <input type="text" class="sm-input service-price" placeholder="160,00" value="${data.price || ''}">
    </div>
    <div class="service-mini-field">
      <label class="sm-label">Duração</label>
      <input type="text" class="sm-input service-duration" placeholder="2h" value="${data.duration || ''}">
    </div>
    <div class="service-mini-field">
      <label class="sm-label">Manutenção</label>
      <input type="text" class="sm-input service-maintenance" placeholder="90,00" value="${data.maintenance || ''}">
    </div>
    <button type="button" class="btn-remove-service" title="Remover procedimento">✕</button>
  `;

  row.querySelector('.btn-remove-service').addEventListener('click', () => {
    const allRows = container.querySelectorAll('.service-row-card');
    if (allRows.length > 1) {
      row.remove();
      updateSummaryTags();
    } else {
      alert('Você precisa ter pelo menos 1 procedimento no seu catálogo.');
    }
  });

  container.appendChild(row);
}

/* ── 4. Dropzone & Upload de Foto de Capa ────────────────────────────────── */
function initPhotoDropzone() {
  const dropzone = document.getElementById('avatar-dropzone');
  const fileInput = document.getElementById('input-avatar-file');
  const dropzoneEmpty = document.getElementById('dropzone-empty');
  const dropzonePreview = document.getElementById('dropzone-preview');
  const previewImg = document.getElementById('avatar-preview-img');
  const removeBtn = document.getElementById('btn-remove-avatar');

  if (!dropzone || !fileInput) return;

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previewImg.src = event.target.result;
        dropzoneEmpty.classList.add('is-hidden');
        dropzonePreview.classList.remove('is-hidden');
      };
      reader.readAsDataURL(file);
    }
  });

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.value = '';
      previewImg.src = '';
      dropzonePreview.classList.add('is-hidden');
      dropzoneEmpty.classList.remove('is-hidden');
    });
  }
}

/* ── 5. Máscara de Telefone (WhatsApp) ──────────────────────────────────── */
function initPhoneMask() {
  const phoneInput = document.getElementById('input-whatsapp');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      e.target.value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 6) {
      e.target.value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (value.length > 2) {
      e.target.value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (value.length > 0) {
      e.target.value = `(${value}`;
    }
  });
}

/* ── 6. Formatador de Subdomínio (Slug) ─────────────────────────────────── */
function initSlugFormatter() {
  const nameInput = document.getElementById('input-designer-name');
  const slugInput = document.getElementById('input-slug');
  if (!slugInput) return;

  // Ao digitar o nome, sugere o slug automaticamente se ainda estiver vazio
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      if (!slugInput.value.trim() && nameInput.value.trim()) {
        const firstWord = nameInput.value.trim().split(' ')[0];
        slugInput.value = formatSlug(firstWord);
      }
    });
  }

  slugInput.addEventListener('input', (e) => {
    e.target.value = formatSlug(e.target.value);
  });
}

function formatSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

/* ── 7. Atualização das Tags de Resumo na Etapa 4 ───────────────────────── */
function updateSummaryTags() {
  const nameVal = document.getElementById('input-designer-name')?.value || 'Sua Marca';
  const selectedModel = document.getElementById('input-selected-model')?.value || activeProvadorModel;
  const selectedColor = document.getElementById('input-selected-color')?.value || activeProvadorColor;
  const servicesCount = document.querySelectorAll('.service-row-card').length;

  const modelMap = { glamour: '✨ Modelo Glamour', harmonia: '🌸 Modelo Harmonia', classico: '👑 Modelo Clássico' };
  const colorMap = { midnight: '🖤 Midnight', rose: '🎀 Rosé' };

  const sumName = document.getElementById('sum-name');
  const sumModel = document.getElementById('sum-model');
  const sumColor = document.getElementById('sum-color');
  const sumServices = document.getElementById('sum-services');

  if (sumName) sumName.textContent = nameVal.trim() || 'Lash Designer';
  if (sumModel) sumModel.textContent = modelMap[selectedModel] || 'Modelo Glamour';
  if (sumColor) sumColor.textContent = colorMap[selectedColor] || 'Midnight';
  if (sumServices) sumServices.textContent = `${servicesCount} Procedimentos`;
}

/* ── 8. Envio do Formulário & Tela de Sucesso ───────────────────────────── */
function initFormSubmission() {
  const form = document.getElementById('onboarding-form');
  const successScreen = document.getElementById('success-screen');
  const successLinkDisplay = document.getElementById('success-link-display');
  const whatsappConfirmBtn = document.getElementById('btn-whatsapp-confirm');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const designerName = document.getElementById('input-designer-name')?.value || 'Lash Designer';
    const studioName = document.getElementById('input-studio-name')?.value || '';
    const whatsapp = document.getElementById('input-whatsapp')?.value || '';
    const instagram = document.getElementById('input-instagram')?.value || '';
    const location = document.getElementById('input-location')?.value || '';
    const slug = document.getElementById('input-slug')?.value || 'catalogo';
    
    const selectedModel = document.getElementById('input-selected-model')?.value || activeProvadorModel;
    const selectedColor = document.getElementById('input-selected-color')?.value || activeProvadorColor;

    // Procedimentos coletados
    const serviceRows = document.querySelectorAll('.service-row-card');
    const servicesList = [];
    serviceRows.forEach((row) => {
      const name = row.querySelector('.service-name')?.value;
      const price = row.querySelector('.service-price')?.value;
      const duration = row.querySelector('.service-duration')?.value;
      const maintenance = row.querySelector('.service-maintenance')?.value;
      if (name) {
        servicesList.push(`• ${name}: R$ ${price} (${duration}) | Manut: R$ ${maintenance}`);
      }
    });

    const pixKey = document.getElementById('input-pix-key')?.value || '';
    const depositRule = document.getElementById('input-deposit-rule')?.value || '';
    const extraNotes = document.getElementById('input-extra-notes')?.value || '';
    const driveLink = document.getElementById('input-drive-link')?.value || '';

    // Monta texto formatado para envio direto ao WhatsApp de suporte
    const message = `✨ *NOVO FORMULÁRIO DE PERSONALIZAÇÃO LASHMENU*\n\n` +
      `👤 *Lash Designer:* ${designerName}\n` +
      `🏢 *Studio:* ${studioName || 'Não informado'}\n` +
      `📱 *WhatsApp:* ${whatsapp}\n` +
      `📸 *Instagram:* @${instagram}\n` +
      `📍 *Localização:* ${location || 'Não informado'}\n` +
      `🌐 *Subdomínio:* ${slug}.lashmenu.com\n\n` +
      `🎨 *Modelo Escolhido:* ${selectedModel.toUpperCase()}\n` +
      `🎨 *Paleta Escolhida:* ${selectedColor.toUpperCase()}\n\n` +
      `📋 *Procedimentos:* \n${servicesList.join('\n')}\n\n` +
      `🔑 *Chave Pix:* ${pixKey || 'Não informada'}\n` +
      `💰 *Regra de Sinal:* ${depositRule || 'Não informada'}\n` +
      `📝 *Orientações:* ${extraNotes || 'Nenhuma'}\n` +
      `📁 *Link das Fotos:* ${driveLink || 'Foto enviada no formulário'}`;

    const adminWhatsAppNumber = '5511999999999'; // Número do seu suporte para recebimento
    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${adminWhatsAppNumber}&text=${encodedMsg}`;

    if (whatsappConfirmBtn) {
      whatsappConfirmBtn.href = whatsappUrl;
    }

    if (successLinkDisplay) {
      successLinkDisplay.textContent = `${slug}.lashmenu.com`;
    }

    // Esconde o formulário e exibe a tela de sucesso
    form.style.display = 'none';
    const progressTrack = document.querySelector('.steps-progress');
    if (progressTrack) progressTrack.style.display = 'none';

    if (successScreen) {
      successScreen.classList.remove('is-hidden');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
