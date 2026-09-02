// admin/shared/components.js
(function() {
  var h = React.createElement;
  var useState = React.useState;

  var DROPZONE_STYLE = { display: 'block', width: '100%', boxSizing: 'border-box' };
  var INPUT_STYLE = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--line)',
    borderRadius: 6,
    background: 'var(--bg)',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  };

  function Field(props) {
    var cls = 'field' + (props.full ? ' full' : '');
    return h('div', { className: cls },
      h('label', null,
        props.label,
        props.required && h('span', { className: 'req' }, ' *'),
        props.hint && h('span', { className: 'hint' }, props.hint)
      ),
      props.children,
      props.error && h('div', { className: 'err' }, props.error)
    );
  }

  function TagsInput(props) {
    var value = props.value || [];
    var placeholder = props.placeholder || 'Digite e aperte Enter…';
    var inputState = useState('');
    var input = inputState[0]; var setInput = inputState[1];

    function add() {
      var v = input.trim();
      if (!v) return;
      if (value.indexOf(v) === -1) props.onChange(value.concat([v]));
      setInput('');
    }
    function remove(i) {
      props.onChange(value.filter(function(_, j) { return j !== i; }));
    }
    function onKey(e) {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        add();
      } else if (e.key === 'Backspace' && !input && value.length) {
        remove(value.length - 1);
      }
    }

    return h('div', { className: 'tags-input' },
      value.map(function(t, i) {
        return h('span', { className: 'tag-chip', key: i },
          t,
          h('button', { type: 'button', onClick: function() { remove(i); } }, '×')
        );
      }),
      h('input', {
        type: 'text', value: input, placeholder: placeholder,
        onChange: function(e) { setInput(e.target.value); },
        onKeyDown: onKey,
        onBlur: add
      })
    );
  }

  function ImageUpload(props) {
    var uploadingState = useState(false);
    var uploading = uploadingState[0]; var setUploading = uploadingState[1];
    var modeState = useState('upload');
    var mode = modeState[0]; var setMode = modeState[1];
    var pasta = props.pasta || 'geral';

    function onFile(e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        window.toast('Imagem grande demais (máx 5MB)', 'err');
        return;
      }
      setUploading(true);
      var nome = pasta + '/' + Date.now() + '_' + file.name.replace(/[^a-z0-9.]/gi, '_');
      window.sb.storage.from('imagens').upload(nome, file).then(function(res) {
        setUploading(false);
        if (res.error) {
          window.toast('Erro no upload: ' + res.error.message, 'err');
          return;
        }
        var pub = window.sb.storage.from('imagens').getPublicUrl(nome);
        props.onChange(pub.data.publicUrl);
        window.toast('Imagem enviada', 'ok');
      });
    }

    if (props.value) {
      return h('div', { className: 'dropzone-preview' },
        h('img', { src: props.value, alt: '' }),
        h('div', { className: 'info' },
          'Imagem carregada.',
          h('code', null, props.value)
        ),
        h('button', {
          type: 'button', className: 'btn danger',
          onClick: function() { props.onChange(null); }
        }, 'Remover')
      );
    }

    return h('div', null,
      h('div', { style: { display: 'flex', gap: 6, marginBottom: 12 } },
        h('button', {
          type: 'button',
          className: 'btn' + (mode === 'upload' ? ' primary' : ''),
          onClick: function() { setMode('upload'); },
          style: { fontSize: 13, padding: '6px 12px' }
        }, 'Upload direto'),
        h('button', {
          type: 'button',
          className: 'btn' + (mode === 'link' ? ' primary' : ''),
          onClick: function() { setMode('link'); },
          style: { fontSize: 13, padding: '6px 12px' }
        }, 'URL externa')
      ),

      mode === 'upload' && h('label', { className: 'dropzone', style: DROPZONE_STYLE },
        h('p', null, uploading ? 'Enviando…' : '📷 Clique ou arraste uma imagem'),
        h('p', { className: 'small' }, 'Máx 5MB · JPG, PNG, WebP'),
        h('input', {
          type: 'file', accept: 'image/*',
          onChange: onFile, disabled: uploading
        })
      ),

      mode === 'link' && h('div', null,
        h('input', {
          type: 'url',
          placeholder: 'https://... (URL direta da imagem)',
          defaultValue: '',
          onBlur: function(e) {
            var v = e.target.value.trim();
            if (v) {
              if (!/^https?:\/\//i.test(v)) {
                window.toast('URL inválida. Precisa começar com http:// ou https://', 'err');
                return;
              }
              props.onChange(v);
              window.toast('Imagem adicionada', 'ok');
            }
          },
          style: INPUT_STYLE
        }),
        h('div', { style: { fontSize: 12, color: 'var(--ink-3)', marginTop: 6, background: 'var(--bg)', padding: 10, borderRadius: 6 } },
          '💡 ',
          h('strong', null, 'Dica:'),
          ' Cole a URL direta da imagem (que termina em .jpg, .png, .webp). Se for Drive, use "Compartilhar → Qualquer um com o link". Também aceita imgur, Cloudinary, Instagram, etc.'
        )
      )
    );
  }

  function PDFUpload(props) {
    var uploadingState = useState(false);
    var uploading = uploadingState[0]; var setUploading = uploadingState[1];
    var modeState = useState('upload');
    var mode = modeState[0]; var setMode = modeState[1];
    var pasta = props.pasta || 'geral';

    function onFile(e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      if (file.size > 15 * 1024 * 1024) {
        window.toast('PDF grande demais (máx 15MB). Use link externo (Google Drive).', 'err');
        return;
      }
      setUploading(true);
      var nome = pasta + '/' + Date.now() + '_' + file.name.replace(/[^a-z0-9.]/gi, '_');
      window.sb.storage.from('imagens').upload(nome, file).then(function(res) {
        setUploading(false);
        if (res.error) {
          window.toast('Erro no upload: ' + res.error.message, 'err');
          return;
        }
        var pub = window.sb.storage.from('imagens').getPublicUrl(nome);
        props.onChange(pub.data.publicUrl);
        window.toast('PDF enviado', 'ok');
      });
    }

    return h('div', null,
      h('div', { style: { display: 'flex', gap: 6, marginBottom: 12 } },
        h('button', {
          type: 'button',
          className: 'btn' + (mode === 'upload' ? ' primary' : ''),
          onClick: function() { setMode('upload'); },
          style: { fontSize: 13, padding: '6px 12px' }
        }, 'Upload direto'),
        h('button', {
          type: 'button',
          className: 'btn' + (mode === 'link' ? ' primary' : ''),
          onClick: function() { setMode('link'); },
          style: { fontSize: 13, padding: '6px 12px' }
        }, 'Link externo (Drive)')
      ),
      mode === 'upload' && (
        props.value
          ? h('div', { className: 'dropzone-preview' },
              h('div', { className: 'info' },
                '📄 PDF carregado.',
                h('code', null, props.value)
              ),
              h('a', { className: 'btn', href: props.value, target: '_blank', rel: 'noopener', style: { fontSize: 12 } }, 'Abrir'),
              h('button', {
                type: 'button', className: 'btn danger',
                onClick: function() { props.onChange(null); }
              }, 'Remover')
            )
          : h('label', { className: 'dropzone', style: DROPZONE_STYLE },
              h('p', null, uploading ? 'Enviando…' : '📄 Clique ou arraste um PDF'),
              h('p', { className: 'small' }, 'Máx 15MB · Acima disso, use link externo'),
              h('input', {
                type: 'file', accept: 'application/pdf',
                onChange: onFile, disabled: uploading
              })
            )
      ),
      mode === 'link' && h('div', null,
        h('input', {
          type: 'url',
          placeholder: 'https://drive.google.com/file/d/…/view',
          value: props.value || '',
          onChange: function(e) { props.onChange(e.target.value || null); },
          style: INPUT_STYLE
        }),
        h('div', { style: { fontSize: 12, color: 'var(--ink-3)', marginTop: 6 } },
          'Cole a URL de compartilhamento. Para produções, precisa estar com permissão "Qualquer um com o link". Para notícias, o PDF é embutido diretamente na página.'
        )
      )
    );
  }

  function GalleryUpload(props) {
    var value = props.value || [];
    var pasta = props.pasta || 'galeria';
    var uploadingState = useState(0);
    var uploadingCount = uploadingState[0]; var setUploadingCount = uploadingState[1];
    var modeState = useState('upload');
    var mode = modeState[0]; var setMode = modeState[1];
    var novoUrlState = useState('');
    var novoUrl = novoUrlState[0]; var setNovoUrl = novoUrlState[1];

    function onFiles(e) {
      var files = Array.from(e.target.files || []);
      if (files.length === 0) return;
      var tooBig = files.filter(function(f) { return f.size > 5 * 1024 * 1024; });
      if (tooBig.length > 0) {
        window.toast('Algumas imagens são > 5MB. Reduza antes de subir.', 'err');
        return;
      }
      setUploadingCount(files.length);
      var novasUrls = [];
      function subirProxima(index) {
        if (index >= files.length) {
          setUploadingCount(0);
          props.onChange(value.concat(novasUrls));
          window.toast(novasUrls.length + ' foto(s) enviadas', 'ok');
          return;
        }
        var file = files[index];
        var nome = pasta + '/' + Date.now() + '_' + index + '_' + file.name.replace(/[^a-z0-9.]/gi, '_');
        window.sb.storage.from('imagens').upload(nome, file).then(function(res) {
          if (res.error) {
            window.toast('Erro na foto ' + (index + 1) + ': ' + res.error.message, 'err');
          } else {
            var pub = window.sb.storage.from('imagens').getPublicUrl(nome);
            novasUrls.push(pub.data.publicUrl);
          }
          subirProxima(index + 1);
        });
      }
      subirProxima(0);
    }

    function adicionarUrl() {
      var url = novoUrl.trim();
      if (!url) return;
      if (!/^https?:\/\//i.test(url)) {
        window.toast('URL inválida. Precisa começar com http:// ou https://', 'err');
        return;
      }
      props.onChange(value.concat([url]));
      setNovoUrl('');
      window.toast('Foto adicionada', 'ok');
    }

    function removerFoto(idx) {
      var novo = value.filter(function(_, i) { return i !== idx; });
      props.onChange(novo);
    }

    function moverFoto(idx, direcao) {
      var novo = value.slice();
      var novaPos = idx + direcao;
      if (novaPos < 0 || novaPos >= novo.length) return;
      var tmp = novo[idx];
      novo[idx] = novo[novaPos];
      novo[novaPos] = tmp;
      props.onChange(novo);
    }

    return h('div', null,
      value.length > 0 && h('div', { className: 'gallery-grid' },
        value.map(function(url, idx) {
          return h('div', { key: idx, className: 'gallery-item' },
            h('img', { src: url, alt: '', loading: 'lazy' }),
            h('div', { className: 'gallery-item-actions' },
              h('button', {
                type: 'button', className: 'gallery-btn',
                onClick: function() { moverFoto(idx, -1); },
                disabled: idx === 0, title: 'Mover pra esquerda'
              }, '←'),
              h('span', { className: 'gallery-pos' }, idx + 1),
              h('button', {
                type: 'button', className: 'gallery-btn',
                onClick: function() { moverFoto(idx, 1); },
                disabled: idx === value.length - 1, title: 'Mover pra direita'
              }, '→'),
              h('button', {
                type: 'button', className: 'gallery-btn danger',
                onClick: function() { removerFoto(idx); }, title: 'Remover'
              }, '×')
            )
          );
        })
      ),
      h('div', { style: { display: 'flex', gap: 6, marginTop: value.length > 0 ? 12 : 0, marginBottom: 10 } },
        h('button', {
          type: 'button',
          className: 'btn' + (mode === 'upload' ? ' primary' : ''),
          onClick: function() { setMode('upload'); },
          style: { fontSize: 13, padding: '6px 12px' }
        }, 'Upload direto'),
        h('button', {
          type: 'button',
          className: 'btn' + (mode === 'link' ? ' primary' : ''),
          onClick: function() { setMode('link'); },
          style: { fontSize: 13, padding: '6px 12px' }
        }, 'Adicionar por URL')
      ),
      mode === 'upload' && h('label', { className: 'dropzone', style: DROPZONE_STYLE },
        h('p', null,
          uploadingCount > 0
            ? 'Enviando ' + uploadingCount + ' foto(s)…'
            : (value.length > 0 ? '+ Adicionar mais fotos' : '📸 Escolher fotos (múltiplas)')
        ),
        h('p', { className: 'small' }, 'Selecione várias de uma vez. Máx 5MB por foto.'),
        h('input', {
          type: 'file', accept: 'image/*', multiple: true,
          onChange: onFiles, disabled: uploadingCount > 0
        })
      ),
      mode === 'link' && h('div', null,
        h('div', { style: { display: 'flex', gap: 8 } },
          h('input', {
            type: 'url',
            placeholder: 'https://... (Drive, Instagram, imgur, etc)',
            value: novoUrl,
            onChange: function(e) { setNovoUrl(e.target.value); },
            onKeyDown: function(e) { if (e.key === 'Enter') { e.preventDefault(); adicionarUrl(); } },
            style: Object.assign({}, INPUT_STYLE, { flex: 1 })
          }),
          h('button', {
            type: 'button', className: 'btn primary', onClick: adicionarUrl,
            style: { padding: '10px 16px' }
          }, '+ Adicionar')
        ),
        h('div', { style: { fontSize: 12, color: 'var(--ink-3)', marginTop: 6, background: 'var(--bg)', padding: 10, borderRadius: 6 } },
          '💡 Cole uma URL por vez e clique + Adicionar (ou Enter). Aceita Drive, Instagram, imgur, Cloudinary, etc.'
        )
      )
    );
  }

  // ═════════════════════════
  // AdminTopbar 
  // ═══════════════════════════
  function AdminTopbar(props) {
    var user = props.user;
    var current = props.current;

    var items = [
      { k: 'dashboard', label: 'Dashboard', href: 'dashboard.html' },
      { k: 'producoes', label: 'Produções', href: 'producoes.html' },
      { k: 'noticias',  label: 'Notícias',  href: 'noticias.html' },
      { k: 'eventos',   label: 'Eventos',   href: 'eventos.html' },
      { k: 'membros',   label: 'Membros',   href: 'membros.html' }
    ];

    function logout() {
      window.sb.auth.signOut().then(function() {
        window.location.href = 'index.html';
      });
    }

    return h('div', { className: 'topbar' },
      h('div', { className: 'brand' }, 'CAEF ', h('span', null, 'Admin')),
      h('nav', null,
        items.map(function(it) {
          return h('a', {
            key: it.k, href: it.href,
            className: current === it.k ? 'active' : ''
          }, it.label);
        })
      ),
      h('div', { className: 'user' },
        h('a', {
          href: '../index.html', target: '_blank', rel: 'noopener',
          className: 'btn-view-site',
          title: 'Ver o site público em nova aba'
        }, '↗ Ver site'),
        h('span', null, user.email),
        h('button', { onClick: logout }, 'Sair')
      )
    );
  }

  function SearchBar(props) {
    var itemLabel = props.itemLabel || { singular: 'item', plural: 'itens' };
    var label = props.filtered === 1 ? itemLabel.singular : itemLabel.plural;
    return h('div', { className: 'admin-searchbar' },
      h('div', { className: 'admin-searchbar-input' },
        h('span', { className: 'search-icon' }, '🔍'),
        h('input', {
          type: 'search', value: props.value,
          onChange: function(e) { props.onChange(e.target.value); },
          placeholder: props.placeholder || 'Buscar…'
        }),
        props.value && h('button', {
          type: 'button', className: 'search-clear',
          onClick: function() { props.onChange(''); }, title: 'Limpar busca'
        }, '×')
      ),
      h('div', { className: 'admin-searchbar-count' },
        props.value
          ? props.filtered + ' de ' + props.total + ' ' + label
          : props.total + ' ' + label
      )
    );
  }

  function filtrarPorBusca(rows, busca, campos) {
    if (!busca || !busca.trim()) return rows;
    var b = busca.toLowerCase().trim();
    return rows.filter(function(r) {
      return campos.some(function(c) {
        var v = r[c];
        if (!v) return false;
        return String(v).toLowerCase().indexOf(b) !== -1;
      });
    });
  }

  function ensureToastWrap() {
    var wrap = document.querySelector('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    return wrap;
  }

  window.toast = function(msg, tipo) {
    var wrap = ensureToastWrap();
    var el = document.createElement('div');
    el.className = 'toast ' + (tipo || '');
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(function() {
      el.style.transition = 'opacity 0.3s ease';
      el.style.opacity = '0';
      setTimeout(function() { el.remove(); }, 300);
    }, 3200);
  };

  window.fmtDateBR = function(iso) {
    if (!iso) return '';
    var d = new Date(iso.length === 10 ? iso + 'T12:00:00' : iso);
    return String(d.getDate()).padStart(2, '0') + '/' +
      String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
  };

  window.Field = Field;
  window.TagsInput = TagsInput;
  window.ImageUpload = ImageUpload;
  window.PDFUpload = PDFUpload;
  window.GalleryUpload = GalleryUpload;
  window.AdminTopbar = AdminTopbar;
  window.SearchBar = SearchBar;
  window.filtrarPorBusca = filtrarPorBusca;
})();
