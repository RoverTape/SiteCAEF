-- ============================================================
-- AJUSTES NO SCHEMA EXISTENTE DO CAEF
-- Roda apenas 1 vez. Idempotente onde possível.
-- ============================================================

-- ─── 1. Expande ENUM tipo_producao para todos os formatos do site ──
-- (Os valores 'tcc' e 'iniciacao_cientifica' já existem)
alter type public.tipo_producao add value if not exists 'monografia';
alter type public.tipo_producao add value if not exists 'artigo';
alter type public.tipo_producao add value if not exists 'dissertacao';

-- ─── 2. Adiciona campo de link de inscrição em eventos ──
alter table public.evento
  add column if not exists link_inscricao text;

-- ─── 3. Cria tabela 'membros' (não existia) ──
create table if not exists public.membros (
  id_membro   uuid primary key default gen_random_uuid(),
  id_adm      uuid references public.admin(id_adm) on delete set null,
  nome        varchar not null,
  cargo       varchar not null,
  inicial     varchar(2) not null,
  email       varchar,
  foto_url    text,
  posicao     integer not null default 0,
  ativo       boolean not null default true,
  criado_em   timestamptz not null default now()
);
create index if not exists membros_posicao_idx on public.membros (posicao);

-- ─── 4. Habilita RLS em todas as tabelas do site ─────────────
alter table public.producoes        enable row level security;
alter table public.autores_producao enable row level security;
alter table public.evento           enable row level security;
alter table public.atividades       enable row level security;
alter table public.noticias         enable row level security;
alter table public.membros          enable row level security;

-- Remove policies anteriores (se existirem) para evitar duplicação
drop policy if exists "public read producoes"        on public.producoes;
drop policy if exists "public read autores_producao" on public.autores_producao;
drop policy if exists "public read evento"           on public.evento;
drop policy if exists "public read atividades"       on public.atividades;
drop policy if exists "public read noticias"         on public.noticias;
drop policy if exists "public read membros"          on public.membros;
drop policy if exists "auth write producoes"         on public.producoes;
drop policy if exists "auth write autores_producao"  on public.autores_producao;
drop policy if exists "auth write evento"            on public.evento;
drop policy if exists "auth write atividades"        on public.atividades;
drop policy if exists "auth write noticias"          on public.noticias;
drop policy if exists "auth write membros"           on public.membros;

-- Leitura pública (visitantes do site)
create policy "public read producoes" on public.producoes
  for select using (publicado = true);
create policy "public read autores_producao" on public.autores_producao
  for select using (true);
create policy "public read evento" on public.evento
  for select using (ativo = true);
create policy "public read atividades" on public.atividades
  for select using (ativo = true);
create policy "public read noticias" on public.noticias
  for select using (true);
create policy "public read membros" on public.membros
  for select using (ativo = true);

-- Escrita: apenas usuários autenticados (no Auth do Supabase)
create policy "auth write producoes" on public.producoes
  for all to authenticated using (true) with check (true);
create policy "auth write autores_producao" on public.autores_producao
  for all to authenticated using (true) with check (true);
create policy "auth write evento" on public.evento
  for all to authenticated using (true) with check (true);
create policy "auth write atividades" on public.atividades
  for all to authenticated using (true) with check (true);
create policy "auth write noticias" on public.noticias
  for all to authenticated using (true) with check (true);
create policy "auth write membros" on public.membros
  for all to authenticated using (true) with check (true);

-- ─── 5. Storage: cria bucket de imagens públicas ─────────────
-- (Execute via SQL ou pelo dashboard: Storage → New bucket → "imagens" → Public)
insert into storage.buckets (id, name, public)
values ('imagens', 'imagens', true)
on conflict (id) do nothing;

-- Policy de Storage: qualquer autenticado pode fazer upload no bucket 'imagens'
drop policy if exists "auth upload imagens"  on storage.objects;
drop policy if exists "public read imagens"  on storage.objects;
drop policy if exists "auth delete imagens"  on storage.objects;

create policy "auth upload imagens" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'imagens');

create policy "public read imagens" on storage.objects
  for select using (bucket_id = 'imagens');

create policy "auth delete imagens" on storage.objects
  for delete to authenticated
  using (bucket_id = 'imagens');

-- ─── 6. Seed: membros iniciais (do data.jsx atual) ──────────
insert into public.membros (nome, cargo, inicial, posicao) values
  ('Beatriz Almeida',   'Presidência',      'B', 1),
  ('Rafael Mendes',     'Vice-Presidência', 'R', 2),
  ('Isabela Costa',     'Acadêmico',        'I', 3),
  ('Lucas Pereira',     'Pesquisa',         'L', 4),
  ('Marina Oliveira',   'Eventos',          'M', 5),
  ('Pedro Tavares',     'Comunicação',      'P', 6),
  ('Carolina Souza',    'Newsletter',       'C', 7),
  ('Felipe Ramos',      'Indicadores',      'F', 8)
on conflict do nothing;
