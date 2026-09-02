function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const items = [
    { k: 'home',        label: 'Home' },
    { k: 'producoes',   label: 'Produções' },
    { k: 'noticias',    label: 'Blog' },
    { k: 'indicadores', label: 'Indicadores' },
    { k: 'newsletter',  label: 'Newsletter' },
    { k: 'eventos',     label: 'Eventos' },
    { k: 'sobre',       label: 'Sobre' },
    { k: 'sobre',       label: 'Monitoria', anchor: 'monitoria' },
    { k: 'contato',     label: 'Contato' }
  ];

  const go = (item) => {
    setPage(item.k);
    setMenuOpen(false);
    if (item.anchor) {
      // Espera o React renderizar a página, então scroll pra âncora
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(item.anchor);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            setTimeout(() => {
              const retry = document.getElementById(item.anchor);
              if (retry) retry.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <a className="nav-brand" onClick={(e) => { e.preventDefault(); go({ k: 'home' }); }} href="#">
            <img src="img/logo2.png" className="nav-brand-mark" alt="CAEF" />
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '0.04em', color: 'var(--ink)' }}>FACAMP</span>
          </a>
          <div className="nav-links">
            {items.map((item, idx) => {
              // "active" vira true se estamos na pagina E:
              //  - o item não tem âncora (link normal), OU
              //  - o item tem âncora e é o item ativo (não temos como saber isso, então só o Sobre "genérico" fica active)
              const isActive = page === item.k && !item.anchor;
              return (
                <a key={item.label + idx} href="#"
                   onClick={(e) => { e.preventDefault(); go(item); }}
                   className={`nav-link ${isActive ? 'active' : ''}`}>
                  {item.label}
                </a>
              );
            })}
          </div>
          <button className="nav-burger" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(o => !o)}>
            <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
            <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
            <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </nav>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
        <div className="mobile-menu-inner" onClick={(e) => e.stopPropagation()}>
          {items.map((item, i) => {
            const isActive = page === item.k && !item.anchor;
            return (
              <a key={item.label + i} href="#"
                 onClick={(e) => { e.preventDefault(); go(item); }}
                 className={`mobile-link ${isActive ? 'active' : ''}`}
                 style={{ transitionDelay: menuOpen ? `${i * 40 + 80}ms` : '0ms' }}>
                <span className="mobile-link-num">0{i+1}</span>
                <span>{item.label}</span>
              </a>
            );
          })}
          <button className="btn btn-primary" style={{ marginTop: 32 }} onClick={() => go({ k: 'newsletter' })}>
            Assinar Newsletter
          </button>
          <div style={{ marginTop: 32, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.55, fontWeight: 500 }}>
            Professor Luiz Gonzaga Belluzzo
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// Ticker — loop infinito à prova de bala
// ═══════════════════════════════════════════════════════════
function Ticker() {
  const { indicators } = window.CAEF_DATA;

  if (!indicators || indicators.length === 0) {
    return <div className="ticker ticker-empty" style={{ marginTop: 68, height: 40 }} />;
  }

  // Repete os indicadores DENTRO da slide o suficiente pra ela
  // ficar maior que o viewport da tela. Assumindo cada indicador
  // ocupa ~180px + 40px gap = 220px, 5-6 indicadores = ~1200px.
  // Precisa ser maior que ~2000px (telas ultra-wide chegam a 2560px).
  // 3 repetições × 6 itens × 220px = ~4000px. Seguro.
  const REPETICOES_POR_SLIDE = 3;

  const slideItems = [];
  for (let r = 0; r < REPETICOES_POR_SLIDE; r++) {
    slideItems.push(...indicators);
  }

  const renderSlide = (slideKey) => (
    <div className="ticker-slide" key={slideKey} aria-hidden={slideKey === 'copy'}>
      {slideItems.map((it, i) => (
        <span className="ticker-item" key={`${slideKey}-${i}`}>
          <span className="ticker-label">{it.name}</span>
          <span className="ticker-val">{it.val}</span>
          <span className={`ticker-chg ${it.up ? 'up' : 'down'}`}>
            {it.up ? '▲' : '▼'} {it.chg}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="ticker" style={{ marginTop: 68 }}>
      <div className="ticker-track">
        {renderSlide('a')}
        {renderSlide('copy')}
      </div>
    </div>
  );
}

function Footer({ setPage }) {
  const goTo = (page, anchor) => (e) => {
    e.preventDefault();
    setPage(page);

    if (anchor) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(anchor);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            setTimeout(() => {
              const retry = document.getElementById(anchor);
              if (retry) retry.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        });
      });
    } else {
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div>
          <div style={{ marginBottom: 10 }}>
            <img src="img/fotterimg.png" alt="CAEF" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.75, maxWidth: 340, margin: 0 }}>
            Centro Acadêmico de Economia da FACAMP — Professor Luiz Gonzaga Belluzzo. Promovendo o desenvolvimento acadêmico, crítico e humano dos estudantes desde 2008.
          </p>
        </div>
        <div>
          <h4>Navegação</h4>
          <a href="#" onClick={goTo('home')}>Home</a>
          <a href="#" onClick={goTo('producoes')}>Produções</a>
          <a href="#" onClick={goTo('noticias')}>Blog & Notícias</a>
          <a href="#" onClick={goTo('indicadores')}>Indicadores</a>
          <a href="#" onClick={goTo('eventos')}>Eventos</a>
          <a
            href="admin/index.html"
            target="_blank"
            rel="noopener"
            className="footer-restricted"
            title="Login do painel administrativo"
          >
            Área restrita <span style={{ fontSize: 11, opacity: 0.7 }}>↗</span>
          </a>
        </div>
        <div>
          <h4>Comunidade</h4>
          <a href="#" onClick={goTo('newsletter')}>Newsletter</a>
          <a href="#" onClick={goTo('sobre')}>Sobre</a>
          <a href="#" onClick={goTo('sobre', 'equipe')}>Equipe</a>
          <a href="#" onClick={goTo('contato')}>Contato</a>
        </div>
        <div>
          <h4>Contato</h4>
          <a href="mailto:contato@caef.eco.br">contato@caef.eco.br</a>
          <a href="https://www.instagram.com/caef.belluzzo?igsi=cTdwM2R6bGlzNjAz" target="_blank" rel="noopener">Instagram</a>
          <a href="https://share.google/7duPl3kjKq2kFNmMR" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© CAEF · FACAMP</span>
        <span>Campinas · SP · Brasil</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Ticker, Footer });
