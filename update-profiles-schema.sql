-- 1. ADD NEW COLUMNS TO PROFILES TABLE
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS school_university TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

-- 2. CREATE AVATARS STORAGE BUCKET (If you are running this in Supabase SQL editor, creating buckets programmatically might require elevated permissions. It's best to create the bucket 'avatars' manually from the Supabase Dashboard -> Storage -> New Bucket -> name it 'avatars' -> Make it PUBLIC).

-- Assuming the 'avatars' bucket is created manually and is public, we can add policies to allow users to upload their own avatars:
-- First, ensure the storage extension is active (usually is by default).

-- Create Policy: Allow anyone to view avatars
CREATE POLICY "Avatar images are publicly accessible." 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'avatars' );

-- Create Policy: Allow authenticated users to upload avatars
CREATE POLICY "Users can upload their own avatars." 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Create Policy: Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars."
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND auth.uid() = owner );

-- Create Policy: Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars."
ON storage.objects FOR DELETE
USING ( bucket_id = 'avatars' AND auth.uid() = owner );
