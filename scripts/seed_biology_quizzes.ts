// seed_biology_quizzes.ts
// Reads biology.json and creates quizzes in Supabase (30 Q per quiz, 15 min timer)

import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const QUIZ_SIZE = 30;
const CATEGORY_ID = 'mdcat'; // Category for MDCAT (Biology)

async function main() {
  const jsonPath = path.resolve('output', 'biology.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('Biology JSON not found at', jsonPath);
    return;
  }
  const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const numQuizzes = Math.ceil(questions.length / QUIZ_SIZE);

  for (let i = 0; i < numQuizzes; i++) {
    const slice = questions.slice(i * QUIZ_SIZE, (i + 1) * QUIZ_SIZE);
    const { data: quiz, error: quizErr } = await supabase.from('quizzes').insert({
      title: `Biology Quiz ${i + 1}`,
      description: `Biology practice test with ${slice.length} questions.`,
      category: CATEGORY_ID,
      time_limit: 900,
    }).select().single();
    if (quizErr) {
      console.error('Quiz creation error:', quizErr);
      continue;
    }
    const qRecords = slice.map((q: any) => ({
      quiz_id: quiz.id,
      question_text: q.q,
      options: q.opts,
      correct_option_index: q.ans,
    }));
    const { error: qErr } = await supabase.from('quiz_questions').insert(qRecords);
    if (qErr) console.error('Insert questions error:', qErr);
    else console.log(`Created Biology Quiz ${i + 1} with ${slice.length} Q`);
  }
}

main();
