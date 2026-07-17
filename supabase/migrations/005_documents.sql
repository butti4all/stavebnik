-- 005_documents.sql
-- Create documents table for project documents and files metadata

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  document_type text not null,
  issue_date date not null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_documents_project_id on public.documents (project_id);
create index if not exists idx_documents_issue_date on public.documents (issue_date desc);
create index if not exists idx_documents_name on public.documents (name);

create or replace function public.set_document_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_documents_set_updated_at
before update on public.documents
for each row
execute function public.set_document_updated_at();
