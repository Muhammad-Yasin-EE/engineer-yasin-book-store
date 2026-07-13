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
      when new.email = 'engineeryasin2029@gmail.com' or new.email = 'yasinofficial03098158572@gmail.com' or new.email = 'engineeryasinlab@gmail.com' then true 
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
  rejection_reason text,
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


-- 6B. REVIEWS TABLE
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  item_id uuid references public.items(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS on reviews
alter table public.reviews enable row level security;

-- Reviews policies
drop policy if exists "Allow public read for reviews" on public.reviews;
drop policy if exists "Allow authenticated user insert for reviews" on public.reviews;
create policy "Allow public read for reviews" on public.reviews for select using (true);
create policy "Allow authenticated user insert for reviews" on public.reviews for insert with check (
  auth.uid() = user_id
);

-- 6C. BLOG POSTS TABLE
create table if not exists public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  summary text not null,
  content text not null,
  cover_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on blog_posts
alter table public.blog_posts enable row level security;

-- Blog posts policies
drop policy if exists "Allow public read for blog_posts" on public.blog_posts;
drop policy if exists "Allow admin write for blog_posts" on public.blog_posts;
create policy "Allow public read for blog_posts" on public.blog_posts for select using (true);
create policy "Allow admin write for blog_posts" on public.blog_posts for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- 6D. NEWSLETTER SUBSCRIBERS TABLE
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default now()
);

-- Enable RLS on newsletter_subscribers
alter table public.newsletter_subscribers enable row level security;

-- Newsletter subscribers policies
drop policy if exists "Allow public insert for newsletter_subscribers" on public.newsletter_subscribers;
drop policy if exists "Allow admin select for newsletter_subscribers" on public.newsletter_subscribers;
create policy "Allow public insert for newsletter_subscribers" on public.newsletter_subscribers for insert with check (true);
create policy "Allow admin select for newsletter_subscribers" on public.newsletter_subscribers for select using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);


-- 6E. ALTER ITEMS FOR COUNTERS
alter table public.items add column if not exists views integer default 0;
alter table public.items add column if not exists downloads integer default 0;

-- 6F. QUIZZES TABLE
create table if not exists public.quizzes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  created_at timestamp with time zone default now()
);

alter table public.quizzes enable row level security;

drop policy if exists "Allow public read for quizzes" on public.quizzes;
drop policy if exists "Allow admin write for quizzes" on public.quizzes;
create policy "Allow public read for quizzes" on public.quizzes for select using (true);
create policy "Allow admin write for quizzes" on public.quizzes for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- 6G. QUIZ QUESTIONS TABLE
create table if not exists public.quiz_questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question_text text not null,
  options text[] not null,
  correct_option_index integer not null check (correct_option_index >= 0 and correct_option_index < 10),
  created_at timestamp with time zone default now()
);

alter table public.quiz_questions enable row level security;

drop policy if exists "Allow public read for quiz_questions" on public.quiz_questions;
drop policy if exists "Allow admin write for quiz_questions" on public.quiz_questions;
create policy "Allow public read for quiz_questions" on public.quiz_questions for select using (true);
create policy "Allow admin write for quiz_questions" on public.quiz_questions for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- 6H. NOTIFICATIONS TABLE
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  message text not null,
  link text,
  created_at timestamp with time zone default now()
);

alter table public.notifications enable row level security;

drop policy if exists "Allow public read for notifications" on public.notifications;
drop policy if exists "Allow admin write for notifications" on public.notifications;
create policy "Allow public read for notifications" on public.notifications for select using (true);
create policy "Allow admin write for notifications" on public.notifications for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);


