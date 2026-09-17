-- No delete policy existed yet for rfps. Matches the existing
-- single-tenant "any signed-in profile" pattern used for select/update.
create policy "any signed-in profile can delete rfps"
  on rfps for delete
  to authenticated
  using (true);
