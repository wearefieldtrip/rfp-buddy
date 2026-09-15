-- Rename buyer -> organization_name, drop rfp_number, add work_types.

alter table rfps rename column buyer to organization_name;

alter table rfps drop column rfp_number;

create type work_type as enum ('campaign', 'branding', 'web', 'other');

alter table rfps add column work_types work_type[] not null default '{}';
