-- 004_diary.sql
-- Create diary entries table for construction notes

create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  entry_date date not null,
  weather text,
  short_note text,
  long_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_diary_entries_project_id on public.diary_entries (project_id);
create index if not exists idx_diary_entries_entry_date on public.diary_entries (entry_date desc);
create index if not exists idx_diary_entries_title on public.diary_entries (title);

create or replace function public.set_diary_entry_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_diary_entries_set_updated_at
before update on public.diary_entries
for each row
execute function public.set_diary_entry_updated_at();
