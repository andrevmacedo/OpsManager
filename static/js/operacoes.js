// ============================================================
// Configuração de status — mapeia os valores do banco para exibição
// ============================================================
const statusCfg = {
  ativa:    { cls: 'success', label: 'Ativa' },
  inativa:  { cls: 'error',   label: 'Inativa' },
  running:  { cls: 'running', label: 'Executando' },
  success:  { cls: 'success', label: 'Concluída' },
  warning:  { cls: 'warning', label: 'Atenção' },
  error:    { cls: 'error',   label: 'Erro' },
};

// ============================================================
// Dados — operacoesData vem do Jinja2 injetado no HTML
// Mapeia os campos do banco para os campos usados pelo JS
// ============================================================
let allOps = operacoesData.map(op => ({
  id:       String(op.id),
  process:  op.nome,
  category: op.categoria,   // vem do JOIN com categorias (a implementar)
  categoryColor: op.cor || '#94a3b8',
  status:   op.status,
  owner:         op.responsavel || '—',             // campo não existe no banco ainda
  start:    op.criado_em || '—',
  end:      '—',
  duration: '—',
}));

const perPage = 8;
let state = {
  search: '',
  statusFilter: 'all',
  page: 1,
  selected: new Set(),
};
let opCounter = allOps.length + 1;

// notificações — vazio por enquanto
const events = [];

// ============================================================
// Toasts
// ============================================================
function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 250);
  }, 2800);
}

// ============================================================
// Helpers
// ============================================================
function statusBadgeHtml(status) {
  const c = statusCfg[status] || statusCfg.success;
  return `<span class="status-badge ${c.cls}"><span class="dot"></span>${c.label}</span>`;
}

function nowTime() {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
}

function getFiltered() {
  return allOps.filter(o => {
    const q = state.search.toLowerCase();
    const matchSearch =
      o.id.toLowerCase().includes(q) ||
      o.process.toLowerCase().includes(q) ||
      o.owner.toLowerCase().includes(q);
    const matchStatus = state.statusFilter === 'all' || o.status === state.statusFilter;
    const matchEnv    = state.envFilter === 'all'    || o.env === state.envFilter;
    return matchSearch && matchStatus;
  });
}

function updateCounts() {
  const c = { all: allOps.length, running: 0, success: 0, warning: 0, error: 0 };
  allOps.forEach(o => { if (c[o.status] !== undefined) c[o.status]++; });
  Object.keys(c).forEach(k => {
    const el = document.getElementById('count-' + k);
    if (el) el.textContent = c[k];
  });
  const badge = document.getElementById('navOpsBadge');
  if (badge) badge.textContent = c.all;
}

