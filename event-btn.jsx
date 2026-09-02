// event-btn.jsx — componente compartilhado do botão de inscrição
// Usado por page-home.jsx (bloco "Próximos eventos") e page-rest.jsx (página Eventos)

function BotaoInscricaoEvento({ evento }) {
  const ev = evento;

  if (ev.esgotado) {
    return (
      <span className="event-cta" style={{
        opacity: 0.4, cursor: 'not-allowed',
        textDecoration: 'line-through', pointerEvents: 'none'
      }}>
        Esgotado
      </span>
    );
  }

  if (!ev.inscricoesAbertas) {
    return (
      <span className="event-cta" style={{ opacity: 0.55, cursor: 'default' }}>
        Em breve
      </span>
    );
  }

  if (ev.inscricao) {
    return (
      <a className="event-cta" href={ev.inscricao} target="_blank" rel="noopener">
        Inscrever-se <ArrowRight />
      </a>
    );
  }

  // Abertas mas sem link do formulário ainda
  return (
    <span className="event-cta"
      style={{ opacity: 0.55, cursor: 'default' }}
      title="O link do formulário será disponibilizado em breve">
      Formulário em breve
    </span>
  );
}

window.BotaoInscricaoEvento = BotaoInscricaoEvento;
