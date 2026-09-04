// page-rest.jsx — páginas do site

const NEWSLETTER_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdNpRsogQ2dOqKcYEI9A8alkZfgcJbBa2VHX9lpo8_dM3MgNw/viewform?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAadPMkxvM8IpWLvuaYVtIusqWUmblWMlDuPR8-IZG5kmJYGCaWNm9u8VzF7_2g_aem_v5AqtjFwaqbubSxYe5Ijhg';
const CONTATO_FORM_URL = 'https://forms.gle/PLACEHOLDER-CONTATO-TROCAR';
const MONITORIA_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeoOtcOT8wJDl0pa1OZvMVoNoiu6iSt2EsMxRocfrvos9O0hA/viewform?usp=send_form&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAadPMkxvM8IpWLvuaYVtIusqWUmblWMlDuPR8-IZG5kmJYGCaWNm9u8VzF7_2g_aem_v5AqtjFwaqbubSxYe5Ijhg';
const MONITORIA_EDITAL_URL = 'https://www.canva.com/design/DAHRczi9KUQ/Q0_zu-G2MULuvr2yIepMPQ/view?utm_content=DAHRczi9KUQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h8c031195a3&fbclid=PAb21jcAUBX_ZwZG9mAmV4dG4DYWVtAjExAHNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp08yTG8zwilYu-5phW0i6ypZSZuVYyUO49Hz4hkbmSYlgYJpY2b27xXMXv_a_aem_v5AqtjFwaqbubSxYe5Ijhg';

function useRevealCards(deps) {
  React.useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
      document.querySelectorAll('.fadein:not(.visible)').forEach(el => io.observe(el));
      setTimeout(() => {
        document.querySelectorAll('.fadein:not(.visible)').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
          }
        });
      }, 100);
      return () => io.disconnect();
    }, 20);
    return () => clearTimeout(t);
  }, deps);
}

function FilterBar({ options, active, onChange, counts }) {
  const scrollRef = React.useRef(null);
  const [showLeft, setShowLeft] = React.useState(false);
  const [showRight, setShowRight] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  React.useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, options.length]);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector('.filter-chip.active');
    if (activeBtn) {
      const btnRect = activeBtn.getBoundingClientRect();
      const wrapRect = el.getBoundingClientRect();
      if (btnRect.right > wrapRect.right || btnRect.left < wrapRect.left) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [active]);

  return (
    <div className="filter-bar">
      <div className={`filter-fade filter-fade-left ${showLeft ? 'visible' : ''}`} aria-hidden="true" />
      <div className="filter-scroll" ref={scrollRef}>
        {options.map(opt => {
          const count = counts ? counts[opt] : undefined;
          const isEmpty = counts && count === 0 && opt !== 'Todos';
          return (
            <button key={opt}
              className={`filter-chip ${active === opt ? 'active' : ''} ${isEmpty ? 'empty' : ''}`}
              onClick={() => !isEmpty && onChange(opt)}
              disabled={isEmpty}
              title={isEmpty ? `Nenhum item em "${opt}"` : opt}>
              <span>{opt}</span>
              {count !== undefined && (<span className="filter-count">{count}</span>)}
            </button>
          );
        })}
      </div>
      <div className={`filter-fade filter-fade-right ${showRight ? 'visible' : ''}`} aria-hidden="true" />
    </div>
  );
}

window.FilterBar = FilterBar;

function PubCard({ item, index, onOpen }) {
  const hasImage = !!item.image;
  return (
    <article className="card card-clickable fadein"
      onClick={() => onOpen(item)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(item); } }}
      role="button" tabIndex={0}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}>
      {hasImage ? (
        <div className="card-image"><img src={item.image} alt="" loading="lazy" /></div>
      ) : (
        <div className={`card-placeholder placeholder-${slugTipo(item.type)}`} aria-hidden="true">
          <span className="placeholder-label">{item.type}</span>
        </div>
      )}
      <div className="card-body">
        <div className="card-meta">
          <span className="card-tag">{item.type}</span>
          <span>{item.date}</span>
        </div>
        <h3 className="card-title">{item.title}</h3>
        <p className="card-desc">{item.desc}</p>
        {(item.tags || []).length > 0 && (
          <div className="card-tags">
            {(item.tags || []).slice(0, 3).map(t => <span className="chip" key={t}>{t}</span>)}
          </div>
        )}
      </div>
    </article>
  );
}