// ============================================================
// Render
// ============================================================
function render() {
  updateCounts();
  const filtered  = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  if (state.page > totalPages) state.page = totalPages;
  const paged = filtered.slice((state.page - 1) * perPage, state.page * perPage);

  const tbody = document.getElementById('tableBody');
  if (paged.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="9">Nenhuma operação encontrada com os filtros aplicados.</td></tr>`;
  } else {
    tbody.innerHTML = paged.map(op => `
      <tr data-row-id="${op.id}">
        <td><input type="checkbox" class="row-checkbox" data-id="${op.id}" ${state.selected.has(op.id) ? 'checked' : ''}></td>
        <td class="mono">${op.id}</td>
        <td><span class="process-name">${op.process}</span></td>
        <td><span class="cat-pill" style="background:${op.categoryColor}22; color:${op.categoryColor}; border:1px solid ${op.categoryColor}55">${op.category}</span></td>
        <td>${statusBadgeHtml(op.status)}</td>
        <td class="owner-cell">${op.owner}</td>
        <td class="mono">${op.start}</td>
        <td class="mono">${op.duration}</td>
        <td>
          <div class="row-actions">
            <button class="view" title="Ver detalhes" data-id="${op.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button class="play" title="Executar" data-id="${op.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </button>
            <button class="stop" title="Parar" data-id="${op.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="4" width="16" height="16"/>
              </svg>
            </button>
            <button class="logs" title="Ver logs" data-id="${op.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </button>
            <button class="delete" title="Excluir" data-id="${op.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // info de paginação
  const shown = filtered.length === 0 ? 0 : Math.min((state.page - 1) * perPage + 1, filtered.length);
  document.getElementById('paginationInfo').textContent =
    `Mostrando ${shown}–${Math.min(state.page * perPage, filtered.length)} de ${filtered.length} operações`;

  // botões de paginação
  const controls = document.getElementById('paginationControls');
  let html = `<button class="page-nav-btn" id="prevBtn" ${state.page === 1 ? 'disabled' : ''}>Anterior</button>`;
  for (let p = 1; p <= totalPages; p++) {
    html += `<button class="page-num ${p === state.page ? 'active' : ''}" data-page="${p}">${p}</button>`;
  }
  html += `<button class="page-nav-btn" id="nextBtn" ${state.page === totalPages ? 'disabled' : ''}>Próxima</button>`;
  controls.innerHTML = html;

  document.getElementById('prevBtn').onclick = () => { if (state.page > 1) { state.page--; render(); } };
  document.getElementById('nextBtn').onclick = () => { if (state.page < totalPages) { state.page++; render(); } };
  controls.querySelectorAll('.page-num').forEach(btn => {
    btn.onclick = () => { state.page = parseInt(btn.dataset.page); render(); };
  });

  // bindings das ações por linha
// bindings das ações por linha
  tbody.querySelectorAll('.view').forEach(btn => btn.onclick = () => openModal(btn.dataset.id));
  tbody.querySelectorAll('.play').forEach(btn => btn.onclick = () => runOperation(btn.dataset.id));
  tbody.querySelectorAll('.stop').forEach(btn => btn.onclick = () => stopOperation(btn.dataset.id)); // ← aqui
  tbody.querySelectorAll('.logs').forEach(btn => btn.onclick = () => showToast(`Abrindo logs da operação ${btn.dataset.id}...`));
  tbody.querySelectorAll('.delete').forEach(btn => btn.onclick = () => {
    fetch(`/operacoes/${btn.dataset.id}/excluir`, { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        allOps = allOps.filter(o => o.id !== btn.dataset.id);
        state.selected.delete(btn.dataset.id);
        render();
        showToast(`Operação ${btn.dataset.id} excluída.`, 'error');
      } else {
        showToast(data.erro || 'Erro ao excluir.', 'error');
      }
    });
  });
  tbody.querySelectorAll('.row-checkbox').forEach(cb => {
    cb.onchange = () => {
      if (cb.checked) state.selected.add(cb.dataset.id);
      else            state.selected.delete(cb.dataset.id);
      updateBulkBar();
    };
  });

  // select all
  const selectAll   = document.getElementById('selectAllCheckbox');
  const idsOnPage   = paged.map(o => o.id);
  selectAll.checked = idsOnPage.length > 0 && idsOnPage.every(id => state.selected.has(id));
  selectAll.onchange = () => {
    idsOnPage.forEach(id => {
      if (selectAll.checked) state.selected.add(id);
      else                   state.selected.delete(id);
    });
    render();
  };

  updateBulkBar();
}

function updateBulkBar() {
  const bar   = document.getElementById('bulkBar');
  const count = state.selected.size;
  if (count > 0) {
    bar.classList.add('open');
    document.getElementById('bulkCount').textContent = `${count} selecionada${count > 1 ? 's' : ''}`;
  } else {
    bar.classList.remove('open');
  }
}

// ============================================================
// Ações por linha
// ============================================================
function runOperation(id) {
  const op = allOps.find(o => o.id === id);
  if (!op) return;
  op.status = 'running';
  op.start  = nowTime();
  op.end    = '—';
  render();
  showToast(`Operação ${id} iniciada.`, 'success');
}

function stopOperation(id) {
  const op = allOps.find(o => o.id === id);
  if (!op) return;
  op.status = 'ativa';
  op.end    = nowTime();
  render();
  showToast(`Operação ${id} finalizada.`);
}

// ============================================================
// Modal de detalhes
// ============================================================
function openModal(id) {
  const op = allOps.find(o => o.id === id);
  if (!op) return;
  document.getElementById('modalId').textContent      = `ID ${op.id}`;
  document.getElementById('modalProcess').textContent = op.process;
  const fields = [
    ['Status',      statusBadgeHtml(op.status)],
    ['Categoria',   `<span class="cat-pill">${op.category}</span>`],
    ['Responsável', op.owner],
    ['Criado em',      op.start],
    ['Término',     op.end],
    ['Duração',     op.duration],
  ];
  document.getElementById('modalGrid').innerHTML = fields.map(([label, val]) => `
    <div>
      <p class="modal-field-label">${label}</p>
      <div class="modal-field-value">${val}</div>
    </div>
  `).join('');
  document.getElementById('modalOverlay').dataset.currentId = id;
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target.id === 'modalOverlay') closeModal(); });
document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
document.getElementById('modalRerunBtn').addEventListener('click', () => {
  runOperation(document.getElementById('modalOverlay').dataset.currentId);
  closeModal();
});
document.getElementById('modalLogsBtn').addEventListener('click', () => {
  showToast(`Abrindo logs...`);
  closeModal();
});

