-- No longer asking for a display name on attach; the UI shows a
-- generic "RFP Document" label and links straight to the Drive URL.
alter table rfps drop column document_file_name;
