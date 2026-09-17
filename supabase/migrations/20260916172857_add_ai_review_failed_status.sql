-- Real scoring (Drive fetch + Perplexity) can fail for reasons a user
-- needs to see and retry from: unsupported file type, no Drive access,
-- Perplexity/schema errors. Add a failed status and an error message
-- column instead of leaving the row stuck on "scoring" forever.
alter type ai_review_status add value 'failed';
alter table rfps add column ai_review_error text;
