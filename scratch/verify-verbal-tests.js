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
  console.log("Verifying seeded verbal quizzes in the database...");
  
  const targetTitles = [
    "Armed Forces Verbal Intelligence Practice Test 1",
    "AFNS Verbal Intelligence Practice Test 1",
    "Armed Forces Verbal Intelligence Practice Test 2",
    "AFNS Verbal Intelligence Practice Test 2",
    "Armed Forces Verbal Intelligence Practice Test 3",
    "AFNS Verbal Intelligence Practice Test 3",
    "Armed Forces Verbal Intelligence Practice Test 4",
    "AFNS Verbal Intelligence Practice Test 4"
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

  console.log("\nVerifying that queries filter out verbal/intelligence quizzes for soldier, sailor, and civilian:");
  
  const searchTerms = ['English', 'Intelligence', 'Armed Forces', 'General'];
  const categories = ['armed-forces'];
  const excludedExams = ['soldier', 'sailor', 'civilian'];
  
  for (const exam of excludedExams) {
    let matchedQuizzes = [];
    const seenIds = new Set();
    
    for (const term of searchTerms) {
      const { data } = await supabase
        .from('quizzes')
        .select('*')
        .ilike('title', `%${term}%`)
        .eq('category', 'armed-forces')
        .order('created_at', { ascending: true });
        
      if (data) {
        for (const q of data) {
          const isVerbalOrIntel = q.title.toLowerCase().includes('verbal') || q.title.toLowerCase().includes('intelligence');
          if (isVerbalOrIntel && excludedExams.includes(exam)) {
            continue;
          }
          if (!seenIds.has(q.id)) {
            seenIds.add(q.id);
            matchedQuizzes.push(q);
          }
        }
      }
    }
    
    const verbalMatches = matchedQuizzes.filter(q => q.title.toLowerCase().includes('verbal') || q.title.toLowerCase().includes('intelligence'));
    console.log(`- Exam card "${exam}": Total matched quizzes: ${matchedQuizzes.length} | Verbal/Intel matches (should be 0): ${verbalMatches.length}`);
  }

  console.log("\nVerification finished.");
}

verify();
