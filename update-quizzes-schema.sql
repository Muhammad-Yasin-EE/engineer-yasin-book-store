-- Run this in your Supabase SQL Editor to add the category column to the quizzes table.

ALTER TABLE public.quizzes 
ADD COLUMN category TEXT DEFAULT 'General Knowledge';

-- (Optional) If you want to categorize existing quizzes manually, you can edit them in the Admin Panel later.
