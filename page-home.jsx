// Home page — hero variants + destaques + eventos + ticker

function Hero({ variant, setPage }) {
  if (variant === 'editorial') return <HeroEditorial setPage={setPage} />;
  if (variant === 'data') return <HeroData setPage={setPage} />;
  if (variant === 'brand') return <HeroBrand setPage={setPage} />;
  return <HeroGradient setPage={setPage} />;
}

function HeroBrand({ setPage }) {
  const tiles = [
    'blue-text','aqua-dot','orange-text','blue-triangle',
    'aqua-text','blue-dot','ink-text','orange-dot',
    'orange-text','aqua-triangle','blue-text','ink-dot',
    'blue-text','orange-dot','aqua-text','ink-triangle',
  ];
  return (
    <section className="hero hero-brand">
      <div className="container">
        <div className="hero-brand-grid">
          <div className="hero-brand-left">
            <div className="hero-brand-circles" aria-hidden="true">
              <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
                <circle className="hero-brand-circle" cx="240" cy="250" r="200" />
                <circle className="hero-brand-circle" cx="400" cy="250" r="200" />
                <circle className="hero-brand-circle" cx="560" cy="250" r="200" />
              </svg>
            </div>
            <div className="hero-brand-top">
              <span>CAEF · 2026</span>
              <span>FACAMP</span>
            </div>
            <h1 className="hero-brand-title">
              SEJAM<br />BEM-<span className="accent">VINDOS!</span>
            </h1>
            <div className="hero-brand-bot">
              <div className="hero-brand-mark-block">
                <div className="mk">C</div>
                <div>
                  <strong>Centro Acadêmico de</strong>
                  <strong>Economia da FACAMP</strong>
                  <em>Prof. Luiz Gonzaga Belluzzo</em>
                </div>
              </div>
              <span>EST. 2008</span>
            </div>
            <div className="hero-brand-actions">
              <button className="btn btn-primary" onClick={() => setPage('producoes')}>Explorar Produções <ArrowRight /></button>
              <button className="btn btn-outline" onClick={() => setPage('indicadores')}>Ver Indicadores <ArrowRight /></button>
            </div>
          </div>
          <div className="hero-brand-right" aria-hidden="true">
            {tiles.map((t, i) => {
              const [color, shape] = t.split('-');
              const cls = `tile ${color === 'blue' ? 'blue' : color === 'aqua' ? 'aqua' : color === 'orange' ? 'orange' : 'ink'} ${shape}`;
              return <div key={i} className={cls} style={{ animationDelay: `${i * 60}ms` }} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroGradient({ setPage }) {
  return (
    <section className="hero hero-gradient">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-eyebrow fadein visible">
          <span className="hero-eyebrow-dot" />
          <span>Centro Acadêmico · est. 2008</span>
        </div>
        <h1 className="hero-title fadein visible">
          Centro Acadêmico de <span className="accent">Economia</span> FACAMP
        </h1>
        <p className="hero-sub fadein visible delay-1">
          Promovendo o desenvolvimento acadêmico, crítico e humano dos estudantes de Economia da FACAMP. Produções, indicadores, eventos e uma comunidade que pensa o Brasil.
        </p>
        <div className="hero-actions fadein visible delay-2">
          <button className="btn btn-primary" style={{ background: '#fff', color: 'var(--ink)' }} onClick={() => setPage('producoes')}>
            Explorar Produções <ArrowRight />
          </button>
          <button className="btn btn-ghost" onClick={() => setPage('indicadores')}>
            Ver Indicadores <ArrowRight />
          </button>
        </div>
        <div className="hero-belluzzo fadein visible delay-3">Professor Luiz Gonzaga Belluzzo</div>
      </div>
    </section>
  );
}

function HeroEditorial({ setPage }) {
  return (
    <section className="hero hero-editorial">
      <div className="container">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          <span>Edição #024 · Abril 2026</span>
        </div>
        <h1 className="hero-title" style={{ maxWidth: '16ch' }}>
          A economia que <span className="accent">faz sentido</span> hoje.
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginTop: 48, alignItems: 'end' }}>
          <p className="hero-sub" style={{ margin: 0 }}>
            Centro Acadêmico de Economia da FACAMP — produções, indicadores, eventos e uma comunidade que pensa o Brasil em primeira pessoa.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setPage('producoes')}>Explorar Produções <ArrowRight /></button>
            <button className="btn btn-ghost" onClick={() => setPage('indicadores')}>Ver Indicadores <ArrowRight /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroData({ setPage }) {
  const { indicators } = window.CAEF_DATA;
  const five = indicators.slice(0, 5);
  return (
    <section className="hero hero-data">
      <div className="container">
        <div className="hero-eyebrow"><span className="hero-eyebrow-dot" /><span>Centro Acadêmico · Data·Driven</span></div>
        <h1 className="hero-title" style={{ maxWidth: '16ch' }}>
          Economia em <span className="accent">números</span>, não em achismos.
        </h1>
        <p className="hero-sub">
          Indicadores macroeconômicos, produções acadêmicas e debates que partem dos dados. CAEF · FACAMP.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" style={{ background: 'var(--paper)', color: 'var(--ink)' }} onClick={() => setPage('producoes')}>
            Explorar Produções <ArrowRight />
          </button>
          <button className="btn btn-ghost" onClick={() => setPage('indicadores')}>Ver Indicadores <ArrowRight /></button>
        </div>
      </div>
      <div className="container">
        <div className="hero-data-grid">
          {five.map((it, i) => (
            <div className="hero-data-cell fadein visible" key={i} style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="lbl">{it.name}</div>
              <div className="val">{it.val}</div>
              <div className={`chg ${it.up ? 'up' : 'down'}`}>{it.up ? '▲' : '▼'} {it.chg} · {it.period}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsRow() {
  const wrapRef = React.useRef(null);
  React.useEffect(() => {
    if (!wrapRef.current) return;
    const cells = wrapRef.current.querySelectorAll('.stat-cell');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          cells.forEach((c, idx) => setTimeout(() => c.classList.add('visible'), idx * 120));
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);
  return (
    <section className="container section-tight">
      <div className="stat-row" ref={wrapRef}>
        <div className="stat-cell fadein"><div className="stat-num"><CountStat to={148} /></div><div className="stat-lbl">Produções publicadas</div></div>
        <div className="stat-cell fadein delay-1"><div className="stat-num"><CountStat to={24} /></div><div className="stat-lbl">Edições da Newsletter</div></div>
        <div className="stat-cell fadein delay-2"><div className="stat-num"><CountStat to={62} /></div><div className="stat-lbl">Eventos realizados</div></div>
        <div className="stat-cell fadein delay-3"><div className="stat-num"><CountStat to={2008} /></div><div className="stat-lbl">Fundado em</div></div>
      </div>
    </section>
  );
}

function HighlightsHome({ setPage }) {
  const { productions } = window.CAEF_DATA;
  return (
    <section className="container section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Destaques Recentes</span>
          <h2 className="section-head-title fadein visible">Últimas produções acadêmicas e artigos</h2>
        </div>
        <a href="#" className="section-head-link" onClick={(e) => { e.preventDefault(); setPage('producoes'); }}>
          Ver todas <ArrowRight />
        </a>
      </div>
      <div className="grid-3">
        {productions.slice(0, 3).map((p, i) => (
          <article className={`card fadein delay-${i + 1}`} key={i}>
            <div className="card-meta">
              <span className="card-tag">{p.type}</span>
              <span>{p.date}</span>
            </div>
            <h3 className="card-title">{p.title}</h3>
            <p className="card-desc">{p.desc}</p>
            <div className="card-tags">
              {p.tags.map(t => <span className="chip" key={t}>{t}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EventsHome({ setPage }) {
  const { events } = window.CAEF_DATA;
  return (
    <section style={{ background: 'var(--paper-2)' }}>
      <div className="container section">
        <div className="section-head" style={{ borderBottomColor: 'var(--orange)' }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--orange)' }}>Próximos Eventos</span>
            <h2 className="section-head-title fadein visible">Participe das nossas atividades</h2>
          </div>
          <a href="#" className="section-head-link" onClick={(e) => { e.preventDefault(); setPage('eventos'); }}>
            Ver agenda <ArrowRight />
          </a>
        </div>
        <div>
          {events.slice(0, 2).map((ev, i) => (
            <div className={`event-card fadein delay-${i + 1}`} key={i}>
              <div className="event-date">
                <span className="day">{ev.day}</span>
                <span className="mon">{ev.mon} · {ev.year}</span>
              </div>
              <div>
                <h3 className="event-title">{ev.title}</h3>
                <div className="event-meta">
                  <span className="event-meta-item">◷ {ev.time}</span>
                  <span className="event-meta-item">◉ {ev.loc}</span>
                </div>
                <p className="event-desc">{ev.desc}</p>
              </div>
              <a className="event-cta" href="#">Inscrever-se <ArrowRight /></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand({ setPage }) {
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '72px 32px', textAlign: 'center' }}>
        <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)' }}>Newsletter CAEF</span>
        <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '14px 0 16px', color: '#fff' }}>
          Receba a economia, semana a semana.
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(222,222,222,0.82)', margin: '0 0 28px' }}>
          Análises, indicadores e leituras selecionadas pelos estudantes de Economia da FACAMP.
        </p>
        <form className="newsletter-form" style={{ maxWidth: 460, margin: '0 auto' }} onSubmit={(e) => { e.preventDefault(); setPage('newsletter'); }}>
          <input type="email" placeholder="seu@email.com" />
          <button type="submit">Assinar</button>
        </form>
      </div>
    </section>
  );
}

function HomePage({ setPage }) {
  return (
    <>
      <Hero variant="gradient" setPage={setPage} />
      <StatsRow />
      <HighlightsHome setPage={setPage} />
      <EventsHome setPage={setPage} />
      <CtaBand setPage={setPage} />
    </>
  );
}

Object.assign(window, { HomePage });
