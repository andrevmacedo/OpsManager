// ── Configuração da API ──────────────────────────────────────────────────
// Vazio porque o front e o backend são servidos pelo mesmo Flask —
// não precisa de domínio, as rotas já são relativas (ex: /auth/register)
const API_BASE_URL = '';

// ── Elements ─────────────────────────────────────────────────────────────
const registerForm = document.getElementById('registerForm');
const registerSuccess = document.getElementById('registerSuccess');
const tabs = document.querySelector('.tabs');

// ── Password visibility toggle ───────────────────────────────────────────
const toggleRegPw = document.getElementById('toggleRegPw');
const regPassword = document.getElementById('regPassword');
toggleRegPw.addEventListener('click', () => {
  const show = regPassword.type === 'password';
  regPassword.type = show ? 'text' : 'password';
  toggleRegPw.innerHTML = show ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
  lucide.createIcons();
});

// ── Loading button helper ────────────────────────────────────────────────
function setLoading(button, loading) {
  const content = button.querySelector('.btn-content');
  const spinner = button.querySelector('.spinner');
  button.disabled = loading;
  content.hidden = loading;
  spinner.hidden = !loading;
}

// ── REGISTER ─────────────────────────────────────────────────────────────
const regName = document.getElementById('regName');
const regEmail = document.getElementById('regEmail');
const regConfirm = document.getElementById('regConfirm');
const regTerms = document.getElementById('regTerms');
const regSubmit = document.getElementById('regSubmit');

const regNameBox = document.getElementById('regNameBox');
const regEmailBox = document.getElementById('regEmailBox');
const regPasswordBox = document.getElementById('regPasswordBox');
const regConfirmBox = document.getElementById('regConfirmBox');

const regNameError = document.getElementById('regNameError');
const regEmailError = document.getElementById('regEmailError');
const regPasswordError = document.getElementById('regPasswordError');
const regConfirmError = document.getElementById('regConfirmError');
const regTermsError = document.getElementById('regTermsError');

function showFieldError(box, errorEl, message) {
  if (message) {
    box && box.classList.add('error');
    errorEl.textContent = message;
    errorEl.hidden = false;
  } else {
    box && box.classList.remove('error');
    errorEl.hidden = true;
  }
}

function validateRegister() {
  const errors = {};
  if (!regName.value.trim()) errors.name = 'Nome obrigatório.';
  if (!regEmail.value.includes('@')) errors.email = 'E-mail inválido.';
  if (regPassword.value.length < 8) errors.password = 'Mínimo 8 caracteres.';
  if (regConfirm.value !== regPassword.value) errors.confirm = 'As senhas não coincidem.';
  if (!regTerms.checked) errors.terms = 'Aceite os termos para continuar.';
  return errors;
}

// Erro genérico exibido acima do botão quando a API recusa o cadastro
// (ex: e-mail já existe). Reaproveita o mesmo estilo dos erros de campo.
const regApiError = document.createElement('p');
regApiError.className = 'field-error';
regApiError.hidden = true;
regSubmit.insertAdjacentElement('beforebegin', regApiError);

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  regApiError.hidden = true;

  const errors = validateRegister();

  showFieldError(regNameBox, regNameError, errors.name);
  showFieldError(regEmailBox, regEmailError, errors.email);
  showFieldError(regPasswordBox, regPasswordError, errors.password);
  showFieldError(regConfirmBox, regConfirmError, errors.confirm);
  showFieldError(null, regTermsError, errors.terms);

  if (Object.keys(errors).length) return;

  setLoading(regSubmit, true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: regName.value,
        email: regEmail.value,
        senha: regPassword.value,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Ex: 409 quando o e-mail já está cadastrado
      throw new Error(data.message || 'Não foi possível concluir o cadastro. Tente novamente.');
    }

    document.getElementById('summaryName').textContent = regName.value;
    document.getElementById('summaryEmail').textContent = regEmail.value;
    registerForm.hidden = true;
    if (tabs) tabs.hidden = true;
    registerSuccess.hidden = false;

  } catch (err) {
    regApiError.textContent = err.message;
    regApiError.hidden = false;
  } finally {
    setLoading(regSubmit, false);
  }
});

// ── Password strength meter ──────────────────────────────────────────────
const pwStrength = document.getElementById('pwStrength');
const pwLabel = document.getElementById('pwLabel');
const pwBars = document.querySelectorAll('.pw-bar');
const pwChecks = document.querySelectorAll('.pw-check');

regPassword.addEventListener('input', () => {
  const password = regPassword.value;
  if (!password) { pwStrength.hidden = true; return; }
  pwStrength.hidden = false;

  const checks = {
    len: password.length >= 8,
    upper: /[A-Z]/.test(password),
    num: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;

  const colorMap = { 0: 'red', 1: 'red', 2: 'amber', 3: 'blue', 4: 'green' };
  const labelMap = { 0: 'Fraca', 1: 'Fraca', 2: 'Razoável', 3: 'Boa', 4: 'Forte' };
  const color = colorMap[score];

  pwBars.forEach(bar => {
    const i = Number(bar.dataset.i);
    bar.className = 'pw-bar' + (i <= score ? ` on-${color}` : '');
  });

  pwLabel.textContent = labelMap[score];
  pwLabel.className = `pw-label ${color}`;

  pwChecks.forEach(el => {
    const key = el.dataset.check;
    el.classList.toggle('ok', checks[key]);
  });
});

// ── Init ──────────────────────────────────────────────────────────────────
lucide.createIcons();