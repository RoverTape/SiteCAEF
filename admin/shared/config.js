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
// O banco guarda timestamptz (instante, serializado em UTC) e o
// <input type="datetime-local"> trabalha com hora de parede, sem fuso nenhum.
// Converter um pelo outro sem ancorar o fuso é o que fazia a hora andar 3h.
// Tudo aqui é ancorado em Brasília, então a hora digitada no admin é a hora
// que aparece no site — independente do fuso da máquina de quem publica.
var TZ_SITE = 'America/Sao_Paulo';

// Offset do fuso do site num dado instante, em minutos (-180 no horário padrão).
// Calculado via Intl em vez de constante pra sobreviver a uma volta do horário
// de verão, que mudaria o offset só em parte do ano.
function offsetTZ(date) {
  var partes = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ_SITE, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).formatToParts(date);
  var p = {};
  for (var i = 0; i < partes.length; i++) p[partes[i].type] = partes[i].value;
  var comoUTC = Date.UTC(+p.year, p.month - 1, +p.day,
    p.hour === '24' ? 0 : +p.hour, +p.minute, +p.second);
  return (comoUTC - Math.floor(date.getTime() / 1000) * 1000) / 60000;
}

// "2026-09-11T20:30" (hora de Brasília) -> "2026-09-11T23:30:00.000Z"
function inputParaISO(valor) {
  if (!valor) return null;
  var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(valor);
  if (!m) return null;
  var parede = Date.UTC(+m[1], m[2] - 1, +m[3], +m[4], +m[5]);
  // Primeiro palpite com o offset da hora de parede, depois reavalia no
  // instante resultante — corrige as poucas horas em volta de uma virada de DST.
  var inst = parede - offsetTZ(new Date(parede)) * 60000;
  inst = parede - offsetTZ(new Date(inst)) * 60000;
  return new Date(inst).toISOString();
}

// "2026-09-11T23:30:00+00:00" -> "2026-09-11T20:30" (hora de Brasília)
function isoParaInput(iso) {
  if (!iso) return '';
  var d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return new Date(d.getTime() + offsetTZ(d) * 60000).toISOString().slice(0, 16);
}

function todayISO() {
  return isoParaInput(new Date().toISOString()).slice(0, 10);
}
function fmtDateBR(iso) {
  if (!iso) return '—';
  // Coluna 'date' pura (10 chars) não tem fuso: ancora no meio-dia pra não
  // escorregar de dia na conversão.
  var d = new Date(iso.length === 10 ? iso + 'T12:00:00-03:00' : iso);
  return d.toLocaleDateString('pt-BR',
    { timeZone: TZ_SITE, day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtDateTimeBR(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', {
    timeZone: TZ_SITE,
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}
window.TZ_SITE = TZ_SITE;
window.offsetTZ = offsetTZ;
window.inputParaISO = inputParaISO;
window.isoParaInput = isoParaInput;
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
