// page-detalhe.jsx — página de detalhe

function driveEmbedFromUrl(url) {
  if (!url) return null;
  const match = url.match(/\/file\/d\/([^\/]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  return null;
}

function DetalhePage({ item, setPage, voltarPara }) {
  if (!item) {
    return (
      <section className="container section">
        <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-serif)', fontSize: 22, textAlign: 'center' }}>
          Publicação não encontrada.
        </p>
      </section>
    );
  }

  const isProducao = item.kind === 'producao';
  const isNoticia = item.kind === 'noticia' || item.kind === 'newsletter';
  const temGaleria = (item.galeriaFotos || []).length > 0;

  // Notícia com PDF: usa embed
  const noticiaPdfEmbed = isNoticia && item.pdfEmbedUrl ? item.pdfEmbedUrl : null;
  const noticiaPdfUrl = isNoticia ? item.pdfUrl : null;
  // Notícia com PDF de SharePoint: tem URL mas pdfEmbedUrl é null
  // (SharePoint corporativo bloqueia iframe)
  const noticiaPdfSemEmbed = isNoticia && noticiaPdfUrl && !noticiaPdfEmbed;

  // Produção com PDF: SEM embed, só link
  // Detecta se é Drive apenas pra saber o que mostrar no botão
  const producaoPdf = isProducao ? item.pdf : null;
  const producaoPdfEhDrive = producaoPdf && producaoPdf.indexOf('drive.google.com') !== -1;

  const layoutRevista = !!noticiaPdfEmbed;

  return (
    <>
      <section className="detalhe-hero">
        <div className="container">
          <button
            className="btn-voltar"
            onClick={() => setPage(voltarPara || 'home')}
          >
            ← Voltar
          </button>
        </div>
      </section>

      <article className={`detalhe-artigo ${layoutRevista ? 'layout-revista' : ''}`}>
        <div className="container detalhe-container">

          {item.image && (
            <div className="detalhe-capa">
              <img src={item.image} alt="" />
            </div>
          )}

          <header className="detalhe-header">
            <div className="detalhe-meta">
              <span className="detalhe-tag">{item.type}</span>
              <span>{item.date}</span>
              {item.readMinutes && (
                <span>· {item.readMinutes} min de leitura</span>
              )}
            </div>

            <h1 className="detalhe-titulo">{item.title}</h1>

            {isProducao && (item.autores || []).length > 0 && (
              <div className="detalhe-autores">
                por <strong>{item.autores.join(', ')}</strong>
                {item.orientador && (
                  <>
                    <br />
                    <span style={{ opacity: 0.7 }}>orientação de {item.orientador}</span>
                  </>
                )}
              </div>
            )}

            {isProducao && (item.area || item.notaMencao) && (
              <div className="detalhe-info-extra">
                {item.area && <span>Área: <strong>{item.area}</strong></span>}
                {item.notaMencao && <span>· {item.notaMencao}</span>}
              </div>
            )}
          </header>

          {/* Corpo textual — notícias ganham classe "corpo-jornal" pra estilos especiais */}
          {item.content && (
            <div className={`detalhe-corpo ${isNoticia ? 'corpo-jornal' : ''}`}>
              {item.content.split('\n\n').filter(p => p.trim()).map((paragrafo, i) => (
                <p key={i} className={i === 0 && isNoticia ? 'lead-paragraph' : ''}>
                  {paragrafo}
                </p>
              ))}
            </div>
          )}

          {/* PDF embutido — SÓ pra notícias com Drive ou OneDrive pessoal */}
          {noticiaPdfEmbed && (
            <div className="detalhe-pdf-embed">
              <div className="detalhe-pdf-header">
                <span className="detalhe-pdf-label">📄 Documento completo</span>
                <div className="detalhe-pdf-actions">
                  <a href={noticiaPdfUrl} target="_blank" rel="noopener" className="btn btn-outline">
                    Abrir em nova aba ↗
                  </a>
                  <a href={noticiaPdfUrl} target="_blank" rel="noopener" className="btn btn-primary">
                    Baixar PDF ↓
                  </a>
                </div>
              </div>
              <div className="detalhe-pdf-frame">
                <iframe
                  src={noticiaPdfEmbed}
                  title={item.title}
                  allow="autoplay"
                  loading="lazy"
                />
              </div>
              <p className="detalhe-pdf-nota">
                Não consegue visualizar? Use "Abrir em nova aba" ou "Baixar PDF" acima.
              </p>
            </div>
          )}

          {/* PDF de NOTÍCIA sem embed (ex: SharePoint da FACAMP) */}
          {/* Reaproveita o mesmo layout de "produção com PDF" — card centralizado */}
          {noticiaPdfSemEmbed && (
            <div className="detalhe-pdf-producao">
              <div className="detalhe-pdf-producao-label">
                📄 Documento completo
              </div>
              <div className="detalhe-pdf-producao-actions">
                <a
                  href={noticiaPdfUrl}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-primary btn-lg"
                >
                  Abrir documento ↗
                </a>
              </div>
              <p className="detalhe-pdf-producao-nota">
                O documento abre no OneDrive em uma nova aba.
              </p>
            </div>
          )}

          {/* Galeria */}
          {temGaleria && (
            <GaleriaFotos fotos={item.galeriaFotos} tituloEvento={item.title} />
          )}

          {/* PRODUÇÃO com PDF — sem embed, botões grandes */}
          {producaoPdf && (
            <div className="detalhe-pdf-producao">
              <div className="detalhe-pdf-producao-label">
                📄 Trabalho completo em PDF
              </div>
              <div className="detalhe-pdf-producao-actions">
                <a
                  href={producaoPdf}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-primary btn-lg"
                >
                  {producaoPdfEhDrive ? 'Ler online ↗' : 'Baixar PDF ↓'}
                </a>
                {!producaoPdfEhDrive && (
                  <a
                    href={producaoPdf}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-outline btn-lg"
                  >
                    Abrir em nova aba ↗
                  </a>
                )}
              </div>
              {producaoPdfEhDrive && (
                <p className="detalhe-pdf-producao-nota">
                  O documento abre no Google Drive em uma nova aba.
                </p>
              )}
            </div>
          )}

          {/* Link externo da produção */}
          {isProducao && item.link && (
            <div className="detalhe-acoes" style={{ marginTop: producaoPdf ? 12 : 0 }}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener"
                className="btn btn-outline"
              >
                Ver página externa ↗
              </a>
            </div>
          )}

          {(item.tags || []).length > 0 && (
            <div className="detalhe-tags">
              {item.tags.map(t => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          )}

        </div>
      </article>
    </>
  );
}

function GaleriaFotos({ fotos, tituloEvento }) {
  const [lightboxIdx, setLightboxIdx] = React.useState(null);

  React.useEffect(() => {
    if (lightboxIdx === null) return;
    function onKey(e) {
      if (e.key === 'Escape') setLightboxIdx(null);
      else if (e.key === 'ArrowRight') setLightboxIdx(i => Math.min((i ?? 0) + 1, fotos.length - 1));
      else if (e.key === 'ArrowLeft') setLightboxIdx(i => Math.max((i ?? 0) - 1, 0));
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIdx, fotos.length]);

  return (
    <>
      <div className="galeria-secao">
        <h2 className="galeria-titulo">
          📸 Galeria do evento
          <span className="galeria-count">{fotos.length} {fotos.length === 1 ? 'foto' : 'fotos'}</span>
        </h2>
        <div className="galeria-grid">
          {fotos.map((url, i) => (
            <button
              key={i}
              className="galeria-thumb"
              onClick={() => setLightboxIdx(i)}
              aria-label={`Abrir foto ${i + 1}`}
            >
              <img src={url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {lightboxIdx !== null && (
        <div className="lightbox" onClick={() => setLightboxIdx(null)} role="dialog" aria-modal="true">
          <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }} aria-label="Fechar">×</button>
          {lightboxIdx > 0 && (
            <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }} aria-label="Anterior">‹</button>
          )}
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img src={fotos[lightboxIdx]} alt="" />
            <div className="lightbox-caption">
              {lightboxIdx + 1} / {fotos.length}
              {tituloEvento && <> · {tituloEvento}</>}
            </div>
          </div>
          {lightboxIdx < fotos.length - 1 && (
            <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }} aria-label="Próxima">›</button>
          )}
        </div>
      )}
    </>
  );
}

window.DetalhePage = DetalhePage;