// ============================================================
// Modal Nova Operação — envia para a rota Flask via fetch
// ============================================================
function openNewOpModal() {
  document.getElementById('newOpProcess').value     = '';
  document.getElementById('newOpCategory').value    = '1';
  document.getElementById('newOpDescricao').value   = '';
  document.getElementById('newOpSenha').value       = '';
  document.getElementById('newOpError').textContent = '';
  document.getElementById('newOpOverlay').classList.add('open');
  document.getElementById('newOpProcess').focus();
}

document.getElementById('newOpSubmitBtn').addEventListener('click', () => {
  const process   = document.getElementById('newOpProcess').value.trim();
  const categoria = document.getElementById('newOpCategory').value;
  const descricao = document.getElementById('newOpDescricao').value.trim();
  const senha     = document.getElementById('newOpSenha').value.trim();

  if (!process || !descricao) {
    document.getElementById('newOpError').textContent = 'Preencha o processo e a descrição.';
    return;
  }
  if (!senha) {
    document.getElementById('newOpError').textContent = 'Digite sua senha para confirmar.';
    return;
  }

  fetch('/operacoes/criar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ nome: process, descricao, id_categoria: categoria, status: 'ativa', senha }),
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      const newOp = {
        id:            String(opCounter++),
        process,
        category:      document.getElementById('newOpCategory').options[document.getElementById('newOpCategory').selectedIndex].text,
        categoryColor: data.cor || '#94a3b8',
        status:        'ativa',
        owner:         data.responsavel || '—',
        start:         nowTime(),
        end:           '—',
        duration:      '—',
      };
      allOps.unshift(newOp);
      state.page = 1;
      render();
      closeNewOpModal();
      showToast('Operação criada com sucesso.', 'success');
    } else {
      document.getElementById('newOpError').textContent = data.erro || 'Erro ao criar operação.';
    }
  })
  .catch(() => {
    document.getElementById('newOpError').textContent = 'Erro de conexão.';
  });
});

function closeNewOpModal() { document.getElementById('newOpOverlay').classList.remove('open'); }

document.getElementById('newOpBtn').addEventListener('click', openNewOpModal);
document.getElementById('newOpCloseBtn').addEventListener('click', closeNewOpModal);
document.getElementById('newOpCancelBtn').addEventListener('click', closeNewOpModal);
document.getElementById('newOpOverlay').addEventListener('click', e => { if (e.target.id === 'newOpOverlay') closeNewOpModal(); });

// ============================================================
// Export CSV
// ============================================================
function exportToCsv(ops, filename) {
  if (ops.length === 0) { showToast('Nenhuma operação para exportar.'); return; }
  const headers = ['ID', 'Processo', 'Categoria', 'Status', 'Ambiente', 'Responsável', 'Criado em', 'Término', 'Duração'];
  const rows    = ops.map(o => [o.id, o.process, o.category, statusCfg[o.status]?.label || o.status, o.env, o.owner, o.start, o.end, o.duration]);
  const csv     = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob    = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  showToast(`${ops.length} operações exportadas.`, 'success');
}

document.getElementById('exportBtn').addEventListener('click',     () => exportToCsv(getFiltered(), 'operacoes.csv'));
document.getElementById('bulkExportBtn').addEventListener('click', () => exportToCsv(allOps.filter(o => state.selected.has(o.id)), 'operacoes-selecionadas.csv'));
document.getElementById('bulkDeleteBtn').addEventListener('click', () => {
  const n = state.selected.size;
  allOps = allOps.filter(o => !state.selected.has(o.id));
  state.selected.clear();
  render();
  showToast(`${n} operação(ões) excluída(s).`, 'error');
});

// ============================================================
// Tabs / busca / filtros
// ============================================================
document.getElementById('tabs').querySelectorAll('.tab').forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    state.statusFilter = tab.dataset.status;
    state.page = 1;
    render();
  };
});

