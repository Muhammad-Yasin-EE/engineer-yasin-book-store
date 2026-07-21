const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log("Verifying seeded quizzes in the database...");
  
  const targetTitles = [
    "Armed Forces English Practice Test 1",
    "AFNS English Practice Test 1",
    "Armed Forces Biology Practice Test 1",
    "AFNS Biology Practice Test 1",
    "Armed Forces Chemistry Practice Test 1",
    "AFNS Chemistry Practice Test 1",
    "Armed Forces Physics Practice Test 1",
    "AFNS Physics Practice Test 1"
  ];

  const { data: quizzes, error: qError } = await supabase
    .from('quizzes')
    .select('id, title, category, description')
    .in('title', targetTitles);

  if (qError) {
    console.error("Error querying quizzes:", qError);
    process.exit(1);
  }

  console.log(`Found ${quizzes.length} matching quizzes in database.`);

  for (const quiz of quizzes) {
    const { data: questions, error: qtError } = await supabase
      .from('quiz_questions')
      .select('id')
      .eq('quiz_id', quiz.id);

    if (qtError) {
      console.error(`Error querying questions for quiz "${quiz.title}":`, qtError);
    } else {
      console.log(`- Quiz: "${quiz.title}" | Category: "${quiz.category}" | Questions Count: ${questions.length}`);
    }
  }

  console.log("Verification finished.");
}

verify();
