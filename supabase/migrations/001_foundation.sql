-- 001_foundation.sql
-- Create projects table with basic foundation fields

create extension if not exists "uuid-ossp";

create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_created_at on public.projects (created_at desc);
create index if not exists idx_projects_updated_at on public.projects (updated_at desc);
create index if not exists idx_projects_name on public.projects (name);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();
