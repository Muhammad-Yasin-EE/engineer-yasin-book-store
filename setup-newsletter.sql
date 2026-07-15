-- Run this in your Supabase SQL Editor to create the subscribers table for the Newsletter

create table public.subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Optional: Enable RLS (Row Level Security) so no one can read the list from the frontend
alter table public.subscribers enable row level security;

-- Only admins/service role can read/insert (Service role bypasses RLS)
-- We don't need any public policies because we insert via the backend API using Service Role Key.