-- DATABASE PERFORMANCE INDEXING
create index if not exists idx_items_resource_type on public.items(resource_type);
create index if not exists idx_purchases_user_item on public.purchases(user_id, item_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_reviews_item_id on public.reviews(item_id);


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
insert into public.items (title, author, description, category, resource_type, type, price, file_path, cover_url) values
-- Books
('Fundamentals of Calculus', 'Dr. Alice Carter', 'Introductory calculus handbook covering limits, derivatives, integrations, and functions.', 'Academic Books', 'book', 'free', 0.00, 'free/calculus.pdf', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop'),
('Advanced Electromagnetism', 'Prof. John Vance', 'Advanced field equations and Maxwell theory for electrical engineers.', 'Academic Books', 'book', 'premium', 800.00, 'premium/magnetism.pdf', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop'),
('JavaScript Basics for Beginners', 'Devon Cole', 'Introductory JS tutorial for web programming students.', 'Programming Books', 'book', 'free', 0.00, 'free/javascript.pdf', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop'),
('Design Patterns in TypeScript', 'Martin Fowler Jr.', 'Contemporary TypeScript design patterns and object-oriented architectures.', 'Programming Books', 'book', 'premium', 1200.00, 'premium/patterns.pdf', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'),

-- Scholarships (resource_type = 'scholarship', price = 0)
('HEC Overseas Scholarship 2026', 'Higher Education Commission', 'Fully funded PhD and Master scholarships in top global universities under HEC HRDI initiative.', 'Graduate (Master''s)', 'scholarship', 'free', 0.00, 'https://www.hec.gov.pk/english/scholarships/Pages/default.aspx', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop'),
('Fulbright Scholarship Program 2026', 'USEFP Pakistan', 'Fully funded Master''s and PhD study in the United States covering tuition, airfare, and health insurance.', 'Graduate (Master''s)', 'scholarship', 'free', 0.00, 'https://usefp.org/scholarships/fulbright.cfm', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop'),
('DAAD Germany Scholarships', 'German Academic Exchange', 'Postgraduate scholarships for academic research and masters degrees in Germany.', 'PhD & Research', 'scholarship', 'free', 0.00, 'https://www.daad.de/en/', 'https://images.unsplash.com/photo-1525921429624-479b6c294548?q=80&w=600&auto=format&fit=crop'),
('Chevening Scholarship UK', 'UK Government', 'Fully funded master degree fellowships in United Kingdom for outstanding leaders.', 'Graduate (Master''s)', 'scholarship', 'free', 0.00, 'https://www.chevening.org/', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop'),
('MEXT Japanese Government Scholarship', 'Japan Ministry of Education', 'Fully funded undergraduate and postgraduate academic study in top research institutes in Japan.', 'Undergraduate', 'scholarship', 'free', 0.00, 'https://www.pk.emb-japan.go.jp/itpr_en/education.html', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop'),
('Erasmus Mundus Joint Master Degree', 'European Commission', 'Fully funded joint European masters fellowships covering study in at least two EU countries.', 'Graduate (Master''s)', 'scholarship', 'free', 0.00, 'https://ec.europa.eu/programmes/erasmus-plus/opportunities/individuals/students/erasmus-mundus-joint-master-degrees_en', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&auto=format&fit=crop'),

-- Jobs (resource_type = 'job', price = 0)
('Assistant Director (Engg) PPSC', 'Punjab Public Service Commission', 'AD Technical openings in government energy and water ministries (Civil, Electrical, Mechanical).', 'Government Jobs', 'job', 'free', 0.00, 'https://ppsc.gop.pk/', 'https://images.unsplash.com/photo-1541829019-21370038379c?q=80&w=600&auto=format&fit=crop'),
('Junior React Native Developer', 'Systems Limited', 'Develop cross-platform mobile applications with React Native, Redux, and TailwindCSS.', 'Private Jobs', 'job', 'free', 0.00, 'https://www.systemsltd.com/careers', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop'),
('Associate Hardware Engineer', 'NTDC Pakistan', 'Design and analyze transmission systems and circuit protections.', 'Private Jobs', 'job', 'free', 0.00, 'https://ntdc.gov.pk/careers', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop'),
('Frontend Developer Intern', 'Systems Limited', 'Hands-on frontend engineering internship focusing on React.js and corporate tooling systems.', 'Internships', 'job', 'free', 0.00, 'https://www.systemsltd.com/careers', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop'),
('Automated QA Intern 2026', 'Arbisoft', 'Software testing automation internship using Cypress, Selenium, and Jest.', 'Internships', 'job', 'free', 0.00, 'https://arbisoft.com/careers/', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop'),
('PPSC Sub-Engineer Electrical', 'PPC Govt Dept', 'Technical operations engineer role under Punjab Energy Department development project.', 'Government Jobs', 'job', 'free', 0.00, 'https://ppsc.gop.pk/', 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=600&auto=format&fit=crop'),

-- Software
('MATLAB 2026a (with Toolboxes)', 'MathWorks', 'Full engineering simulation and computation suite.', 'Download Software', 'software', 'premium', 2500.00, 'premium/matlab_2026a.zip', 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?q=80&w=600&auto=format&fit=crop'),
('AutoCAD 2026 Student Edition', 'Autodesk', '2D and 3D computer-aided design software tools.', 'Download Software', 'software', 'free', 0.00, 'https://www.autodesk.com/education/free-software/autocad', 'https://images.unsplash.com/photo-1503387762-592dec58ef4e?q=80&w=600&auto=format&fit=crop'),
('SolidWorks 2025 Premium', 'Dassault Systèmes', 'Mechanical design simulation and modeling engine.', 'Download Software', 'software', 'premium', 3000.00, 'premium/solidworks_2025.zip', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop'),

-- Services
('Full-Stack Web App Development', 'Yasin Coding Tech', 'Build Next.js web applications tailored to your project requirements.', 'Programming', 'service', 'premium', 5000.00, 'services/programming_consult.pdf', 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop'),
('3D Mechanical Part Designing', 'Yasin CAD Lab', 'SolidWorks 3D modeling, assembly, and product rendering.', '3D Modeling', 'service', 'premium', 4000.00, 'services/cad_consult.pdf', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop'),
('MATLAB Simulation & Scripting', 'Yasin Math Solutions', 'Custom Simulink circuit analysis and algorithm implementation.', 'MATLAB & Simulink', 'service', 'premium', 3500.00, 'services/matlab_consult.pdf', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop'),

-- Courses
('Mastering Next.js 15 App Router', 'Vercel Team Academy', 'Learn components, actions, API routes, and advanced SSR.', 'Courses', 'course', 'premium', 1500.00, 'premium/nextjs15_course.pdf', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'),
('Python for Data Science BootCamp', 'AI Association of PK', 'Introductory Python, Pandas, Numpy, and Matplotlib tutorials.', 'Courses', 'course', 'free', 0.00, 'free/python_datascience.pdf', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop')
on conflict do nothing;


-- 9. USER ACCOUNT SYNCHRONIZATION
insert into public.profiles (id, email, name, is_admin)
select 
  id, 
  email, 
  coalesce(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  case 
    when email = 'engineeryasin2029@gmail.com' or email = 'yasinofficial03098158572@gmail.com' or email = 'engineeryasinlab@gmail.com' then true 
    else false 
  end
from auth.users
on conflict (id) do nothing;


-- 10. GLOBAL PRIVILEGES GRANTS
grant usage on schema public to anon, authenticated, service_role;
grant select on all tables in schema public to anon, authenticated;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to anon, authenticated, service_role;

-- Grant writes to authenticated role (safeguarded securely by table RLS policies)
grant insert, update, delete on public.custom_pages to authenticated;
grant insert, update, delete on public.items to authenticated;
grant insert, update, delete on public.orders to authenticated;
grant insert, update, delete on public.order_items to authenticated;
grant insert, update, delete on public.purchases to authenticated;
grant insert, update, delete on public.reviews to authenticated;
grant insert, update, delete on public.blog_posts to authenticated;
grant insert, update, delete on public.quizzes to authenticated;
grant insert, update, delete on public.quiz_questions to authenticated;
grant insert, update, delete on public.notifications to authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;
grant select on public.newsletter_subscribers to authenticated;
grant update on public.profiles to authenticated;
