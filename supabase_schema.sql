-- ENGINEER YASIN MULTI-RESOURCE PORTAL DATABASE SCHEMA
-- Drops old tables and sets up items, custom_pages, profiles, orders, order_items, and purchases.

-- CLEAN RESET (Drops existing tables for clean upgrade)
drop table if exists public.purchases cascade;
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.books cascade;
drop table if exists public.items cascade;
drop table if exists public.profiles cascade;
drop table if exists public.custom_pages cascade;

-- 1. PROFILES TABLE (linked to Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  name text,
  is_admin boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles Policies
drop policy if exists "Allow public read for profiles" on public.profiles;
drop policy if exists "Allow individual update" on public.profiles;
create policy "Allow public read for profiles" on public.profiles for select using (true);
create policy "Allow individual update" on public.profiles for update using (auth.uid() = id);

-- Trigger function to create profile row upon signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    case 
      when new.email = 'engineer.yasin.books@gmail.com' or new.email = 'yasin.jr@gmail.com' or new.email = 'admin@engineeryasin.com' then true 
      else false 
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. UNIFIED ITEMS TABLE (Books, Scholarships, Jobs, Softwares, Services, Courses)
create table if not exists public.items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null, -- Stores author, provider, company, or university
  description text,
  cover_url text, -- Cover image URL
  category text not null, -- Subcategories (e.g. 'Government Jobs', 'MATLAB & Simulink', etc.)
  resource_type text not null check (resource_type in ('book', 'scholarship', 'job', 'software', 'service', 'course')),
  type text not null check (type in ('free', 'premium')),
  price numeric(10, 2) default 0.00,
  file_path text not null, -- Stores download file path or external web URLs
  download_count integer default 0,
  created_at timestamp with time zone default now()
);

-- Enable RLS on items
alter table public.items enable row level security;

-- Items Policies
drop policy if exists "Allow public read for items" on public.items;
drop policy if exists "Allow admin write for items" on public.items;
create policy "Allow public read for items" on public.items for select using (true);
create policy "Allow admin write for items" on public.items for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);


-- 3. CUSTOM PAGES TABLE (Disclaimer, Terms, About, etc. managed by Admin)
create table if not exists public.custom_pages (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  content text not null, -- Markdown or plain text content
  created_at timestamp with time zone default now()
);

-- Enable RLS on custom pages
alter table public.custom_pages enable row level security;

-- Custom Pages Policies
drop policy if exists "Allow public read for custom_pages" on public.custom_pages;
drop policy if exists "Allow admin write for custom_pages" on public.custom_pages;
create policy "Allow public read for custom_pages" on public.custom_pages for select using (true);
create policy "Allow admin write for custom_pages" on public.custom_pages for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);


-- 4. ORDERS TABLE (Manual Payment Verification)
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  total_price numeric(10, 2) default 0.00,
  status text not null default 'pending_payment' check (status in ('pending_payment', 'payment_submitted', 'verified', 'rejected')),
  payment_method text,
  transaction_ref text,
  proof_image_url text, -- Receipt screenshot upload path
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Orders Policies
drop policy if exists "Allow users to read their own orders" on public.orders;
drop policy if exists "Allow users to insert their own orders" on public.orders;
drop policy if exists "Allow admin update for orders" on public.orders;
create policy "Allow users to read their own orders" on public.orders for select using (
  auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Allow users to insert their own orders" on public.orders for insert with check (
  auth.uid() = user_id
);
create policy "Allow admin update for orders" on public.orders for update using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);


-- 5. ORDER ITEMS TABLE
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  item_id uuid references public.items(id) on delete cascade not null,
  price numeric(10, 2) not null
);

-- Enable RLS on order_items
alter table public.order_items enable row level security;

-- Order Items Policies
drop policy if exists "Allow users to read their own order items" on public.order_items;
drop policy if exists "Allow users to insert order items" on public.order_items;
create policy "Allow users to read their own order items" on public.order_items for select using (
  exists (
    select 1 from public.orders 
    where id = order_items.order_id 
    and (orders.user_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  )
);
create policy "Allow users to insert order items" on public.order_items for insert with check (
  exists (
    select 1 from public.orders 
    where id = order_items.order_id 
    and orders.user_id = auth.uid()
  )
);


-- 6. PURCHASES TABLE (Permanent library downloads unlock)
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  item_id uuid references public.items(id) on delete cascade not null,
  order_id uuid references public.orders(id) on delete set null,
  created_at timestamp with time zone default now(),
  unique (user_id, item_id)
);

