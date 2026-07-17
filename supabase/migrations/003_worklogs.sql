-- 003_worklogs.sql
-- Create work logs table for labor tracking

create table if not exists public.work_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  worker_name text not null,
  work_date date not null,
  hours numeric(8,2) not null,
  hourly_rate numeric(12,2) not null,
  total_amount numeric(12,2) generated always as (hours * hourly_rate) stored,
  short_note text,
  long_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_work_logs_project_id on public.work_logs (project_id);
create index if not exists idx_work_logs_work_date on public.work_logs (work_date desc);
create index if not exists idx_work_logs_worker_name on public.work_logs (worker_name);

create or replace function public.set_work_log_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_work_logs_set_updated_at
before update on public.work_logs
for each row
execute function public.set_work_log_updated_at();
