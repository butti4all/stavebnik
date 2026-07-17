-- 002_expenses.sql
-- Create expenses table for project spending

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  amount numeric not null,
  expense_date date not null,
  supplier_name text,
  short_note text,
  long_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_expenses_project_id on public.expenses (project_id);
create index if not exists idx_expenses_expense_date on public.expenses (expense_date desc);
create index if not exists idx_expenses_name on public.expenses (name);

create or replace function public.set_expense_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_expenses_set_updated_at
before update on public.expenses
for each row
execute function public.set_expense_updated_at();