-- Enable RLS on purchases
alter table public.purchases enable row level security;

-- Purchases Policies
drop policy if exists "Allow users to read their own purchases" on public.purchases;
drop policy if exists "Allow admin write for purchases" on public.purchases;
create policy "Allow users to read their own purchases" on public.purchases for select using (
  auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Allow admin write for purchases" on public.purchases for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);


-- 7. STORAGE BUCKETS SETUP
insert into storage.buckets (id, name, public) values ('book-covers', 'book-covers', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('payment-proofs', 'payment-proofs', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('free-books', 'free-books', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('premium-books', 'premium-books', false) on conflict (id) do nothing;

-- Storage Policies DDL
drop policy if exists "Allow public read for book-covers" on storage.objects;
drop policy if exists "Allow admin write for book-covers" on storage.objects;
drop policy if exists "Allow users to upload payment proofs" on storage.objects;
drop policy if exists "Allow users and admin to read payment proofs" on storage.objects;
drop policy if exists "Allow public read for free-books" on storage.objects;
drop policy if exists "Allow admin write for free-books" on storage.objects;
drop policy if exists "Allow admin write for premium-books" on storage.objects;

create policy "Allow public read for book-covers" on storage.objects for select using (bucket_id = 'book-covers');
create policy "Allow admin write for book-covers" on storage.objects for insert with check (
  bucket_id = 'book-covers' and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Allow users to upload payment proofs" on storage.objects for insert with check (
  bucket_id = 'payment-proofs' and auth.role() = 'authenticated'
);
create policy "Allow users and admin to read payment proofs" on storage.objects for select using (
  bucket_id = 'payment-proofs' and (auth.uid()::text = (storage.foldername(name))[1] or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
);
create policy "Allow public read for free-books" on storage.objects for select using (bucket_id = 'free-books');
create policy "Allow admin write for free-books" on storage.objects for insert with check (
  bucket_id = 'free-books' and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Allow admin write for premium-books" on storage.objects for insert with check (
  bucket_id = 'premium-books' and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);


-- 8. SEED DATA

-- A. Default Custom Pages
insert into public.custom_pages (slug, title, content) values
('disclaimer', 'Disclaimer', 'The information and files shared on Engineer Yasin are compiled for educational purposes only. We do not host copyrighted software files directly or claim ownership of public listings.'),
('terms', 'Terms & Conditions', 'By accessing this portal, you agree to comply with standard academic integrity rules. Manual payments are verified within 1-12 hours, and download links will be made available inside your Library panel.'),
('privacy', 'Privacy Policy', 'We collect and process your email and uploaded payment reference screenshots solely to manage your access codes and transaction approvals. We never share user database lists with third parties.')
on conflict (slug) do nothing;

-- B. Mock Items Catalog
insert into public.items (title, author, description, category, resource_type, type, price, file_path) values
-- Books
('Fundamentals of Calculus', 'Dr. Alice Carter', 'Introductory calculus handbook.', 'Academic Books', 'book', 'free', 0.00, 'free/calculus.pdf'),
('Advanced Electromagnetism', 'Prof. John Vance', 'Advanced field equations and Maxwell theory.', 'Academic Books', 'book', 'premium', 800.00, 'premium/magnetism.pdf'),
('JavaScript Basics for Beginners', 'Devon Cole', 'Introductory JS tutorial.', 'Programming Books', 'book', 'free', 0.00, 'free/javascript.pdf'),
('Design Patterns in TypeScript', 'Martin Fowler Jr.', 'Contemporary TypeScript patterns.', 'Programming Books', 'book', 'premium', 1200.00, 'premium/patterns.pdf'),

-- Scholarships (resource_type = 'scholarship', price_type = 'free', price = 0)
('HEC Overseas Scholarship 2026', 'Higher Education Commission', 'Fully funded PhD and Master scholarships in top global universities.', 'Graduate (Master''s)', 'scholarship', 'free', 0.00, 'https://www.hec.gov.pk/english/scholarships/Pages/default.aspx'),
('Fulbright Scholarship Program', 'USEFP Pakistan', 'Fully funded Master''s and PhD study in the United States.', 'Graduate (Master''s)', 'scholarship', 'free', 0.00, 'https://usefp.org/scholarships/fulbright.cfm'),
('DAAD Germany Scholarships', 'German Academic Exchange', 'Postgraduate scholarships for developing countries in Germany.', 'PhD & Research', 'scholarship', 'free', 0.00, 'https://www.daad.de/en/'),
('Chevening Scholarship UK', 'UK Government', 'Fully funded master degree fellowships in United Kingdom.', 'Graduate (Master''s)', 'scholarship', 'free', 0.00, 'https://www.chevening.org/'),

-- Jobs (resource_type = 'job', price_type = 'free', price = 0)
('Assistant Director (Engg)', 'Federal Public Service Commission', 'AD Technical openings in government ministries (Civil, Electrical, Mechanical).', 'Government Jobs', 'job', 'free', 0.00, 'https://www.fpsc.gov.pk/'),
('Senior React Developer', 'Systems Limited', 'Develop frontend applications with Next.js, Redux, and TailwindCSS.', 'Private Jobs', 'job', 'free', 0.00, 'https://www.systemsltd.com/careers'),
('Engineering Intern 2026', 'National Transmission & Despatch Co.', 'Hands-on training in grid stations and power transmission systems.', 'Internships', 'job', 'free', 0.00, 'https://ntdc.gov.pk/careers'),

-- Software
('MATLAB 2026a (with Toolboxes)', 'MathWorks', 'Full engineering simulation and computation suite.', 'Download Software', 'software', 'premium', 2500.00, 'premium/matlab_2026a.zip'),
('AutoCAD 2026 Student Edition', 'Autodesk', '2D and 3D computer-aided design software tools.', 'Download Software', 'software', 'free', 0.00, 'https://www.autodesk.com/education/free-software/autocad'),
('SolidWorks 2025 Premium', 'Dassault Systèmes', 'Mechanical design simulation and modeling engine.', 'Download Software', 'software', 'premium', 3000.00, 'premium/solidworks_2025.zip'),

-- Services
('Full-Stack Web App Development', 'Yasin Coding Tech', 'Build Next.js web applications tailored to your project requirements.', 'Programming', 'service', 'premium', 5000.00, 'services/programming_consult.pdf'),
('3D Mechanical Part Designing', 'Yasin CAD Lab', 'SolidWorks 3D modeling, assembly, and product rendering.', '3D Modeling', 'service', 'premium', 4000.00, 'services/cad_consult.pdf'),
('MATLAB Simulation & Scripting', 'Yasin Math Solutions', 'Custom Simulink circuit analysis and algorithm implementation.', 'MATLAB & Simulink', 'service', 'premium', 3500.00, 'services/matlab_consult.pdf'),

-- Courses
('Mastering Next.js 15 App Router', 'Vercel Team Academy', 'Learn components, actions, API routes, and advanced SSR.', 'Courses', 'course', 'premium', 1500.00, 'premium/nextjs15_course.pdf'),
('Python for Data Science BootCamp', 'AI Association of PK', 'Introductory Python, Pandas, Numpy, and Matplotlib tutorials.', 'Courses', 'course', 'free', 0.00, 'free/python_datascience.pdf')
on conflict do nothing;


-- 9. USER ACCOUNT SYNCHRONIZATION
insert into public.profiles (id, email, name, is_admin)
select 
  id, 
  email, 
  coalesce(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  case 
    when email = 'engineer.yasin.books@gmail.com' or email = 'yasin.jr@gmail.com' or email = 'admin@engineeryasin.com' then true 
    else false 
  end
from auth.users
on conflict (id) do nothing;


-- 10. GLOBAL PRIVILEGES GRANTS
grant usage on schema public to anon, authenticated, service_role;
grant select on all tables in schema public to anon, authenticated;
grant insert on public.orders to authenticated;
grant insert on public.order_items to authenticated;
grant update on public.profiles to authenticated;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to anon, authenticated, service_role;
grant select on public.custom_pages to anon, authenticated;
