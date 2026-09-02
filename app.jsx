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

  // Item selecionado pra página de detalhe + de onde veio
  const [detalheItem, setDetalheItem] = React.useState(null);
  const [voltarPara, setVoltarPara] = React.useState('home');

  const abrirDetalhe = React.useCallback((item) => {
    setDetalheItem(item);
    setVoltarPara(page);
    setPage('detalhe');
  }, [page]);

  // Re-render quando os dados do Supabase chegam
  const [dataVer, setDataVer] = React.useState(0);
  React.useEffect(() => {
    const onReady = () => setDataVer(v => v + 1);
    window.addEventListener('caef:data-ready', onReady);
    return () => window.removeEventListener('caef:data-ready', onReady);
  }, []);

  React.useEffect(() => { applyPalette(); }, []);

  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fadein:not(.visible)').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [page, dataVer]);

  React.useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [page]);

  const pages = {
    home:        <window.HomePage setPage={setPage} abrirDetalhe={abrirDetalhe} />,
    producoes:   <window.ProducoesPage setPage={setPage} abrirDetalhe={abrirDetalhe} />,
    noticias:    <window.NoticiasPage setPage={setPage} abrirDetalhe={abrirDetalhe} />,   // NOVA
    indicadores: <window.IndicadoresPage />,
    newsletter:  <window.NewsletterPage abrirDetalhe={abrirDetalhe} />,
    eventos:     <window.EventosPage />,
    sobre:       <window.SobrePage />,
    contato:     <window.ContatoPage />,
    detalhe:     <window.DetalhePage item={detalheItem} setPage={setPage} voltarPara={voltarPara} />,
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
