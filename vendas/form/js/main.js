/* ==========================================================================
   LASHMENU — FORMULÁRIO DE ONBOARDING MULTI-STEP (JAVASCRIPT)
   COM OPÇÃO 2: 3 CARDS DE MODELOS COM SELETOR DE COR DIRETO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMultiStepNavigation();
  initModelCardsSelection();
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

/* ── 2. Seleção dos 3 Cards de Modelos & Cores (Opção 2) ─────────────────── */
let selectedModelId = 'glamour';
let selectedColorId = 'midnight';

function initModelCardsSelection() {
  const cards = document.querySelectorAll('.opt2-card');
  const hiddenModel = document.getElementById('input-selected-model');
  const hiddenColor = document.getElementById('input-selected-color');

  cards.forEach((card) => {
    const model = card.getAttribute('data-model');
    const pills = card.querySelectorAll('.opt2-pill');
    const iframe = card.querySelector('.opt2-iframe');
    const badge = card.querySelector('.opt2-phone-badge');
    const selectBtn = card.querySelector('.btn-select-model-card');

    // Troca de cor dentro do Card
    pills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        pills.forEach((p) => p.classList.remove('is-active'));
        pill.classList.add('is-active');

        const color = pill.getAttribute('data-color');
        const label = pill.getAttribute('data-label');
        const url = pill.getAttribute('data-url');

        if (iframe) {
          const src = color === 'midnight' ? iframe.getAttribute('data-src-midnight') : iframe.getAttribute('data-src-rose');
          if (src) {
            iframe.style.opacity = '0.25';
            setTimeout(() => {
              iframe.src = src;
              iframe.style.opacity = '1';
            }, 100);
          }
        }

        if (badge && label) {
          badge.textContent = label;
        }

        // Atualiza o link de teste em tela cheia
        const testLink = card.querySelector('.opt2-test-link');
        if (testLink && url) {
          testLink.href = url;
        }

        // Se o card já estiver selecionado, atualiza a cor ativa
        if (card.classList.contains('is-selected')) {
          selectedColorId = color;
          if (hiddenColor) hiddenColor.value = color;
          updateSummaryTags();
        }
      });
    });

    // Seleção do Card ao clicar no card ou no botão
    card.addEventListener('click', () => {
      selectCard(card);
    });

    if (selectBtn) {
      selectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectCard(card);
      });
    }
  });

  const modelButtonLabels = {
    glamour: 'Escolher Glamour',
    harmonia: 'Escolher Harmonia',
    classico: 'Escolher Clássico'
  };

  function selectCard(selectedCard) {
    cards.forEach((c) => {
      c.classList.remove('is-selected');
      const btn = c.querySelector('.btn-select-model-card .btn-select-text');
      const mId = c.getAttribute('data-model');
      if (btn) btn.textContent = modelButtonLabels[mId] || 'Escolher Modelo';
    });

    selectedCard.classList.add('is-selected');
    const activeBtn = selectedCard.querySelector('.btn-select-model-card .btn-select-text');
    if (activeBtn) activeBtn.textContent = '✓ Modelo Selecionado';

    selectedModelId = selectedCard.getAttribute('data-model');
    const activePill = selectedCard.querySelector('.opt2-pill.is-active');
    selectedColorId = activePill ? activePill.getAttribute('data-color') : 'midnight';

    if (hiddenModel) hiddenModel.value = selectedModelId;
    if (hiddenColor) hiddenColor.value = selectedColorId;

    updateSummaryTags();
  }
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

/* ── 4. Dropzone & Upload de Foto ou Vídeo de Capa ───────────────────────── */
function initPhotoDropzone() {
  const dropzone = document.getElementById('avatar-dropzone');
  const fileInput = document.getElementById('input-avatar-file');
  const dropzoneEmpty = document.getElementById('dropzone-empty');
  const dropzonePreview = document.getElementById('dropzone-preview');
  const previewImg = document.getElementById('avatar-preview-img');
  const previewVideo = document.getElementById('avatar-preview-video');
  const removeBtn = document.getElementById('btn-remove-avatar');

  if (!dropzone || !fileInput) return;

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();

      reader.onload = (event) => {
        if (isVideo) {
          if (previewImg) previewImg.classList.add('is-hidden');
          if (previewVideo) {
            previewVideo.src = event.target.result;
            previewVideo.classList.remove('is-hidden');
            previewVideo.play().catch(() => {});
          }
        } else {
          if (previewVideo) {
            previewVideo.pause();
            previewVideo.src = '';
            previewVideo.classList.add('is-hidden');
          }
          if (previewImg) {
            previewImg.src = event.target.result;
            previewImg.classList.remove('is-hidden');
          }
        }

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
      if (previewImg) {
        previewImg.src = '';
        previewImg.classList.add('is-hidden');
      }
      if (previewVideo) {
        previewVideo.pause();
        previewVideo.src = '';
        previewVideo.classList.add('is-hidden');
      }
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
  const selectedModel = document.getElementById('input-selected-model')?.value || selectedModelId;
  const selectedColor = document.getElementById('input-selected-color')?.value || selectedColorId;
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
    
    const selectedModel = document.getElementById('input-selected-model')?.value || selectedModelId;
    const selectedColor = document.getElementById('input-selected-color')?.value || selectedColorId;

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
      `📁 *Link das Fotos:* ${driveLink || 'Foto anexada no formulário'}\n\n` +
      `📝 *Observações / Pedidos Especiais:* \n${extraNotes || 'Nenhuma observação informada'}`;

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
