// data.jsx — integração com Supabase + APIs públicas
const C = React.createElement;

const SUPABASE_URL      = "https://cfmtprdrwjicrduiqwrk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbXRwcmRyd2ppY3JkdWlxd3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzMwNTYsImV4cCI6MjA5NDAwOTA1Nn0.wSugGuhpM7YvCSvF4juS9lWRl5i2Yt4UNuS3bxBIJf8";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? iso + 'T12:00:00' : iso);
  return `${String(d.getDate()).padStart(2,'0')} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}
function fmtTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,'0')}h${String(d.getMinutes()).padStart(2,'0')}`;
}
function fmtDataCurta(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
}
function fmtPct(v, casas = 2) {
  if (v == null || isNaN(v)) return '—';
  return Number(v).toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }) + '%';
}
function fmtMoney(v, moeda = 'R$') {
  if (v == null || isNaN(v)) return '—';
  return moeda + ' ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtIndice(v) {
  if (v == null || isNaN(v)) return '—';
  return Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}
function tempoLeitura(texto) {
  if (!texto) return 1;
  const palavras = texto.trim().split(/\s+/).length;
  return Math.max(1, Math.round(palavras / 200));
}

// ─── Verifica se duas datas ISO caem no mesmo dia (local time) ───
function mesmoDia(iso1, iso2) {
  if (!iso1 || !iso2) return false;
  const d1 = new Date(iso1);
  const d2 = new Date(iso2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

// ═══════════════════════════════════════════════════════════
// PDF EMBED
// ═══════════════════════════════════════════════════════════
function pdfEmbedUrl(url) {
  if (!url) return null;

  // ─── Google Drive ────────────────────────────────────────
  const gdMatch = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
  if (gdMatch) return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;

  // ─── OneDrive pessoal (onedrive.live.com) ──────────────
  if (url.includes('onedrive.live.com/?')) {
    return url.replace('onedrive.live.com/?', 'onedrive.live.com/embed?');
  }
  if (url.includes('onedrive.live.com/embed')) return url;

  // ─── OneDrive shortlink (1drv.ms) ────────────────────────
  if (url.includes('1drv.ms/')) {
    const sep = url.includes('?') ? '&' : '?';
    return url + sep + 'embed=1';
  }

  // ─── SharePoint corporativo (xxx-my.sharepoint.com) ─────
  // O SharePoint da FACAMP bloqueia embed externo por política do
  // tenant Microsoft 365. Retornar null faz o site pular o iframe
  // e mostrar direto os botões "Abrir documento" + "Baixar PDF".
  if (url.includes('sharepoint.com')) {
    return null;
  }

  // ─── Fallback: URL direta (ex: link .pdf) ────────────────
  return url;
}
const driveEmbedUrl = pdfEmbedUrl;

// ═══════════════════════════════════════════════════════════
// INDICADORES
// ═══════════════════════════════════════════════════════════
const CACHE_KEY = 'caef_indicadores_v6';  
const CACHE_TTL = 60 * 60 * 1000;

async function bcbSerie(codigo, n = 1) {
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${codigo}/dados/ultimos/${n}?formato=json`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('BCB ' + codigo + ' falhou: ' + r.status);
  const arr = await r.json();
  return arr.map(x => ({ data: x.data, valor: parseFloat(x.valor) }));
}

function fetchTimeout(url, ms = 8000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
}

async function carregarIbovespa() {
  try {
    const r = await fetchTimeout('https://brapi.dev/api/quote/%5EBVSP', 6000);
    if (!r.ok) return null;
    const j = await r.json();
    const result = j?.results?.[0];
    if (!result || !result.regularMarketPrice) return null;
    const valor = Number(result.regularMarketPrice);
    if (valor < 50000) return null;
    return {
      valor: valor,
      variacao: Number(result.regularMarketChangePercent),
      fonte: 'B3 · hoje'
    };
  } catch (err) {
    console.warn('[CAEF] brapi.dev falhou:', err.message);
    return null;
  }
}

async function carregarIndicadores() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    // Só usa cache se tiver dados de verdade (não array vazio de falha anterior)
    if (cached && Array.isArray(cached.dados) && cached.dados.length > 0
        && Date.now() - cached.t < CACHE_TTL) {
      console.log('[CAEF] usando cache de indicadores (', cached.dados.length, 'itens)');
      return cached.dados;
    }
  } catch (_) {}

  console.log('[CAEF] buscando indicadores das APIs…');

  const resultados = await Promise.allSettled([
    bcbSerie(432, 1),
    bcbSerie(433, 12),
    bcbSerie(24369, 1),
    fetchTimeout('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL', 6000)
      .then(r => r.ok ? r.json() : null).catch(() => null),
    carregarIbovespa(),
  ]);

  const [selic, ipca12, desemprego, awesome, ibov] = resultados.map(
    r => r.status === 'fulfilled' ? r.value : null
  );

  let ipcaAcum = null;
  if (ipca12 && ipca12.length >= 12) {
    ipcaAcum = ipca12.reduce((acc, m) => acc * (1 + m.valor / 100), 1);
    ipcaAcum = (ipcaAcum - 1) * 100;
  }

  const usdBrl = awesome?.USDBRL;
  const eurBrl = awesome?.EURBRL;
  const dolar    = usdBrl ? parseFloat(usdBrl.bid) : null;
  const dolarVar = usdBrl ? parseFloat(usdBrl.pctChange) : null;
  const euro     = eurBrl ? parseFloat(eurBrl.bid) : null;
  const euroVar  = eurBrl ? parseFloat(eurBrl.pctChange) : null;

  const dados = [
    selic?.[0] && { name: 'SELIC', val: fmtPct(selic[0].valor, 2), chg: '—', up: false, period: 'meta a.a.', src: 'BCB · ' + selic[0].data },
    ipcaAcum != null && { name: 'IPCA', val: fmtPct(ipcaAcum, 2), chg: '12m', up: ipcaAcum > 0, period: '12 meses', src: 'IBGE/BCB · ' + (ipca12[ipca12.length-1]?.data || '') },
    dolar != null && { name: 'Dólar', val: fmtMoney(dolar), chg: dolarVar != null ? (dolarVar > 0 ? '+' : '') + dolarVar.toFixed(2) + '%' : '—', up: (dolarVar || 0) > 0, period: 'PTAX', src: 'AwesomeAPI · hoje' },
    euro != null && { name: 'Euro', val: fmtMoney(euro), chg: euroVar != null ? (euroVar > 0 ? '+' : '') + euroVar.toFixed(2) + '%' : '—', up: (euroVar || 0) > 0, period: 'EUR/BRL', src: 'AwesomeAPI · hoje' },
    ibov && { name: 'Ibovespa', val: fmtIndice(ibov.valor), chg: ibov.variacao != null ? (ibov.variacao > 0 ? '+' : '') + ibov.variacao.toFixed(2) + '%' : '—', up: (ibov.variacao || 0) > 0, period: 'pontos', src: ibov.fonte },
    desemprego?.[0] && { name: 'Desemprego', val: fmtPct(desemprego[0].valor, 1), chg: 'PNADC', up: false, period: 'trimestre', src: 'IBGE · ' + desemprego[0].data },
  ].filter(Boolean);

  console.log('%c[CAEF Indicadores]', 'color: #14123a; font-weight: bold',
    `${dados.length}/6 carregados:`, dados.map(d => d.name).join(', ') || 'NENHUM'
  );

  // IMPORTANTE: só salva cache se tem pelo menos 1 indicador de verdade
  // Assim se todas as APIs falharem numa visita, a próxima tenta de novo
  if (dados.length > 0) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), dados })); } catch (_) {}
  } else {
    console.warn('[CAEF] Nenhum indicador carregado — NÃO gravando cache pra tentar de novo na próxima visita');
  }
  return dados;
}

async function carregarStats() {
  try {
    const [producoes, noticias, newsletters, eventosPassados] = await Promise.all([
      supabase.from('producoes').select('*', { count: 'exact', head: true }).eq('publicado', true),
      supabase.from('noticias').select('*', { count: 'exact', head: true }).neq('categoria', 'newsletter'),
      supabase.from('noticias').select('*', { count: 'exact', head: true }).eq('categoria', 'newsletter'),
      supabase.from('evento').select('*', { count: 'exact', head: true }).lt('data_inicio', new Date().toISOString()),
    ]);
    return {
      publicacoes: (producoes.count || 0) + (noticias.count || 0),
      newsletters: newsletters.count || 0,
      eventos: eventosPassados.count || 0,
      fundacao: 2008,
    };
  } catch (err) {
    console.warn('[CAEF] carregarStats falhou', err);
    return { publicacoes: 0, newsletters: 0, eventos: 0, fundacao: 2008 };
  }
}

function labelTipoEvento(t) {
  const m = {
    evento: 'Evento', palestra: 'Palestra', workshop: 'Workshop',
    monitoria: 'Monitorias', roda_conversa: 'Roda de Conversa'
  };
  return m[t] || 'Evento';
}

async function loadCAEFData() {
  const [prodRes, evRes, notRes, memRes, indicadores, stats] = await Promise.all([
    supabase.from('producoes')
      .select('*, autores:autores_producao(nome, ordem)')
      .eq('publicado', true)
      .order('criado_em', { ascending: false }),
    supabase.from('evento')
      .select('*').eq('ativo', true)
      .order('data_inicio', { ascending: true }),
    supabase.from('noticias')
      .select('*').order('data_publi', { ascending: false }),
    supabase.from('membros')
      .select('*').eq('ativo', true)
      .order('posicao', { ascending: true }),
    carregarIndicadores().catch(err => {
      console.warn('[CAEF] indicadores falharam', err);
      return [];
    }),
    carregarStats(),
  ]);

  [prodRes, evRes, notRes, memRes].forEach((r, i) => {
    if (r.error) console.error('[CAEF] erro', i, r.error);
  });

  const productions = (prodRes.data || []).map(p => ({
    id: 'p_' + p.id_producao, kind: 'producao',
    type: tipoProducaoLabel(p.tipo),
    date: `${p.ano}${p.semestre ? '.' + p.semestre : ''}`,
    dateISO: p.criado_em || `${p.ano}-01-01`,
    title: p.titulo, desc: p.resumo || '',
    tags: p.palavras_chave || [], image: null,
    content: p.resumo || '', pdf: p.pdf_url, link: p.link_externo,
    area: p.area, orientador: p.orientador, coorientador: p.coorientador,
    autores: (p.autores || []).sort((a,b) => a.ordem - b.ordem).map(a => a.nome),
    ano: p.ano, semestre: p.semestre,
    notaMencao: p.nota_mencao, destaque: p.destaque,
  }));

  const news = (notRes.data || [])
    .filter(n => n.categoria !== 'newsletter')
    .map(n => ({
      id: 'n_' + n.id_not, kind: 'noticia',
      type: categoriaLabel(n.categoria), categoria: n.categoria,
      date: fmtDate(n.data_publi), dateISO: n.data_publi,
      title: n.titulo, desc: trecho(n.conteudo, 180),
      image: n.imagem_url, content: n.conteudo, tags: [],
      readMinutes: tempoLeitura(n.conteudo),
      pdfUrl: n.pdf_url, pdfEmbedUrl: pdfEmbedUrl(n.pdf_url),
      galeriaFotos: n.galeria_fotos || null,
    }));

  // Newsletters ordenadas por data_publi DESC (mais recente primeiro).
  // Numeração deve ser cronológica: 1ª publicada = №1, última = №N.
  // Como estão em ordem decrescente, num = total - i.
  const totalNewsletters = (notRes.data || [])
    .filter(n => n.categoria === 'newsletter').length;

  const issues = (notRes.data || [])
    .filter(n => n.categoria === 'newsletter')
    .map((n, i) => ({
      id: 'nl_' + n.id_not, kind: 'newsletter',
      num: String(totalNewsletters - i),
      date: fmtDate(n.data_publi),
      title: n.titulo, topics: trecho(n.conteudo, 80),
      read: tempoLeitura(n.conteudo), readMinutes: tempoLeitura(n.conteudo),
      image: n.imagem_url, content: n.conteudo,
      type: 'Newsletter', categoria: 'newsletter',
      pdfUrl: n.pdf_url, pdfEmbedUrl: pdfEmbedUrl(n.pdf_url),
    }));

  // ─── EVENTOS ────────────────────────────────────────
  const events = (evRes.data || []).map(e => {
    const dInicio = new Date(e.data_inicio);
    const dFim = e.data_fim ? new Date(e.data_fim) : null;
    const mesmoDiaFlag = dFim ? mesmoDia(e.data_inicio, e.data_fim) : false;

    return {
      id: 'e_' + e.id_evento, kind: 'evento',
      day: String(dInicio.getDate()).padStart(2,'0'),
      mon: MESES[dInicio.getMonth()],
      year: String(dInicio.getFullYear()),
      time: fmtTime(e.data_inicio), loc: e.local || '',
      title: e.titulo, desc: e.descricao || '',
      tipo: e.tipo || 'evento', cat: labelTipoEvento(e.tipo || 'evento'),
      image: e.imagem_url, inscricao: e.link_inscricao,
      vagas: e.vagas_total,
      esgotado: !!e.esgotado,
      inscricoesAbertas: e.inscricoes_abertas !== false,   // NOVO — default true

      // NOVOS CAMPOS de data pra usar na página
      dataInicioISO: e.data_inicio,
      dataFimISO: e.data_fim,
      horaInicio: fmtTime(e.data_inicio),
      horaFim: e.data_fim ? fmtTime(e.data_fim) : null,
      dataInicioCurta: fmtDataCurta(e.data_inicio),
      dataFimCurta: e.data_fim ? fmtDataCurta(e.data_fim) : null,
      temFim: !!e.data_fim,
      mesmoDia: mesmoDiaFlag,
    };
  });

  const members = (memRes.data || []).map(m => ({
    name: m.nome,
    role: m.cargo,
    init: m.inicial,
    photo: m.foto_url,
    email: m.email || null,
    linkedin: m.linkedin || null,
  }));

  const destaquesRecentes = [...news, ...productions]
    .sort((a, b) => new Date(b.dateISO || 0).getTime() - new Date(a.dateISO || 0).getTime())
    .slice(0, 6);

  window.CAEF_DATA = {
    productions, news, destaquesRecentes,
    events, indicators: indicadores, issues, members,
    activities: [],
  };
  window.CAEF_STATS = stats;
  window.dispatchEvent(new CustomEvent('caef:data-ready'));
}

function tipoProducaoLabel(t) {
  const m = {
    tcc: 'TCC', iniciacao_cientifica: 'Iniciação Científica',
    monografia: 'Monografia', artigo: 'Artigo Científico',
    dissertacao: 'Dissertação', extensao_academica: 'Extensão Acadêmica',
  };
  return m[t] || t;
}

function categoriaLabel(c) {
  const m = {
    artigo: 'Coluna de Opinião', blog: 'Blog', resenha: 'Resenha',
    noticia: 'Notícia', cobertura_evento: 'Cobertura de Evento'
  };
  return m[c] || (c ? c[0].toUpperCase() + c.slice(1) : 'Publicação');
}

function trecho(s, n) {
  if (!s) return '';
  const limpo = s.replace(/\s+/g, ' ').trim();
  return limpo.length > n ? limpo.slice(0, n).trim() + '…' : limpo;
}

window.CAEF_DATA = {
  productions: [], news: [], destaquesRecentes: [],
  events: [], indicators: [], issues: [], members: [], activities: []
};
window.CAEF_STATS = { publicacoes: 0, newsletters: 0, eventos: 0, fundacao: 2008 };

loadCAEFData();

// ═══════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════

function ArrowRight({ size = 14 }) {
  return (
    <svg className="btn-arrow" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function Sparkline({ data, color = "var(--ink-3)", up = true }) {
  const w = 200, h = 60, pad = 4;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / (data.length - 1);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return [x, y];
  });
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const area = `${d} L${pts[pts.length-1][0]},${h} L${pts[0][0]},${h} Z`;
  const stroke = up ? 'var(--up)' : 'var(--down)';
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <path d={area} fill={stroke} opacity="0.08" />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill={stroke} />
    </svg>
  );
}

function genSpark(seed, trend = 1) {
  const arr = [];
  let v = 50 + (seed * 7) % 30;
  for (let i = 0; i < 24; i++) {
    v += (Math.sin(i * 0.7 + seed) * 4) + (Math.random() - 0.5 + trend * 0.15) * 6;
    arr.push(v);
  }
  return arr;
}

function useFadeIn() {
  React.useEffect(() => {
    const els = document.querySelectorAll('.fadein:not(.visible)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

function useCountUp(target, dur = 1200, decimals = 0) {
  const [v, setV] = React.useState(0);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setV(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [target, dur]);
  return [v, ref, decimals];
}

function CountStat({ to, decimals = 0, suffix = '', prefix = '' }) {
  const [v, ref] = useCountUp(to, 1400, decimals);
  return (
    <span ref={ref}>{prefix}{v.toFixed(decimals)}{suffix}</span>
  );
}

Object.assign(window, {
  ArrowRight, Sparkline, genSpark, useFadeIn, CountStat
});
