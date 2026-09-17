-- Clarification questions: AI drafts questions to ask the issuing
-- organization before a proposal is submitted. Per CLAUDE.md, AI may
-- draft these but a human must review and actually send them — this
-- table/column only stores the draft, nothing gets sent from here.
create type questions_status as enum ('not_generated', 'generating', 'completed', 'failed');

alter table rfps add column questions_status questions_status not null default 'not_generated';
alter table rfps add column questions_result jsonb;
alter table rfps add column questions_generated_at timestamptz;
alter table rfps add column questions_error text;
