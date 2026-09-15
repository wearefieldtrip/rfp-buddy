-- RFP records: the first vertical slice of the pursuit workflow.
-- No requirements/tasks/decisions yet, just the core record.

create extension if not exists moddatetime schema extensions;

create type rfp_status as enum ('new', 'pursuing', 'submitted', 'won', 'lost', 'no_go');

create table rfps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  buyer text not null,
  rfp_number text,
  due_date date,
  owner_id uuid references profiles (id),
  status rfp_status not null default 'new',
  created_by uuid not null references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_rfps_updated_at
  before update on rfps
  for each row execute function extensions.moddatetime(updated_at);

alter table rfps enable row level security;

create policy "any signed-in profile can read rfps"
  on rfps for select
  to authenticated
  using (true);

create policy "any signed-in profile can create rfps"
  on rfps for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "any signed-in profile can update rfps"
  on rfps for update
  to authenticated
  using (true)
  with check (true);
