-- 006_suppliers.sql
-- Create suppliers table for project suppliers and service providers

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_id text,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_suppliers_name on public.suppliers (name);
create index if not exists idx_suppliers_company_id on public.suppliers (company_id);
create index if not exists idx_suppliers_email on public.suppliers (email);

create or replace function public.set_supplier_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_suppliers_set_updated_at
before update on public.suppliers
for each row
execute function public.set_supplier_updated_at();
