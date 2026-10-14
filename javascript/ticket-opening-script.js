const typeChoices = document.querySelectorAll('#typeChoices .choice');
const impactChoices = document.querySelectorAll('#impactChoices .impact');
const description = document.getElementById('description');
const charCount = document.getElementById('charCount');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const toast = document.getElementById('toast');
let selectedType = 'Incidente / Problema';
let selectedImpact = 'Urgente';
let uploadedFiles = [];

function showToast(message, error = false) {
  toast.textContent = message;
  toast.className = `toast show${error ? ' error' : ''}`;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.className = 'toast', 3200);
}

function setSingleSelection(buttons, selected) {
  buttons.forEach(button => {
    const active = button === selected;
    button.classList.toggle('selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

typeChoices.forEach(button => button.addEventListener('click', () => {
  setSingleSelection(typeChoices, button);
  selectedType = button.dataset.value;
}));

impactChoices.forEach(button => button.addEventListener('click', () => {
  setSingleSelection(impactChoices, button);
  selectedImpact = button.dataset.value;
}));

function updateCounter() {
  charCount.textContent = `${description.value.length} caracteres`;
}
description.addEventListener('input', updateCounter);
updateCounter();

document.querySelectorAll('.toolbar button[data-format]').forEach(button => {
  button.addEventListener('click', () => {
    const format = button.dataset.format;
    const start = description.selectionStart;
    const end = description.selectionEnd;
    const selected = description.value.slice(start, end);
    const wrapper = format === 'bold' ? '**' : '*';
    description.setRangeText(`${wrapper}${selected || 'texto'}${wrapper}`, start, end, 'select');
    description.focus();
    updateCounter();
  });
});

function renderFiles() {
  fileList.innerHTML = '';
  if (!uploadedFiles.length) {
    fileList.innerHTML = '<div class="file-item"><div class="file-info">Nenhum arquivo anexado.</div></div>';
    return;
  }
  uploadedFiles.forEach((file, index) => {
    const item = document.createElement('div');
    item.className = 'file-item';
    const symbol = document.createElement('div');
    symbol.className = 'file-symbol';
    symbol.textContent = '▧';
    const info = document.createElement('div');
    info.className = 'file-info';
    const name = document.createElement('strong');
    name.textContent = file.name;
    const size = document.createElement('span');
    size.textContent = `${(file.size / 1024).toFixed(0)} KB · ${file.name.split('.').pop().toUpperCase()}`;
    const status = document.createElement('small');
    status.textContent = 'Selecionado para anexar';
    info.append(name, size, status);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete-file';
    remove.title = 'Remover arquivo';
    remove.textContent = '▤';
    remove.addEventListener('click', () => {
      uploadedFiles.splice(index, 1);
      renderFiles();
    });
    item.append(symbol, info, remove);
    fileList.append(item);
  });
}
fileInput.addEventListener('change', () => {
  const maxBytes = 25 * 1024 * 1024;
  const allowed = /\.(png|jpe?g|pdf|txt|log)$/i;
  for (const file of fileInput.files) {
    if (!allowed.test(file.name)) {
      showToast(`Formato não permitido: ${file.name}`, true);
    } else if (file.size > maxBytes) {
      showToast(`${file.name} ultrapassa o limite de 25 MB.`, true);
    } else {
      uploadedFiles.push(file);
    }
  }
  renderFiles();
  fileInput.value = '';
});
document.querySelector('.delete-file').addEventListener('click', () => {
  showToast('Anexo de exemplo removido.');
  fileList.innerHTML = '<div class="file-item"><div class="file-info">Nenhum arquivo anexado.</div></div>';
});
document.querySelector('.preview-file').addEventListener('click', () => showToast('Pré-visualização demonstrativa do anexo.'));
document.getElementById('discardBtn').addEventListener('click', () => {
  if (confirm('Deseja descartar o rascunho e restaurar os dados de exemplo?')) {
    document.getElementById('ticketForm').reset();
    description.value = '';
    document.getElementById('subject').value = '';
    selectedType = 'Incidente / Problema';
    selectedImpact = 'Urgente';
    setSingleSelection(typeChoices, typeChoices[0]);
    setSingleSelection(impactChoices, impactChoices[1]);
    uploadedFiles = [];
    renderFiles();
    updateCounter();
    showToast('Rascunho limpo.');
  }
});
document.getElementById('submitBtn').addEventListener('click', () => {
  const form = document.getElementById('ticketForm');
  if (!form.reportValidity()) return;
  showToast(`Chamado demonstrativo enviado! Tipo: ${selectedType} · Impacto: ${selectedImpact}`);
});
document.getElementById('nextBtn').addEventListener('click', () => {
  const form = document.getElementById('ticketForm');
  if (!form.reportValidity()) return;
  showToast('Etapa 1 concluída. O detalhamento técnico pode ser implementado na próxima etapa.');
});
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    document.querySelector('.search-box input').focus();
  }
  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    document.querySelector('.search-box input').focus();
  }
});