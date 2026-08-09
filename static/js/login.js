// ── Configuração da API ──────────────────────────────────────────────────
// Troque pela URL base do seu backend (ex: 'https://api.seusite.com')
const API_BASE_URL = '';

// ── Elements ─────────────────────────────────────────────────────────────
const viewHeading = document.getElementById('viewHeading');
const viewSub = document.getElementById('viewSub');

const loginForm = document.getElementById('loginForm');
const forgotForm = document.getElementById('forgotForm');
const forgotSuccess = document.getElementById('forgotSuccess');

const titles = {
  login: { heading: 'Bem-vindo ao OpsManager!', sub: 'Acesse sua conta para continuar' },
  forgot: { heading: 'Redefinir senha', sub: 'Recupere o acesso à sua conta' },
};

// ── View switching (login <-> esqueci a senha, dentro da mesma página) ───
function showView(view) {
  [loginForm, forgotForm, forgotSuccess].forEach(el => el.hidden = true);
  viewHeading.textContent = titles[view].heading;
  viewSub.textContent = titles[view].sub;

  const tabs = document.getElementById('tabs');
  if (view === 'login') {
    tabs.hidden = false;
    loginForm.hidden = false;
  } else {
    tabs.hidden = true;
    if (view === 'forgot') forgotForm.hidden = false;
  }
}

document.getElementById('goForgot').addEventListener('click', () => showView('forgot'));
document.getElementById('backToLoginFromForgot').addEventListener('click', () => showView('login'));
document.getElementById('backToLoginFromForgotSuccess').addEventListener('click', () => {
  resetForgotForm();
  showView('login');
});

// ── Password visibility toggle ───────────────────────────────────────────
const toggleLoginPw = document.getElementById('toggleLoginPw');
const loginPassword = document.getElementById('loginPassword');
toggleLoginPw.addEventListener('click', () => {
  const show = loginPassword.type === 'password';
  loginPassword.type = show ? 'text' : 'password';
  toggleLoginPw.innerHTML = show ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
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

// ── LOGIN ────────────────────────────────────────────────────────────────
const loginEmail = document.getElementById('loginEmail');
const rememberMe = document.getElementById('rememberMe');
const loginEmailBox = document.getElementById('loginEmailBox');
const loginPasswordBox = document.getElementById('loginPasswordBox');
const loginError = document.getElementById('loginError');
const loginSubmit = document.getElementById('loginSubmit');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.hidden = true;
  loginEmailBox.classList.remove('error');
  loginPasswordBox.classList.remove('error');

  if (!loginEmail.value || !loginPassword.value) {
    loginError.querySelector('p').textContent = 'Preencha todos os campos.';
    loginError.hidden = false;
    if (!loginEmail.value) loginEmailBox.classList.add('error');
    if (!loginPassword.value) loginPasswordBox.classList.add('error');
    return;
  }

  setLoading(loginSubmit, true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // credentials: 'include' -> use isso se o backend definir um cookie
      // httpOnly de sessão (abordagem recomendada, mais segura que token no JS)
      body: JSON.stringify({
        email: loginEmail.value,
        senha: loginPassword.value,
        lembrar: rememberMe.checked,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.erro || 'E-mail ou senha inválidos.');
    }

    // Se o backend retornar um token (em vez de cookie httpOnly), guarde-o
    // em memória para a sessão atual da página:
    if (data.token) {
      window.__authToken = data.token;
      // Para persistir entre recarregamentos de página, o mais seguro é o
      // backend usar um cookie httpOnly. Se precisar mesmo guardar no
      // navegador, use sessionStorage/localStorage aqui, ciente do risco
      // de exposição a ataques XSS.
    }

    // Login OK — redirecione para a área logada:
    window.location.href = '/operacoes';

  } catch (err) {
    loginError.querySelector('p').textContent = err.message || 'Não foi possível fazer login. Tente novamente.';
    loginError.hidden = false;
    loginEmailBox.classList.add('error');
    loginPasswordBox.classList.add('error');
  } finally {
    setLoading(loginSubmit, false);
  }
});

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────
const forgotEmail = document.getElementById('forgotEmail');
const forgotSubmit = document.getElementById('forgotSubmit');

forgotForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!forgotEmail.value) return;

  setLoading(forgotSubmit, true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail.value }),
    });

    // Por segurança, a maioria das APIs responde 200 mesmo se o e-mail não
    // existir (evita confirmar quais e-mails estão cadastrados).
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Não foi possível enviar o e-mail. Tente novamente.');
    }

    document.getElementById('forgotSentEmail').textContent = forgotEmail.value;
    forgotForm.hidden = true;
    forgotSuccess.hidden = false;

  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(forgotSubmit, false);
  }
});

function resetForgotForm() {
  forgotForm.reset();
  forgotSuccess.hidden = true;
}

// ── Init ──────────────────────────────────────────────────────────────────
lucide.createIcons();
showView('login');
