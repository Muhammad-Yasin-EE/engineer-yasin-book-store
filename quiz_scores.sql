-- Create user_scores table to track quiz progress
CREATE TABLE public.user_scores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage DECIMAL(5, 2) GENERATED ALWAYS AS ((score::DECIMAL / total_questions) * 100) STORED,
    time_taken_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_scores ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own scores" 
    ON public.user_scores FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores" 
    ON public.user_scores FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create an index for faster queries on user's dashboard
CREATE INDEX idx_user_scores_user_id ON public.user_scores(user_id);
CREATE INDEX idx_user_scores_quiz_id ON public.user_scores(quiz_id);
