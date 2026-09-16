-- Replace the rfp_files list with a single attached RFP document per RFP,
-- plus AI review state for the "Score" action. The AI review result is
-- jsonb so we can flesh out its shape (category scores, risks, summary)
-- once the real judging criteria are defined, without another migration
-- for the dummy-data version being wired up now.

alter table rfps add column document_drive_url text;
alter table rfps add column document_file_name text;
alter table rfps add column document_attached_by uuid references profiles (id);
alter table rfps add column document_attached_at timestamptz;

create type ai_review_status as enum ('not_scored', 'scoring', 'completed');

alter table rfps add column ai_review_status ai_review_status not null default 'not_scored';
alter table rfps add column ai_review_result jsonb;
alter table rfps add column ai_review_scored_at timestamptz;

-- Backfill from the most recently added rfp_files row per RFP, then drop it.
update rfps r
set
  document_drive_url = f.drive_url,
  document_file_name = f.file_name,
  document_attached_by = f.added_by,
  document_attached_at = f.created_at
from (
  select distinct on (rfp_id) rfp_id, drive_url, file_name, added_by, created_at
  from rfp_files
  order by rfp_id, created_at desc
) f
where r.id = f.rfp_id;

drop table rfp_files;