function slugTipo(t) {
  if (!t) return 'default';
  return String(t).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

window.PubCard = PubCard;

// ═══════════════════════════════════════════════════════════
// PRODUÇÕES
// ═══════════════════════════════════════════════════════════
function ProducoesPage({ setPage, abrirDetalhe }) {
  const { productions } = window.CAEF_DATA;
  const types = ['Todos','TCC','Iniciação Científica','Monografia','Dissertação','Artigo Científico','Extensão Acadêmica'];
  const [filter, setFilter] = React.useState('Todos');
  const [q, setQ] = React.useState('');

  const counts = React.useMemo(() => {
    const c = { Todos: productions.length };
    types.forEach(t => { if (t !== 'Todos') c[t] = 0; });
    productions.forEach(p => { if (c[p.type] !== undefined) c[p.type]++; });
    return c;
  }, [productions]);

  const filtered = productions.filter(p => {
    const matchType = filter === 'Todos' || p.type === filter;
    const matchQuery = q === '' ||
      ((p.title || '') + (p.desc || '') + (p.tags || []).join(' '))
        .toLowerCase().includes(q.toLowerCase());
    return matchType && matchQuery;
  });

  useRevealCards([filter, q, filtered.length]);

  function emptyMessage() {
    if (q.trim()) return `Nada encontrado para "${q}".`;
    if (filter !== 'Todos') return `Nenhuma produção em "${filter}" ainda.`;
    return 'Nenhuma produção disponível no momento.';
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Produções acadêmicas</span>
          <h1>O pensamento <span className="accent">em movimento</span>.</h1>
          <p>TCCs, iniciações científicas, monografias, dissertações, artigos científicos e produções de extensão acadêmica.</p>
        </div>
      </section>
      <section className="container section">
        <div className="filter-toolbar">
          <FilterBar options={types} active={filter} onChange={setFilter} counts={counts} />
          <input value={q} onChange={(e) => setQ(e.target.value)}
                 placeholder="Buscar por título, resumo ou palavra-chave…" className="filter-search" />
        </div>
        <div className="filter-summary">
          {filtered.length} {filtered.length === 1 ? 'produção' : 'produções'}
          {filter !== 'Todos' && ` em "${filter}"`}
          {q.trim() && ` para "${q}"`}
        </div>
        <div className="grid-3">
          {filtered.map((p, i) => (
            <PubCard key={`${filter}-${q}-${p.id || i}`} item={p} index={i} onOpen={abrirDetalhe} />
          ))}
          {filtered.length === 0 && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--muted)', padding: 64, fontFamily: 'var(--font-serif)', fontSize: 22 }}>
              {emptyMessage()}
            </p>
          )}
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// BLOG & NOTÍCIAS
// ═══════════════════════════════════════════════════════════
function NoticiasPage({ setPage, abrirDetalhe }) {
  const { news } = window.CAEF_DATA;
  const types = ['Todos','Notícia','Blog','Coluna de Opinião','Resenha','Cobertura de Evento'];
  const [filter, setFilter] = React.useState('Todos');
  const [q, setQ] = React.useState('');

  const counts = React.useMemo(() => {
    const c = { Todos: news.length };
    types.forEach(t => { if (t !== 'Todos') c[t] = 0; });
    news.forEach(n => { if (c[n.type] !== undefined) c[n.type]++; });
    return c;
  }, [news]);

  const filtered = news.filter(n => {
    const matchType = filter === 'Todos' || n.type === filter;
    const matchQuery = q === '' ||
      ((n.title || '') + (n.desc || '') + (n.content || ''))
        .toLowerCase().includes(q.toLowerCase());
    return matchType && matchQuery;
  });

  useRevealCards([filter, q, filtered.length]);

  function emptyMessage() {
    if (q.trim()) return `Nada encontrado para "${q}".`;
    if (filter !== 'Todos') return `Nenhuma publicação em "${filter}" ainda.`;
    return 'Nenhuma publicação disponível no momento.';
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Blog & Notícias</span>
          <h1>Análises, opiniões e <span className="accent">o mundo agora</span>.</h1>
          <p>Textos, notícias, colunas de opinião, resenhas e coberturas de eventos escritas pelos estudantes e colaboradores do CAEF.</p>
        </div>
      </section>
      <section className="container section">
        <div className="filter-toolbar">
          <FilterBar options={types} active={filter} onChange={setFilter} counts={counts} />
          <input value={q} onChange={(e) => setQ(e.target.value)}
                 placeholder="Buscar por título ou conteúdo…" className="filter-search" />
        </div>
        <div className="filter-summary">
          {filtered.length} {filtered.length === 1 ? 'publicação' : 'publicações'}
          {filter !== 'Todos' && ` em "${filter}"`}
          {q.trim() && ` para "${q}"`}
        </div>
        <div className="grid-3">
          {filtered.map((n, i) => (
            <PubCard key={`${filter}-${q}-${n.id || i}`} item={n} index={i} onOpen={abrirDetalhe} />
          ))}
          {filtered.length === 0 && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--muted)', padding: 64, fontFamily: 'var(--font-serif)', fontSize: 22 }}>
              {emptyMessage()}
            </p>
          )}
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// INDICADORES
// ═══════════════════════════════════════════════════════════
function IndicadoresPage() {
  const { indicators } = window.CAEF_DATA;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Indicadores macroeconômicos</span>
          <h1>O Brasil em <span className="accent">números reais</span>.</h1>
          <p>Painel atualizado com os principais indicadores macroeconômicos, com séries históricas curadas pela equipe do CAEF.</p>
        </div>
      </section>
      <section className="container section">
        <div className="grid-2" style={{ gap: 20 }}>
          {indicators.map((it, i) => {
            const data = genSpark(i + 1, it.up ? 0.6 : -0.6);
            return (
              <div className="indicator-card fadein" key={i} style={{ transitionDelay: `${(i % 4) * 80}ms` }}>
                <div className="indicator-header">
                  <div>
                    <div className="indicator-name">{it.name}</div>
                    <div className="indicator-value">{it.val}</div>
                    <div className={`indicator-change ${it.up ? 'up' : 'down'}`}>
                      {it.up ? '▲' : '▼'} {it.chg} · {it.period}
                    </div>
                  </div>
                  <span className="dot" style={{ background: it.up ? 'var(--up)' : 'var(--down)' }} />
                </div>
                <div className="indicator-spark">
                  <Sparkline data={data} up={it.up} />
                </div>
                <div className="indicator-foot">
                  <span>24 meses</span>
                  <span>{it.src}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// NEWSLETTER
// ═══════════════════════════════════════════════════════════
function NewsletterPage({ abrirDetalhe }) {
  const { issues } = window.CAEF_DATA;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Newsletter mensal</span>
          <h1>Economia, <span className="accent">destrinchada</span>, na sua caixa.</h1>
          <p>Uma edição por mês, com análises, indicadores e leituras selecionadas pelos estudantes de Economia da FACAMP.</p>
        </div>
      </section>
      <section className="container section">
        <div className="newsletter-signup-grid" style={{ padding: '0 0 64px', borderBottom: '1px solid var(--line)' }}>
          <div>
            <h2 style={{ fontSize: 38, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, fontWeight: 700, maxWidth: '18ch' }}>
              Assine <span style={{ fontStyle: 'italic', color: 'var(--ink-3)' }}>gratuitamente</span>.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--muted)', margin: '16px 0 0', maxWidth: 420 }}>
              Mais de 2.300 estudantes, professores e profissionais já recebem a newsletter do CAEF.
            </p>
          </div>
          <div>
            <a href={NEWSLETTER_FORM_URL} target="_blank" rel="noopener" className="btn btn-primary"
               style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 18, padding: '18px 36px' }}>
              Assine <ArrowRight size={16} />
            </a>
            <p style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Abre o formulário em uma nova aba
            </p>
          </div>
        </div>
        <div style={{ marginTop: 64 }}>
          <span className="eyebrow">Edições anteriores</span>
          <div style={{ marginTop: 24 }}>
            {issues.map((it, i) => (
              <div className="newsletter-issue fadein clickable" key={i}
                   onClick={() => abrirDetalhe(it)}
                   role="button" tabIndex={0}
                   onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirDetalhe(it); } }}
                   style={{ transitionDelay: `${i * 60}ms`, cursor: 'pointer' }}>
                <span className="num">№{it.num}</span>
                <div>
                  <h3 className="title">{it.title}</h3>
                  <div className="meta">
                    {it.date} · {it.topics} · {it.read} min
                    {it.pdfUrl && <span> · 📄 PDF</span>}
                  </div>
                </div>
                <span className="read">Ler edição <ArrowRight /></span>
              </div>
            ))}
            {issues.length === 0 && (
              <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-serif)', fontSize: 20, textAlign: 'center', padding: 40 }}>
                Nenhuma edição publicada ainda.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// EVENTOS — v11: mailto quando abertas sem link
// ═══════════════════════════════════════════════════════════
function EventosPage() {
  const { events } = window.CAEF_DATA;
  const cats = ['Todos', 'Evento', 'Palestra', 'Workshop', 'Monitorias', 'Roda de Conversa'];
  const [cat, setCat] = React.useState('Todos');
  const filtered = events.filter(e => cat === 'Todos' || e.cat === cat);

  const counts = React.useMemo(() => {
    const c = { Todos: events.length };
    cats.forEach(t => { if (t !== 'Todos') c[t] = 0; });
    events.forEach(e => { if (c[e.cat] !== undefined) c[e.cat]++; });
    return c;
  }, [events]);

  useRevealCards([cat, filtered.length]);

  function formatarHorario(ev) {
    if (!ev.temFim) return ev.horaInicio;
    if (ev.mesmoDia) return `${ev.horaInicio} → ${ev.horaFim}`;
    return `${ev.dataInicioCurta} ${ev.horaInicio} → ${ev.dataFimCurta} ${ev.horaFim}`;
  }

  function labelVagas(ev) {
    if (ev.esgotado) return { text: '🚫 Esgotado', color: 'var(--down, #d33)' };
    if (ev.vagas && ev.vagas > 0) return { text: `👥 ${ev.vagas} vaga${ev.vagas === 1 ? '' : 's'}`, color: 'var(--muted)' };
    return { text: '✓ Vagas livres', color: 'var(--up, #2a7)' };
  }

  // Botão de inscrição usa componente compartilhado (event-btn.jsx)
  // Mesma lógica é usada na home também, garantindo consistência.

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Agenda</span>
          <h1>Eventos, <span className="accent">ao vivo</span>.</h1>
          <p>Palestras, workshops, rodas de conversa, monitorias e outros eventos organizados pelo CAEF ao longo do semestre.</p>
        </div>
      </section>
      <section className="container section">
        <div className="filter-toolbar">
          <FilterBar options={cats} active={cat} onChange={setCat} counts={counts} />
        </div>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--muted)', padding: 64, fontFamily: 'var(--font-serif)', fontSize: 22 }}>
            {cat === 'Todos' ? 'Nenhum evento programado no momento.' : `Nenhum evento em "${cat}" ainda.`}
          </p>
        )}
        {filtered.map((ev, i) => {
          const vagas = labelVagas(ev);
          const horario = formatarHorario(ev);

          return (
            <div className="event-card fadein" key={`${cat}-${i}`} style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="event-date">
                <span className="day">{ev.day}</span>
                <span className="mon">{ev.mon} · {ev.year}</span>
              </div>
              <div>
                <div style={{ display: 'inline-block', padding: '3px 9px', fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', border: '1px solid var(--line)', borderRadius: 3, color: 'var(--muted)', marginBottom: 10 }}>
                  {ev.cat}
                </div>
                <h3 className="event-title">{ev.title}</h3>
                <div className="event-meta">
                  <span className="event-meta-item">◷ {horario}</span>
                  {ev.loc && <span className="event-meta-item">◉ {ev.loc}</span>}
                  <span className="event-meta-item" style={{ color: vagas.color, fontWeight: 500 }}>
                    {vagas.text}
                  </span>
                </div>
                <p className="event-desc">{ev.desc}</p>
              </div>

              <BotaoInscricaoEvento evento={ev} />
            </div>
          );
        })}
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// SOBRE
// ═══════════════════════════════════════════════════════════
function SobrePage() {
  const { members } = window.CAEF_DATA;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Sobre o CAEF</span>
          <h1>Um centro acadêmico <span className="accent">vivo</span>.</h1>
          <p>Quem somos, o que fazemos e por que estudantes de Economia se organizam desde 2008 para pensar o Brasil.</p>
        </div>
      </section>
      <section className="container section">
        <div className="about-block">
          <h2>Missão</h2>
          <div className="body">
            <p>Promover o desenvolvimento <em>acadêmico, crítico e humano</em> dos estudantes de Economia da FACAMP, articulando ensino, pesquisa e extensão em torno de questões econômicas relevantes para o Brasil contemporâneo.</p>
            <p>O CAEF entende a Economia como uma ciência social aplicada — irredutível a modelos abstratos e sempre tensionada por escolhas políticas. Por isso, valorizamos a pluralidade metodológica, o rigor analítico e o compromisso com o debate público.</p>
          </div>
        </div>
        <div className="about-block">
          <h2>Histórico</h2>
          <div className="body">
            <p>Fundado em 2008 por um grupo de estudantes interessados em estender o curso de Economia para além da sala de aula, o CAEF organiza ciclos de debate, grupos de estudo, semanas acadêmicas e produções escritas há mais de 17 anos.</p>
            <p>Hoje conta com uma rede de aproximadamente 250 estudantes ativos, uma newsletter mensal, painel de indicadores próprio e parcerias com IPEA, Banco Central, FGV e CEPAL para visitas e palestras.</p>
          </div>
        </div>
        <div className="about-block">
          <h2>Valores</h2>
          <div className="body">
            <div className="values-grid">
              <div className="value-card"><h3>Pluralidade</h3><p>Incentivar a convivência de diferentes correntes de pensamento econômico e político, respeitando a diversidade de ideias.</p></div>
              <div className="value-card"><h3>Acessibilidade</h3><p>Tornar eventos, debates e materiais compreensíveis e acolhedores para todos, principalmente calouros.</p></div>
              <div className="value-card"><h3>Inovação</h3><p>Propor atividades, debates e projetos que atualizem o olhar sobre Economia e sua inserção no mundo real.</p></div>
              <div className="value-card"><h3>Credibilidade</h3><p>Atuar com responsabilidade acadêmica, transparência e rigor intelectual.</p></div>
              <div className="value-card" style={{ gridColumn: '1 / -1' }}><h3>Tradição &amp; História</h3><p>Honrar a história da área, da FACAMP e do professor Luiz Gonzaga Belluzzo, sem deixar de evoluir.</p></div>
            </div>
          </div>
        </div>

        {/* ─── Seção "Seja monitor(a)" ─── */}
        <div id="monitoria" style={{
          marginTop: 64,
          padding: 40,
          borderRadius: 12,
          background: 'var(--paper-2)',
          border: '1px solid var(--line)',
          scrollMarginTop: 80
        }}>
          <span className="eyebrow">Participe do CAEF</span>
          <h2 style={{
            fontSize: 36, margin: '12px 0 16px', fontWeight: 700,
            letterSpacing: '-0.02em', lineHeight: 1.1
          }}>
            Seja <span style={{ fontStyle: 'italic', color: 'var(--ink-3)' }}>monitor(a)</span>.
          </h2>
          <p style={{
            color: 'var(--muted)', fontSize: 16, lineHeight: 1.6,
            margin: '0 0 28px', maxWidth: '58ch'
          }}>
            O CAEF abre periodicamente vagas de monitoria nas disciplinas de Economia.
            É uma oportunidade de aprofundar seus estudos, ajudar colegas e desenvolver
            habilidades acadêmicas. Leia o edital e preencha o formulário de interesse.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href={MONITORIA_FORM_URL}
              target="_blank"
              rel="noopener"
              className="btn btn-primary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontSize: 15, padding: '14px 28px'
              }}
            >
              Formulário de interesse <ArrowRight size={14} />
            </a>
            <a
              href={MONITORIA_EDITAL_URL}
              target="_blank"
              rel="noopener"
              className="btn btn-outline"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontSize: 15, padding: '14px 28px'
              }}
            >
              Ler edital <ArrowRight size={14} />
            </a>
          </div>
          <p style={{
            fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--muted)',
            marginTop: 16, textTransform: 'uppercase', letterSpacing: '0.12em'
          }}>
            Ambos abrem em nova aba
          </p>
        </div>

        <div id="equipe" style={{ paddingTop: 48, scrollMarginTop: 80 }}>
          <span className="eyebrow">Gestão Atual</span>
          <h2 style={{ fontSize: 36, margin: '12px 0 0', fontWeight: 700, letterSpacing: '-0.02em' }}>Quem está à frente</h2>
          <div className="member-grid">
            {members.map((m, i) => (
              <div className="member fadein" key={i} style={{ transitionDelay: `${(i % 4) * 80}ms` }}>
                {m.photo ? (
                  <div className="member-portrait member-portrait-photo">
                    <img src={m.photo} alt={m.name} loading="lazy"
                         onError={(e) => {
                           e.target.style.display = 'none';
                           e.target.parentElement.classList.add('failed');
                           e.target.parentElement.textContent = m.init;
                         }} />
                  </div>
                ) : (
                  <div className="member-portrait">{m.init}</div>
                )}
                <div className="member-name">{m.name}</div>
                <div className="member-role">{m.role}</div>

                {/* Contatos: email + LinkedIn — só aparece se cadastrado */}
                {(m.email || m.linkedin) && (
                  <div className="member-contatos" style={{
                    display: 'flex',
                    gap: 10,
                    marginTop: 8,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {m.email && (
                      <a
                        href={`mailto:${m.email}`}
                        className="member-email"
                        title={`Enviar e-mail para ${m.name}`}
                        style={{
                          fontSize: 12,
                          color: 'var(--muted)',
                          textDecoration: 'none',
                          fontFamily: 'var(--font-sans)',
                          wordBreak: 'break-all',
                          maxWidth: '100%'
                        }}
                      >
                        {m.email}
                      </a>
                    )}
                    {m.linkedin && (
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener"
                        className="member-linkedin"
                        title={`Ver ${m.name} no LinkedIn`}
                        style={{
                          fontSize: 12,
                          color: 'var(--ink-3)',
                          textDecoration: 'none',
                          fontFamily: 'var(--font-mono)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          padding: '3px 8px',
                          border: '1px solid var(--line)',
                          borderRadius: 3,
                          fontWeight: 500
                        }}
                      >
                        in ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
            {members.length === 0 && (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--muted)', padding: 40, fontFamily: 'var(--font-serif)' }}>
                Nenhum membro cadastrado ainda.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// CONTATO — agora com botão pra Google Forms
// ═══════════════════════════════════════════════════════════
function ContatoPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Contato</span>
          <h1>Fale <span className="accent">com a gente</span>.</h1>
          <p>Imprensa, parcerias, dúvidas sobre eventos ou interesse em colaborar — escolha o canal mais próximo.</p>
        </div>
      </section>
      <section className="container section">
        <div className="contact-grid">
          {/* ─── Coluna esquerda: informações ─── */}
          <div>
            <dl className="contact-info" style={{ margin: 0 }}>
              <dt>E-mail</dt>
              <dd>
                <a href="mailto:contato@caef.eco.br">contato@caef.eco.br</a>
              </dd>

              <dt>Newsletter</dt>
              <dd>
                <a href="mailto:newsletter@caef.eco.br">newsletter@caef.eco.br</a>
              </dd>

              <dt>Endereço</dt>
              <dd style={{ fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.5 }}>
                FACAMP — Bloco 18<br />
                Av. Alan Turing, 805<br />
                Cidade Universitaria · Campinas · SP · 13083-898
              </dd>

              <dt>Redes sociais</dt>
              <dd style={{ display: 'flex', gap: 16, fontSize: 14, fontFamily: 'var(--font-sans)' }}>
                <a href="https://www.instagram.com/caef.belluzzo?igsi=cTdwM2R6bGlzNjAz" target="_blank" rel="noopener">Instagram</a>
                <a href="https://share.google/7duPl3kjKq2kFNmMR" target="_blank" rel="noopener">LinkedIn</a>
              </dd>
            </dl>
          </div>

          {/* ─── Coluna direita: card destacado com botão do formulário ─── */}
          <div>
            <div style={{
              padding: 32,
              borderRadius: 8,
              background: 'var(--paper-2)',
              border: '1px solid var(--line)'
            }}>
              <h2 style={{
                fontSize: 28, lineHeight: 1.15, letterSpacing: '-0.02em',
                margin: 0, fontWeight: 700
              }}>
                Envie sua <span style={{ fontStyle: 'italic', color: 'var(--ink-3)' }}>mensagem</span>.
              </h2>

              <p style={{ color: 'var(--muted)', margin: '16px 0 24px', fontSize: 15, lineHeight: 1.55 }}>
                Use o formulário abaixo pra falar com a gente sobre imprensa, parcerias, dúvidas gerais ou pra sugerir uma pauta pra newsletter.
              </p>

              <a
                href={CONTATO_FORM_URL}
                target="_blank"
                rel="noopener"
                className="btn btn-primary"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  fontSize: 16, padding: '14px 28px'
                }}
              >
                Abrir formulário <ArrowRight size={16} />
              </a>

              <p style={{
                fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--muted)',
                marginTop: 16, textTransform: 'uppercase', letterSpacing: '0.12em'
              }}>
                Abre em nova aba · Respondemos em até 3 dias úteis
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Object.assign(window, {
  ProducoesPage, NoticiasPage, IndicadoresPage,
  NewsletterPage, EventosPage, SobrePage, ContatoPage
});
