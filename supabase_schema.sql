-- ENGINEER YASIN BOOKS DATABASE SCHEMA
-- This SQL script sets up the tables, auth triggers, RLS policies, storage buckets, and seed data.

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
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. BOOKS TABLE
create table if not exists public.books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  description text,
  cover_url text, -- Path in public 'book-covers' bucket
  category text not null,
  type text not null check (type in ('free', 'premium')),
  price numeric(10, 2) default 0.00,
  file_path text not null, -- Path in 'free-books' or 'premium-books' bucket
  download_count integer default 0,
  created_at timestamp with time zone default now()
);

-- Enable RLS on books
alter table public.books enable row level security;

-- Books Policies
create policy "Allow public read for books" on public.books for select using (true);
create policy "Allow admin write for books" on public.books all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);


-- 3. ORDERS TABLE (Manual Payment Verification)
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  total_price numeric(10, 2) default 0.00,
  status text not null default 'pending_payment' check (status in ('pending_payment', 'payment_submitted', 'verified', 'rejected')),
  payment_method text,
  transaction_ref text,
  proof_image_url text, -- Path in 'payment-proofs' bucket
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Orders Policies
create policy "Allow users to read their own orders" on public.orders for select using (
  auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Allow users to insert their own orders" on public.orders for insert with check (
  auth.uid() = user_id
);
create policy "Allow admin update for orders" on public.orders for update using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);


-- 4. ORDER ITEMS TABLE
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  book_id uuid references public.books(id) on delete cascade not null,
  price numeric(10, 2) not null
);

-- Enable RLS on order_items
alter table public.order_items enable row level security;

-- Order Items Policies
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


-- 5. PURCHASES TABLE (Permanent library links)
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  book_id uuid references public.books(id) on delete cascade not null,
  order_id uuid references public.orders(id) on delete set null,
  created_at timestamp with time zone default now(),
  unique (user_id, book_id)
);

-- Enable RLS on purchases
alter table public.purchases enable row level security;

