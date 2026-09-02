// admin/shared/config.js

const SUPABASE_URL      = "https://cfmtprdrwjicrduiqwrk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbXRwcmRyd2ppY3JkdWlxd3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzMwNTYsImV4cCI6MjA5NDAwOTA1Nn0.wSugGuhpM7YvCSvF4juS9lWRl5i2Yt4UNuS3bxBIJf8";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.sb = sb;

// ─── Guarda de autenticação ───────────────────────────────
function requireAuth() {
  return sb.auth.getSession().then(function(res) {
    if (!res.data.session) {
      window.location.href = 'index.html';
      return null;
    }
    return res.data.session;
  });
}
window.requireAuth = requireAuth;

// ─── Logout helper ────────────────────────────────────────
function logout() {
  return sb.auth.signOut().then(function() {
    window.location.href = 'index.html';
  });
}
window.logout = logout;

// ─── Toasts ──────────────────────────────────────────────
function toast(msg, kind) {
  kind = kind || 'ok';
  var wrap = document.getElementById('toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toast-wrap';
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  var el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(function() { el.remove(); }, 3500);
}
window.toast = toast;

// ─── Upload de imagem para Supabase Storage ──────────────
function uploadImagem(file, pasta) {
  pasta = pasta || 'geral';
  if (!file) return Promise.resolve(null);
  var ext  = file.name.split('.').pop();
  var nome = pasta + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 7) + '.' + ext;
  return sb.storage.from('imagens').upload(nome, file, {
    cacheControl: '3600',
    upsert: false
  }).then(function(res) {
    if (res.error) throw res.error;
    var pub = sb.storage.from('imagens').getPublicUrl(nome);
    return pub.data.publicUrl;
  });
}
window.uploadImagem = uploadImagem;

// ─── Helpers de data ─────────────────────────────────────
function todayISO() {
  var d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}
function fmtDateBR(iso) {
  if (!iso) return '—';
  var d = new Date(iso.length === 10 ? iso + 'T12:00:00' : iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtDateTimeBR(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR',
    { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
window.todayISO = todayISO;
window.fmtDateBR = fmtDateBR;
window.fmtDateTimeBR = fmtDateTimeBR;

// ─── Pega o id_adm do usuário logado ─────────────────────
function getAdminId() {
  return sb.auth.getUser().then(function(res) {
    return res.data.user ? res.data.user.id : null;
  });
}
window.getAdminId = getAdminId;
