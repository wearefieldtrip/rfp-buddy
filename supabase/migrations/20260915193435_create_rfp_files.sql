-- Reference files: links to RFP source documents already stored in
-- Google Drive. The app never uploads to or reads from Drive directly
-- here; it just stores a link a user pastes in for reference. Actual
-- Drive API integration (browsing, uploading, parsing) is a later phase.

create table rfp_files (
  id uuid primary key default gen_random_uuid(),
  rfp_id uuid not null references rfps (id) on delete cascade,
  drive_url text not null,
  file_name text not null,
  added_by uuid not null references profiles (id),
  created_at timestamptz not null default now()
);

alter table rfp_files enable row level security;

create policy "any signed-in profile can read rfp files"
  on rfp_files for select
  to authenticated
  using (true);

create policy "any signed-in profile can add rfp files"
  on rfp_files for insert
  to authenticated
  with check (added_by = auth.uid());

create policy "any signed-in profile can delete rfp files"
  on rfp_files for delete
  to authenticated
  using (true);
