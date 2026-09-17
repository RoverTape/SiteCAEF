# Deploy no Cloudflare Pages

Painel: **Workers & Pages -> Create -> Pages -> Connect to Git**.

| Campo | Valor |
|---|---|
| Production branch | `main` |
| Root directory | _(raiz)_ |
| Build command | _(nenhum)_ |
| Build output directory | `/` _(a propria raiz)_ |

## Observacoes

- Site estatico servido da raiz do repo, sem build. Nao havia redirects nem
  headers no `netlify.toml`, entao nao ha nada a converter.

O `netlify.toml` foi mantido de proposito. O Cloudflare Pages nao le esse
arquivo, entao ele nao atrapalha; e ele mantem o site funcionando no Netlify
ate o DNS ser apontado para o Cloudflare, o que permite voltar atras.
As regras que precisavam valer no Cloudflare foram reescritas em `_headers` /
`_redirects`, que as duas plataformas leem.

