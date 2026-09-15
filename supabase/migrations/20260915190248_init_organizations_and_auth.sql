-- Single-tenant auth foundation: everyone who signs in with a
-- @hellofieldtrip.com Google account gets a profile. There is no
-- multi-org or role concept yet; add those back if/when the product
-- needs to support more than one company or differentiated permissions.

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- On new auth.users insert, create a profile only if the email domain
-- matches the company's Google Workspace domain. Anyone outside that
-- domain gets an auth.users row but no profile, so they have no access.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if split_part(new.email, '@', 2) = 'hellofieldtrip.com' then
    insert into public.profiles (id, email, full_name, avatar_url)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'avatar_url'
    );
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS

alter table profiles enable row level security;

create policy "any signed-in profile can read all profiles"
  on profiles for select
  to authenticated
  using (true);

create policy "users can update their own profile"
  on profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
