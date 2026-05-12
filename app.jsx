// CAEF — App principal

const PALETTE = {
  '--ink':     '#14123A',
  '--ink-2':   '#233269',
  '--ink-3':   '#3B378B',
  '--aqua':    '#73CBD5',
  '--orange':  '#F39215',
  '--paper':   '#FFFFFF',
  '--paper-2': '#F6F7FA',
};

function applyPalette() {
  for (const [k, v] of Object.entries(PALETTE))
    document.documentElement.style.setProperty(k, v);
}

function SplashScreen() {
  const [gone, setGone] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setGone(true), 1300);
    return () => clearTimeout(t);
  }, []);
  if (gone) return null;
  return (
    <div className="splash">
      <img src="img/animacaoinicial1.png" className="splash-logo" alt="CAEF" />
    </div>
  );
}

function App() {
  const [page, setPage] = React.useState('home');

  // Aplica paleta institucional uma única vez
  React.useEffect(() => { applyPalette(); }, []);

  // Fade-in por scroll em cada mudança de página
  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fadein:not(.visible)').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [page]);

  // Volta ao topo ao trocar de página
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [page]);

  const pages = {
    home:        <window.HomePage setPage={setPage} />,
    producoes:   <window.ProducoesPage />,
    indicadores: <window.IndicadoresPage />,
    newsletter:  <window.NewsletterPage />,
    eventos:     <window.EventosPage />,
    sobre:       <window.SobrePage />,
    contato:     <window.ContatoPage />,
  };

  return (
    <>
      <SplashScreen />
      <Nav page={page} setPage={setPage} />
      <Ticker />
      <main>{pages[page]}</main>
      <Footer setPage={setPage} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