-- Purchases Policies
create policy "Allow users to read their own purchases" on public.purchases for select using (
  auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Allow admin write for purchases" on public.purchases all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);


-- 6. STORAGE BUCKETS SETUP
-- Note: Create buckets manually or via client. SQL commands below assume storage schema exists.
insert into storage.buckets (id, name, public) values ('book-covers', 'book-covers', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('payment-proofs', 'payment-proofs', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('free-books', 'free-books', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('premium-books', 'premium-books', false) on conflict (id) do nothing;

-- Storage Policies DDL (may require admin connection to run depending on Supabase privileges)
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


-- 7. SEED DATA (50 Books across 25 categories)
insert into public.books (title, author, description, category, type, price, cover_url, file_path) values
-- Academic Books
('Fundamentals of Calculus', 'Dr. Alice Carter', 'An introductory text covering differential and integral calculus with practical engineering applications.', 'Academic Books', 'free', 0.00, 'covers/academic_free.jpg', 'free/academic_free.pdf'),
('Advanced Electromagnetism', 'Prof. John Vance', 'Comprehensive research on Maxwell equations, wave propagation, and electromagnetic field theory.', 'Academic Books', 'premium', 29.99, 'covers/academic_premium.jpg', 'premium/academic_premium.pdf'),

-- Test Preparation
('SAT Comprehensive Math Guide', 'TestPrep Experts', 'Hundreds of practice questions and strategic tips to ace the SAT math section.', 'Test Preparation', 'free', 0.00, 'covers/test_free.jpg', 'free/test_free.pdf'),
('CSS/PMS Essay Writing Secrets', 'Sheraz Ahmed', 'Strategic framework and outlines for clearing competitive essay papers in Pakistan.', 'Test Preparation', 'premium', 19.99, 'covers/test_premium.jpg', 'premium/test_premium.pdf'),

-- Programming Books
('JavaScript Basics for Beginners', 'Devon Cole', 'Learn JavaScript variables, functions, arrays, loops, and DOM manipulation from scratch.', 'Programming Books', 'free', 0.00, 'covers/prog_free.jpg', 'free/prog_free.pdf'),
('Design Patterns in TypeScript', 'Martin Fowler Jr.', 'Object-oriented patterns applied to contemporary web development with TypeScript.', 'Programming Books', 'premium', 35.00, 'covers/prog_premium.jpg', 'premium/prog_premium.pdf'),

-- AI Books
('Neural Networks Simplified', 'Sara Croft', 'A conceptual handbook on building your first neural network without advanced math.', 'AI Books', 'free', 0.00, 'covers/ai_free.jpg', 'free/ai_free.pdf'),
('Deep Learning with PyTorch', 'Dr. Lisa Huang', 'Advanced architectures, Transformers, and reinforcement learning models implemented in PyTorch.', 'AI Books', 'premium', 45.00, 'covers/ai_premium.jpg', 'premium/ai_premium.pdf'),

-- Engineering Books
('Principles of Civil Engineering', 'Robert Miller', 'Core concepts in structural analysis, concrete properties, and site planning.', 'Engineering Books', 'free', 0.00, 'covers/eng_free.jpg', 'free/eng_free.pdf'),
('Modern Control Systems Design', 'Dr. Yasin', 'State-space analysis, digital control systems, and PID tuning methodologies.', 'Engineering Books', 'premium', 49.99, 'covers/eng_premium.jpg', 'premium/eng_premium.pdf'),

-- Mathematics
('Algebra 101 Notes', 'Math Club', 'High school algebra worksheets, formulas, and visual study sheets.', 'Mathematics', 'free', 0.00, 'covers/math_free.jpg', 'free/math_free.pdf'),
('Topology and Manifolds', 'Dr. Richard Gauss', 'Graduate-level exploration of topological spaces, homotopy, and differential geometry.', 'Mathematics', 'premium', 39.99, 'covers/math_premium.jpg', 'premium/math_premium.pdf'),

-- Science & Technology
('Understanding Climate Change', 'Eco Alliance', 'A brief overview of greenhouse gases, carbon cycles, and clean energy alternatives.', 'Science & Technology', 'free', 0.00, 'covers/sci_free.jpg', 'free/sci_free.pdf'),
('Quantum Computing Principles', 'Prof. Alan Bell', 'Quantum gates, qubits, Shor''s algorithm, and physical quantum architectures.', 'Science & Technology', 'premium', 55.00, 'covers/sci_premium.jpg', 'premium/sci_premium.pdf'),

-- Medical Books
('First Aid Essentials', 'Red Cross Guides', 'A handy manual for treating burns, fractures, and cardiac arrests in emergencies.', 'Medical Books', 'free', 0.00, 'covers/med_free.jpg', 'free/med_free.pdf'),
('Gray''s Anatomy Review Workbook', 'Dr. Henry Gray', 'A study companion featuring diagrams and quizzes for medical students.', 'Medical Books', 'premium', 59.99, 'covers/med_premium.jpg', 'premium/med_premium.pdf'),

-- Language Learning
('English Grammar Cheat Sheet', 'Lang Academy', 'A quick pocket reference for active/passive voice, tenses, and punctuations.', 'Language Learning', 'free', 0.00, 'covers/lang_free.jpg', 'free/lang_free.pdf'),
('Conversational Spanish in 30 Days', 'Elena Ortiz', 'Practical vocabulary and daily listening logs to master intermediate Spanish fast.', 'Language Learning', 'premium', 14.99, 'covers/lang_premium.jpg', 'premium/lang_premium.pdf'),

-- Story Books
('The Lost Forest', 'Arthur Conan', 'A mystery story of three kids wandering into a magical hidden valley.', 'Story Books', 'free', 0.00, 'covers/story_free.jpg', 'free/story_free.pdf'),
('Chronicles of the Kingdom', 'L. S. Lewis', 'A fantasy saga of swords, dragons, and ancient prophecies.', 'Story Books', 'premium', 9.99, 'covers/story_premium.jpg', 'premium/story_premium.pdf'),

-- Kids' Books
('ABC Animal Adventures', 'Toddler Prints', 'Colorful illustrations linking alphabets to fun animals for pre-school kids.', 'Kids'' Books', 'free', 0.00, 'covers/kids_free.jpg', 'free/kids_free.pdf'),
('The Boy Who Spoke to Stars', 'Aria Moon', 'A bedtime adventure tale of a little astronomer and his friendly telescope.', 'Kids'' Books', 'premium', 7.99, 'covers/kids_premium.jpg', 'premium/kids_premium.pdf'),

-- Fairy Tales
('Cinderella (Classic Edition)', 'Grimm Brothers', 'The timeless fairy tale of Cinderella and her magical glass slipper.', 'Fairy Tales', 'free', 0.00, 'covers/fairy_free.jpg', 'free/fairy_free.pdf'),
('Tales of Whispering Woods', 'Fiona Green', 'A new collection of elves, pixies, and talking trees in enchanted forests.', 'Fairy Tales', 'premium', 8.50, 'covers/fairy_premium.jpg', 'premium/fairy_premium.pdf'),

-- Short Stories
('Under the Moonlight', 'O. Henry', 'A collection of witty and heartwarming short stories with twist endings.', 'Short Stories', 'free', 0.00, 'covers/short_free.jpg', 'free/short_free.pdf'),
('Shadows on the Wall', 'Edgar Poe', 'A modern gothic collection of suspenseful and eerie micro-fiction.', 'Short Stories', 'premium', 6.99, 'covers/short_premium.jpg', 'premium/short_premium.pdf'),

-- Fiction
('Beyond the Horizon', 'George Orwell Jr.', 'A dystopian sci-fi novel about a community living underground after a solar storm.', 'Fiction', 'free', 0.00, 'covers/fic_free.jpg', 'free/fic_free.pdf'),
('Echoes of Yesterday', 'Emily Bronte', 'A dramatic romance novel set in the beautiful countryside of Ireland.', 'Fiction', 'premium', 12.99, 'covers/fic_premium.jpg', 'premium/fic_premium.pdf'),

-- Classic Literature
('Pride and Prejudice', 'Jane Austen', 'The classic story of Elizabeth Bennet and Mr. Darcy navigating class and love.', 'Classic Literature', 'free', 0.00, 'covers/classic_free.jpg', 'free/classic_free.pdf'),
('Moby Dick (Annotated)', 'Herman Melville', 'The epic tale of Captain Ahab''s obsessive quest for the great white whale.', 'Classic Literature', 'premium', 11.99, 'covers/classic_premium.jpg', 'premium/classic_premium.pdf'),

-- History
('Ancient Civilizations Summary', 'History Network', 'A brief overview of the Egyptian, Roman, Greek, and Indus Valley civilizations.', 'History', 'free', 0.00, 'covers/hist_free.jpg', 'free/hist_free.pdf'),
('A History of the Modern Middle East', 'Dr. Khalid Mansoor', 'In-depth analysis of geopolitical boundaries, oil economies, and cultural revolutions.', 'History', 'premium', 24.99, 'covers/hist_premium.jpg', 'premium/hist_premium.pdf'),

-- Business & Finance
('Smart Personal Budgeting', 'Penny Saver', 'Worksheets and guidelines to save 30% of your income monthly.', 'Business & Finance', 'free', 0.00, 'covers/biz_free.jpg', 'free/biz_free.pdf'),
('The Intelligent Investor 2026', 'Benjamin Graham Jr.', 'Contemporary asset allocation, stock picking techniques, and risk management.', 'Business & Finance', 'premium', 22.00, 'covers/biz_premium.jpg', 'premium/biz_premium.pdf'),

-- Arts & Design
('Color Theory Workbook', 'Design Studio', 'An introduction to color harmony, complementary palettes, and canvas mixing.', 'Arts & Design', 'free', 0.00, 'covers/art_free.jpg', 'free/art_free.pdf'),
('Modern UI/UX Design Handbook', 'Steve Krug', 'Step-by-step wireframing, typography hierarchies, and mobile usability designs.', 'Arts & Design', 'premium', 27.99, 'covers/art_premium.jpg', 'premium/art_premium.pdf'),

-- Islamic Books
('40 Hadith of Imam Nawawi', 'Imam Nawawi', 'A translation and brief explanation of the essential forty traditions of the Prophet (PBUH).', 'Islamic Books', 'free', 0.00, 'covers/islamic_free.jpg', 'free/islamic_free.pdf'),
('Understanding Islamic Jurisprudence', 'Mufti Tariq', 'A detailed guide to family law, financial contracts, and daily practices in Islam.', 'Islamic Books', 'premium', 18.00, 'covers/islamic_premium.jpg', 'premium/islamic_premium.pdf'),

-- Self Improvement
('Atomic Habits Summary Guide', 'James Clear Fans', 'Visual mindmaps and action sheets based on the bestselling book.', 'Self Improvement', 'free', 0.00, 'covers/self_free.jpg', 'free/self_free.pdf'),
('Mindset of a Champion', 'Dr. Carol Dweck', 'Strategies for cultivating grit, high performance, and growth mindsets.', 'Self Improvement', 'premium', 14.50, 'covers/self_premium.jpg', 'premium/self_premium.pdf'),

-- Magazines
('Tech Weekly Issue 42', 'Tech Reviewers', 'Articles on AI chips, autonomous driving, and virtual reality displays.', 'Magazines', 'free', 0.00, 'covers/mag_free.jpg', 'free/mag_free.pdf'),
('Global Economics Monthly', 'Financial Group', 'Analysis of interest rates, job markets, and international currency shifts.', 'Magazines', 'premium', 5.99, 'covers/mag_premium.jpg', 'premium/mag_premium.pdf'),

-- Research Papers
('Impact of Solar Cells on Smart Cities', 'Yasin et al.', 'A quantitative study on grid integration and energy efficiency ratios.', 'Research Papers', 'free', 0.00, 'covers/paper_free.jpg', 'free/paper_free.pdf'),
('Distributed Consensus in Blockchain', 'Satoshi Nakamoto Jr.', 'Mathematical proofs for proof-of-stake scalability in low-latency networks.', 'Research Papers', 'premium', 15.00, 'covers/paper_premium.jpg', 'premium/paper_premium.pdf'),

-- New Arrivals
('Introduction to Next.js 15', 'Lee Robinson', 'Learn the App Router, Server Components, and Server Actions from the Vercel team.', 'New Arrivals', 'free', 0.00, 'covers/new_free.jpg', 'free/new_free.pdf'),
('Building SaaS with Supabase', 'Guillermo Rauch', 'Deploy high-availability applications with PostgreSQL, Auth, and Storage in hours.', 'New Arrivals', 'premium', 29.99, 'covers/new_premium.jpg', 'premium/new_premium.pdf'),

-- Popular Books
('The Power of Focus', 'Cal Newport', 'How to achieve deep work and undistracted focus in a hyper-connected world.', 'Popular Books', 'free', 0.00, 'covers/pop_free.jpg', 'free/pop_free.pdf'),
('Thinking Fast and Slow Notes', 'Daniel Kahneman', 'Practical exercises on system 1 and system 2 cognitive processes.', 'Popular Books', 'premium', 16.99, 'covers/pop_premium.jpg', 'premium/pop_premium.pdf'),

-- All Books (Default placeholder categories fallback)
('Mastering Algebra Basics', 'Math Experts', 'Algebraic formulas, variables, equations, and practice solutions.', 'All Books', 'free', 0.00, 'covers/all_free.jpg', 'free/all_free.pdf'),
('Advanced Algorithms & Structures', 'Thomas Cormen', 'Analysis of sorting algorithms, graph traversals, and dynamic programming.', 'All Books', 'premium', 42.00, 'covers/all_premium.jpg', 'premium/all_premium.pdf')
on conflict do nothing;
