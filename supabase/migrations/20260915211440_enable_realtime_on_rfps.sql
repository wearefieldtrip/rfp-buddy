-- Lets the frontend subscribe to changes on rfps (used to detect when the
-- score-rfp edge function finishes, without polling).
alter publication supabase_realtime add table rfps;
