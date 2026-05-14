// CAEF — Dados e componentes utilitários compartilhados

const C = React.createElement;

// ─── Produções ─────────────────────────────────────────────
const productions = [
  { type: 'Artigo', date: '15 Mar 2026', title: 'Análise do Impacto da Inflação no Poder de Compra das Famílias Brasileiras', desc: 'Estudo aprofundado sobre os efeitos da inflação recente no poder aquisitivo das famílias de diferentes classes sociais.', tags: ['macroeconomia','inflação','política econômica'] },
  { type: 'Iniciação Científica', date: '08 Mar 2026', title: 'A Transformação Digital no Mercado Financeiro', desc: 'Pesquisa sobre o impacto das fintechs e tecnologias emergentes no sistema financeiro tradicional.', tags: ['finanças','tecnologia','inovação'] },
  { type: 'Blog', date: '01 Mar 2026', title: 'Sustentabilidade Econômica e o Futuro do ESG', desc: 'Reflexões sobre o crescimento dos investimentos sustentáveis e os desafios da economia verde.', tags: ['ESG','sustentabilidade','investimentos'] },
  { type: 'Artigo', date: '22 Fev 2026', title: 'Desigualdade Regional e Política Fiscal no Brasil Pós-Pandemia', desc: 'Mapeamento das assimetrias regionais e o papel da política fiscal na convergência econômica.', tags: ['desigualdade','política fiscal','regional'] },
  { type: 'Resenha', date: '14 Fev 2026', title: 'Resenha — "The Great Reversal" de Thomas Philippon', desc: 'Discussão crítica sobre concentração de mercado e o declínio da competitividade nos EUA.', tags: ['microeconomia','concorrência','livros'] },
  { type: 'Blog', date: '03 Fev 2026', title: 'Por que o Brasil ainda foge da reforma tributária estrutural', desc: 'Notas sobre os obstáculos políticos e econômicos para uma reforma tributária ampla.', tags: ['política fiscal','reforma'] },
];

// ─── Eventos ───────────────────────────────────────────────
const events = [
  { day: '25', mon: 'Abr', year: '2026', time: '19h00', loc: 'Auditório Principal — FACAMP', title: 'Palestra: Economia Brasileira em 2026', desc: 'Debate com economistas renomados sobre os desafios e perspectivas da economia brasileira.', cat: 'Palestra' },
  { day: '05', mon: 'Mai', year: '2026', time: '14h00', loc: 'Laboratório de Informática', title: 'Workshop: Análise de Dados Econômicos com Python', desc: 'Aprenda a utilizar Python para análise de dados econômicos e visualização de indicadores.', cat: 'Workshop' },
  { day: '18', mon: 'Mai', year: '2026', time: '10h00', loc: 'Sala 304 — Bloco B', title: 'Roda de Conversa: Reforma Tributária e Equidade', desc: 'Discussão sobre os impactos distributivos da reforma tributária brasileira.', cat: 'Roda de Conversa' },
  { day: '02', mon: 'Jun', year: '2026', time: '18h30', loc: 'Auditório Principal — FACAMP', title: 'Café Econômico: Carreiras no Setor Público', desc: 'Encontro informal com ex-alunos atuando no Banco Central, IPEA e Tesouro Nacional.', cat: 'Encontro' },
];

// ─── Indicadores macroeconômicos ───────────────────────────
const indicators = [
  { name: 'SELIC', val: '10,75%', chg: '−0,25', up: false, period: 'a.a.', src: 'COPOM · 19 mar 2026' },
  { name: 'IPCA', val: '4,28%', chg: '+0,14', up: true, period: '12 meses', src: 'IBGE · fev 2026' },
  { name: 'Dólar', val: 'R$ 5,02', chg: '−0,03', up: false, period: 'PTAX', src: 'BCB · hoje' },
  { name: 'Ibovespa', val: '128.430', chg: '+1,82%', up: true, period: 'pontos', src: 'B3 · fechamento' },
  { name: 'PIB', val: '+2,9%', chg: '+0,4', up: true, period: '2025', src: 'IBGE · 4º tri' },
  { name: 'Desemprego', val: '7,1%', chg: '−0,3', up: false, period: 'PNADC', src: 'IBGE · jan 2026' },
  { name: 'Salário Mín.', val: 'R$ 1.518', chg: '+6,9%', up: true, period: 'nominal', src: 'Gov · jan 2026' },
  { name: 'Risco País', val: '218 bps', chg: '−12', up: false, period: 'EMBI+', src: 'JPM · hoje' },
];

// ─── Newsletter — edições anteriores ───────────────────────
const issues = [
  { num: '24', date: 'Abril 2026', title: 'Política Monetária e a Travessia da Desinflação', topics: 'COPOM · Hiato · Câmbio', read: 12 },
  { num: '23', date: 'Março 2026', title: 'Reforma Tributária: Quem Ganha, Quem Perde', topics: 'IBS · CBS · Distribuição', read: 9 },
  { num: '22', date: 'Fevereiro 2026', title: 'O Renascimento Industrial Brasileiro?', topics: 'Política industrial · Nova Indústria', read: 14 },
  { num: '21', date: 'Janeiro 2026', title: 'Balanço 2025: A Economia em Cinco Gráficos', topics: 'Retrospectiva · Anuário', read: 8 },
  { num: '20', date: 'Dezembro 2025', title: 'Mercado de Trabalho e o Mito do Pleno Emprego', topics: 'PNADC · Curva de Phillips', read: 11 },
];

// ─── Membros da gestão ─────────────────────────────────────
const members = [
  { name: 'Beatriz Almeida', role: 'Presidência', init: 'B' },
  { name: 'Rafael Mendes', role: 'Vice-Presidência', init: 'R' },
  { name: 'Isabela Costa', role: 'Acadêmico', init: 'I' },
  { name: 'Lucas Pereira', role: 'Pesquisa', init: 'L' },
  { name: 'Marina Oliveira', role: 'Eventos', init: 'M' },
  { name: 'Pedro Tavares', role: 'Comunicação', init: 'P' },
  { name: 'Carolina Souza', role: 'Newsletter', init: 'C' },
  { name: 'Felipe Ramos', role: 'Indicadores', init: 'F' },
];

window.CAEF_DATA = { productions, events, indicators, issues, members };

// ─── Atoms ────────────────────────────────────────────────
function ArrowRight({ size = 14 }) {
  return (
    <svg className="btn-arrow" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function Sparkline({ data, color = "var(--ink-3)", up = true }) {
  // data: array of numbers; build a polyline
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

// generate jittery sparkline data
function genSpark(seed, trend = 1) {
  const arr = [];
  let v = 50 + (seed * 7) % 30;
  for (let i = 0; i < 24; i++) {
    v += (Math.sin(i * 0.7 + seed) * 4) + (Math.random() - 0.5 + trend * 0.15) * 6;
    arr.push(v);
  }
  return arr;
}

// ─── Fade-in observer hook ────────────────────────────────
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

// ─── Count-up hook ─────────────────────────────────────────
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
