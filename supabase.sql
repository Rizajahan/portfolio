-- Run once in Supabase → SQL Editor
create table contacts (id bigint generated always as identity primary key, created_at timestamptz default now(),
  name text not null, email text not null, message text not null, source text, ip_hash text);
create table chat_messages (id bigint generated always as identity primary key, created_at timestamptz default now(),
  session_id text, question text, answer text, ip_hash text);
create table visits (id bigint generated always as identity primary key, created_at timestamptz default now(),
  session_id text, path text, referrer text, user_agent text, ip_hash text);
create index on contacts (ip_hash, created_at);
create index on chat_messages (ip_hash, created_at);
-- SECURITY: RLS on + NO policies = the public/anon key can read or write NOTHING.
-- Only your server functions (service key) can touch these tables.
alter table contacts enable row level security;
alter table chat_messages enable row level security;
alter table visits enable row level security;