function syncSearch(value) {
  state.search = value;
  state.page   = 1;
  document.getElementById('searchInput').value   = value;
  document.getElementById('topbarSearch').value  = value;
  render();
}
document.getElementById('searchInput').addEventListener('input',  e => syncSearch(e.target.value));
document.getElementById('topbarSearch').addEventListener('input', e => syncSearch(e.target.value));

// ============================================================
// Botões Atualizar
// ============================================================
function refreshData(btn) {
  // busca o svg dentro do botão — pode estar em nivel mais profundo
  const icon = btn.querySelector('svg') || btn.closest('button')?.querySelector('svg');
  if (icon) icon.classList.add('spin');

  fetch('/operacoes/listar')
  .then(res => res.json())
  .then(data => {
    allOps = data.map(op => ({
      id:            String(op.id),
      process:       op.nome,
      category:      op.categoria,
      categoryColor: op.cor || '#94a3b8',
      status:        op.status,
      owner:         op.responsavel || '—',
      start:         op.criado_em || '—',
      end:           '—',
      duration:      '—',
    }));
    render();
    showToast('Dados atualizados.', 'success');
  })
  .catch(() => showToast('Erro ao atualizar.', 'error'))
  .finally(() => { if (icon) icon.classList.remove('spin'); });
}
document.getElementById('refreshBtn').addEventListener('click', function () { refreshData(this); });
document.getElementById('topbarRefreshBtn').addEventListener('click', function () { refreshData(this); });
// ============================================================
// Notificações
// ============================================================
function renderNotifications() {
  document.getElementById('notifList').innerHTML = events.length
    ? events.map(e => `
        <div class="notif-item">
          <span class="notif-dot-type ${e.type}"></span>
          <div>
            <p class="notif-msg">${e.msg}</p>
            <p class="notif-time">${e.time}</p>
          </div>
        </div>`).join('')
    : '<p style="padding:16px;color:#64748b;font-size:13px;">Nenhuma notificação.</p>';
}
renderNotifications();

document.getElementById('notifBtn').addEventListener('click', e => {
  e.stopPropagation();
  closeAllDropdowns('notifPanel');
  document.getElementById('notifPanel').classList.toggle('open');
});
document.getElementById('markAllReadBtn').addEventListener('click', () => {
  document.querySelectorAll('.notif-item').forEach(el => el.classList.add('read'));
  document.getElementById('notifDot').classList.add('hidden');
  showToast('Notificações marcadas como lidas.');
});

// ============================================================
// Menu do usuário
// ============================================================
document.getElementById('userMenuBtn').addEventListener('click', e => {
  e.stopPropagation();
  closeAllDropdowns('userPanel');
  document.getElementById('userPanel').classList.toggle('open');
});
document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', () => {
    document.getElementById('userPanel').classList.remove('open');
    const action = item.dataset.action;
    if (action === 'profile')   showToast('Abrindo meu perfil...');
    if (action === 'settings')  showToast('Abrindo configurações...');
    if (action === 'logout')    showToast('Sessão encerrada.', 'error');
  });
});

function closeAllDropdowns(except) {
  ['notifPanel', 'userPanel'].forEach(id => {
    if (id !== except) document.getElementById(id).classList.remove('open');
  });
}
document.addEventListener('click', e => {
  if (!e.target.closest('.dropdown-wrap')) closeAllDropdowns();
  if (!e.target.closest('.more-wrap'))     closeAllMoreMenus();
});

// ============================================================
// Sidebar — navegação mobile
// ============================================================
const operacoesPage  = document.getElementById('operacoesPage');
const placeholderPage = document.getElementById('placeholderPage');

function goToPage(name) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === name));
  if (name === 'Operações') {
    operacoesPage.style.display   = '';
    placeholderPage.style.display = 'none';
  } else {
    operacoesPage.style.display   = 'none';
    placeholderPage.style.display = 'flex';
    document.getElementById('placeholderTitle').textContent = name;
  }
  closeSidebarMobile();
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => goToPage(item.dataset.page));
});
document.getElementById('backToOpsBtn').addEventListener('click', () => goToPage('Operações'));

function openSidebarMobile()  {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
}
function closeSidebarMobile() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}
document.getElementById('menuBtn').addEventListener('click',          openSidebarMobile);
document.getElementById('sidebarCloseBtn').addEventListener('click',  closeSidebarMobile);
document.getElementById('sidebarOverlay').addEventListener('click',   closeSidebarMobile);
document.getElementById('sidebarUserRow').addEventListener('click',   () => showToast('Abrindo perfil do usuário...'));

// ============================================================
// Init
// ============================================================
render();
