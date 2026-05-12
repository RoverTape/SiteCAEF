// Produções page — list with filters

function ProducoesPage() {
  const { productions } = window.CAEF_DATA;
  const types = ['Todos', 'Artigo', 'Iniciação Científica', 'Blog', 'Resenha'];
  const [filter, setFilter] = React.useState('Todos');
  const [q, setQ] = React.useState('');
  const filtered = productions.filter(p =>
    (filter === 'Todos' || p.type === filter) &&
    (q === '' || (p.title + p.desc + p.tags.join(' ')).toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Produções acadêmicas</span>
          <h1>O pensamento <span className="accent">em movimento</span>.</h1>
          <p>Artigos, iniciações científicas, blog e resenhas escritas por estudantes e professores associados ao CAEF.</p>
        </div>
      </section>
      <section className="container section">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
          <div className="filters" style={{ margin: 0 }}>
            {types.map(t => (
              <button key={t} className={`filter-chip ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
            ))}
          </div>
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título, descrição ou tag…"
            style={{ minWidth: 280, padding: '10px 18px', borderRadius: 999, border: '1px solid var(--line)', background: 'var(--white)', fontFamily: 'inherit', fontSize: 14, color: 'var(--ink)', outline: 'none' }}
          />
        </div>
        <div className="grid-3">
          {filtered.map((p, i) => (
            <article className="card fadein" key={i} style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
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
          {filtered.length === 0 && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--muted)', padding: 64, fontFamily: 'var(--font-serif)', fontSize: 22 }}>
              Nada encontrado para “{q}”.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

// Indicadores
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

// Newsletter
function NewsletterPage() {
  const { issues } = window.CAEF_DATA;
  const [email, setEmail] = React.useState('');
  const [sub, setSub] = React.useState(false);
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', padding: '0 0 64px', borderBottom: '1px solid var(--line)' }}>
          <div>
            <h2 style={{ fontSize: 38, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, fontWeight: 700, maxWidth: '18ch' }}>
              Assine <span style={{ fontStyle: 'italic', color: 'var(--ink-3)' }}>gratuitamente</span>.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--muted)', margin: '16px 0 0', maxWidth: 420 }}>
              Mais de 2.300 estudantes, professores e profissionais já recebem a newsletter do CAEF.
            </p>
          </div>
          <div>
            {!sub ? (
              <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); if (email) setSub(true); }} style={{ maxWidth: 'none' }}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="seu@email.com" required />
                <button type="submit">Assinar</button>
              </form>
            ) : (
              <div style={{ padding: 22, borderRadius: 8, background: 'var(--paper-2)', border: '1px solid var(--line)', fontSize: 17, fontWeight: 600, color: 'var(--ink-3)' }}>
                ✓ Inscrição confirmada — bem-vindo, leitor.
              </div>
            )}
            <p style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Sem spam · cancele quando quiser
            </p>
          </div>
        </div>
        <div style={{ marginTop: 64 }}>
          <span className="eyebrow">Edições anteriores</span>
          <div style={{ marginTop: 24 }}>
            {issues.map((it, i) => (
              <div className="newsletter-issue fadein" key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                <span className="num">№{it.num}</span>
                <div>
                  <h3 className="title">{it.title}</h3>
                  <div className="meta">{it.date} · {it.topics} · {it.read} min</div>
                </div>
                <a href="#" className="read">Ler edição <ArrowRight /></a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// Eventos
function EventosPage() {
  const { events } = window.CAEF_DATA;
  const cats = ['Todos', 'Palestra', 'Workshop', 'Mesa-redonda', 'Encontro'];
  const [cat, setCat] = React.useState('Todos');
  const filtered = events.filter(e => cat === 'Todos' || e.cat === cat);
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Agenda</span>
          <h1>Eventos, <span className="accent">ao vivo</span>.</h1>
          <p>Palestras, workshops, mesas-redondas e encontros organizados pelo CAEF ao longo do semestre.</p>
        </div>
      </section>
      <section className="container section">
        <div className="filters">
          {cats.map(c => (
            <button key={c} className={`filter-chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        {filtered.map((ev, i) => (
          <div className="event-card fadein" key={i} style={{ transitionDelay: `${i * 70}ms` }}>
            <div className="event-date">
              <span className="day">{ev.day}</span>
              <span className="mon">{ev.mon} · {ev.year}</span>
            </div>
            <div>
              <div style={{ display: 'inline-block', padding: '3px 9px', fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', border: '1px solid var(--line)', borderRadius: 3, color: 'var(--muted)', marginBottom: 10 }}>{ev.cat}</div>
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
      </section>
    </>
  );
}

// Sobre
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
        <div style={{ paddingTop: 48 }}>
          <span className="eyebrow">Gestão 2026</span>
          <h2 style={{ fontSize: 36, margin: '12px 0 0', fontWeight: 700, letterSpacing: '-0.02em' }}>Quem está à frente</h2>
          <div className="member-grid">
            {members.map((m, i) => (
              <div className="member fadein" key={i} style={{ transitionDelay: `${(i % 4) * 80}ms` }}>
                <div className="member-portrait">{m.init}</div>
                <div className="member-name">{m.name}</div>
                <div className="member-role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// Contato
function ContatoPage() {
  const [sent, setSent] = React.useState(false);
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
          <div>
            <dl className="contact-info" style={{ margin: 0 }}>
              <dt>E-mail</dt>
              <dd>caef@facamp.com.br</dd>
              <dt>Newsletter</dt>
              <dd>newsletter@caef.org</dd>
              <dt>Imprensa</dt>
              <dd>imprensa@caef.org</dd>
              <dt>Endereço</dt>
              <dd style={{ fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.5 }}>FACAMP — Bloco B, Sala 203<br />R. Prof. Doraval Campos, 50<br />Campinas · SP · 13087-727</dd>
              <dt>Sociais</dt>
              <dd style={{ display: 'flex', gap: 16, fontSize: 14, fontFamily: 'var(--font-sans)' }}>
                <a href="#">Instagram</a><a href="#">LinkedIn</a><a href="#">YouTube</a>
              </dd>
            </dl>
          </div>
          <div>
            {!sent ? (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <div className="form-field">
                  <label>Nome</label>
                  <input required />
                </div>
                <div className="form-field">
                  <label>E-mail</label>
                  <input type="email" required />
                </div>
                <div className="form-field">
                  <label>Assunto</label>
                  <select>
                    <option>Dúvida geral</option>
                    <option>Imprensa</option>
                    <option>Parceria</option>
                    <option>Colaborar com produção</option>
                    <option>Evento</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Mensagem</label>
                  <textarea rows="5" required />
                </div>
                <button className="btn btn-primary" type="submit">Enviar mensagem <ArrowRight /></button>
              </form>
            ) : (
              <div style={{ padding: 28, borderRadius: 8, background: 'var(--paper-2)', border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8, color: 'var(--ink-3)' }}>✓ Mensagem enviada.</div>
                <p style={{ color: 'var(--muted)', margin: 0, fontSize: 15, lineHeight: 1.5 }}>Obrigado pelo contato — respondemos em até 3 dias úteis.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

Object.assign(window, { ProducoesPage, IndicadoresPage, NewsletterPage, EventosPage, SobrePage, ContatoPage });
