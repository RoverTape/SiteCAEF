// Shared chrome: Nav, Ticker, Footer

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
  const items = ['home','producoes','indicadores','newsletter','eventos','sobre','contato'];
  const labels = { home: 'Home', producoes: 'Produções', indicadores: 'Indicadores', newsletter: 'Newsletter', eventos: 'Eventos', sobre: 'Sobre', contato: 'Contato' };
  const go = (k) => { setPage(k); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <a className="nav-brand" onClick={(e) => { e.preventDefault(); go('home'); }} href="#">
            <img src="img/logo2.png" className="nav-brand-mark" alt="CAEF" />
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '0.04em', color: 'var(--ink)' }}>FACAMP</span>
          </a>
          <div className="nav-links">
            {items.map(k => (
              <a key={k} href="#" onClick={(e) => { e.preventDefault(); go(k); }}
                 className={`nav-link ${page === k ? 'active' : ''}`}>
                {labels[k]}
              </a>
            ))}
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
          {items.map((k, i) => (
            <a key={k} href="#" onClick={(e) => { e.preventDefault(); go(k); }}
               className={`mobile-link ${page === k ? 'active' : ''}`}
               style={{ transitionDelay: menuOpen ? `${i * 40 + 80}ms` : '0ms' }}>
              <span className="mobile-link-num">0{i+1}</span>
              <span>{labels[k]}</span>
            </a>
          ))}
          <button className="btn btn-primary" style={{ marginTop: 32 }} onClick={() => go('newsletter')}>
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

function Ticker() {
  const { indicators } = window.CAEF_DATA;
  const items = [...indicators, ...indicators]; // duplicate for seamless loop
  return (
    <div className="ticker" style={{ marginTop: 68 }}>
      <div className="ticker-track">
        {items.map((it, i) => (
          <span className="ticker-item" key={i}>
            <span className="ticker-label">{it.name}</span>
            <span className="ticker-val">{it.val}</span>
            <span className={`ticker-chg ${it.up ? 'up' : 'down'}`}>
              {it.up ? '▲' : '▼'} {it.chg}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Footer({ setPage }) {
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
          {['home','producoes','indicadores','eventos'].map(k => (
            <a key={k} href="#" onClick={(e) => { e.preventDefault(); setPage(k); window.scrollTo({ top: 0 }); }}>
              {{ home: 'Home', producoes: 'Produções', indicadores: 'Indicadores', eventos: 'Eventos' }[k]}
            </a>
          ))}
        </div>
        <div>
          <h4>Comunidade</h4>
          <a href="#">Newsletter</a>
          <a href="#">Sobre</a>
          <a href="#">Equipe</a>
          <a href="#">Contato</a>
        </div>
        <div>
          <h4>Contato</h4>
          <a href="mailto:caef@facamp.com.br">caef@facamp.com.br</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">YouTube</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 CAEF · FACAMP</span>
        <span>Campinas · SP · Brasil</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Ticker, Footer });
