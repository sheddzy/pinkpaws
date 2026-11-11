-- Pink Paws Groomers: run once in the Supabase SQL editor.
create extension if not exists pgcrypto;

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  ref_no bigint generated always as identity,
  submission_key uuid not null unique,
  kind text not null default 'enquiry' check (kind in ('enquiry','consultation')),
  name text not null,
  business_name text,
  email text not null,
  phone text not null,
  service text not null,
  subject text not null,
  message text not null,
  preferred_contact text not null,
  preferred_time text,
  status text not null default 'New' check (status in ('New','Contacted','In Progress','Completed','Closed')),
  internal_notes text,
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists enquiries_created_idx on enquiries (created_at desc);
create index if not exists enquiries_ip_idx on enquiries (ip_hash, created_at);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references enquiries(id) on delete cascade,
  channel text not null check (channel in ('email','whatsapp')),
  status text not null check (status in ('sent','failed','skipped')),
  provider_ref text,
  error text,
  attempts int not null default 0,
  updated_at timestamptz not null default now(),
  unique (enquiry_id, channel)
);

create table if not exists settings (key text primary key, value text);
create table if not exists site_content (key text primary key, value text);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null default '',
  category_id uuid references categories(id) on delete set null,
  featured_image_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text
);

-- Row level security: no public policies except published content.
-- The server uses the service role key, which bypasses RLS.
alter table enquiries enable row level security;
alter table notifications enable row level security;
alter table settings enable row level security;
alter table admins enable row level security;
alter table site_content enable row level security;
alter table categories enable row level security;
alter table articles enable row level security;
create policy "public read site content" on site_content for select using (true);
create policy "public read categories" on categories for select using (true);
create policy "public read published articles" on articles for select using (status = 'published');

insert into storage.buckets (id, name, public) values ('article-images','article-images', true) on conflict do nothing;

insert into categories (name, slug) values
 ('Business Development','business-development'),
 ('Customer Experience','customer-experience'),
 ('Leadership and People Development','leadership-and-people-development'),
 ('Strategy and Sustainability','strategy-and-sustainability'),
 ('Business and NGO Start-up','business-and-ngo-start-up')
on conflict do nothing;

insert into settings (key, value) values ('email_enabled','true'),('wa_enabled','true') on conflict do nothing;

-- After creating your admin user in Authentication > Users, authorise them:
-- insert into admins (user_id, email) select id, email from auth.users where email = 'you@example.com';
