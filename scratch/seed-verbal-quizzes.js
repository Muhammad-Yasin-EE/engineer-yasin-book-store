const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Loading parsed questions JSON...");
  const rawData = fs.readFileSync('scratch/parsed_verbal_questions_v2.json', 'utf8');
  const questions = JSON.parse(rawData);

  console.log(`Loaded ${questions.length} questions.`);

  // Apply fixes
  // 1. Question 13 at index 111 (One Third of One Half is ______)
  if (questions[111]) {
    questions[111].question_text = "One Third of One Half is ______";
    questions[111].options = ["1/3", "1/8", "1/6", "2/3"];
    questions[111].correct_option_index = 2; // (c) 1/6
    questions[111].correct_letter = "C";
    console.log("Fixed question 13 at index 111.");
  }

  // 2. Question 63 at index 361 (What will come next? 435 534 328 ?)
  if (questions[361]) {
    questions[361].question_text = "What will come next?\n435 534 328\n ?";
    questions[361].options = ["62 / 823", "527 / 28", "832 / 25", "438 / 26"];
    questions[361].correct_option_index = 0; // (a) 62 / 823
    questions[361].correct_letter = "A";
    console.log("Fixed question 63 at index 361.");
  }

  // Split into 4 tests of 100 questions each
  // Test 1: Questions 0 to 99
  // Test 2: Questions 100 to 199
  // Test 3: Questions 200 to 299
  // Test 4: Questions 300 to 398 (which is 99 questions)
  const tests = [
    {
      titleSuffix: "Practice Test 1",
      questions: questions.slice(0, 100)
    },
    {
      titleSuffix: "Practice Test 2",
      questions: questions.slice(100, 200)
    },
    {
      titleSuffix: "Practice Test 3",
      questions: questions.slice(200, 300)
    },
    {
      titleSuffix: "Practice Test 4",
      questions: questions.slice(300)
    }
  ];

  const quizDefinitions = [];
  for (const test of tests) {
    // Category armed-forces
    quizDefinitions.push({
      title: `Armed Forces Verbal Intelligence ${test.titleSuffix}`,
      category: "armed-forces",
      description: `Attempt this official Armed Forces Verbal Intelligence test. Contains 84 MCQs with 30 minutes time limit. Evaluation for PMA, LCC, PN Cadet, and GD Pilot.`,
      questions: test.questions
    });
    // Category mdcat (for AFNS)
    quizDefinitions.push({
      title: `AFNS Verbal Intelligence ${test.titleSuffix}`,
      category: "mdcat",
      description: `Attempt this official AFNS Verbal Intelligence test. Contains 84 MCQs with 30 minutes time limit. Evaluation for Armed Forces Nursing Service candidates.`,
      questions: test.questions
    });
  }

  console.log(`Constructed ${quizDefinitions.length} quizzes to seed. Starting inserts...`);

  for (const qDef of quizDefinitions) {
    // Check if duplicate quiz title and category exists
    const { data: existing, error: checkError } = await supabase
      .from('quizzes')
      .select('id')
      .eq('title', qDef.title)
      .eq('category', qDef.category);

    if (checkError) {
      console.error(`Error checking duplicate for ${qDef.title}:`, checkError);
      continue;
    }

    let quizId;
    if (existing && existing.length > 0) {
      console.log(`Quiz already exists: "${qDef.title}" in category "${qDef.category}". Overwriting questions...`);
      quizId = existing[0].id;
      
      const { error: deleteError } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('quiz_id', quizId);

      if (deleteError) {
        console.error(`Error deleting old questions for quiz ${quizId}:`, deleteError);
        continue;
      }
    } else {
      const { data: qData, error: qError } = await supabase
        .from('quizzes')
        .insert({
          title: qDef.title,
          category: qDef.category,
          description: qDef.description
        })
        .select()
        .single();

      if (qError) {
        console.error(`Error inserting quiz ${qDef.title}:`, qError);
        continue;
      }
      quizId = qData.id;
    }

    const questionsToInsert = qDef.questions.map(q => ({
      quiz_id: quizId,
      question_text: q.question_text,
      options: q.options,
      correct_option_index: q.correct_option_index
    }));

    const { error: qtError } = await supabase
      .from('quiz_questions')
      .insert(questionsToInsert);

    if (qtError) {
      console.error(`Error inserting questions for ${qDef.title}:`, qtError);
    } else {
      console.log(`Successfully seeded: "${qDef.title}" with ${questionsToInsert.length} questions in category "${qDef.category}".`);
    }
  }

  console.log("Seeding complete.");
}

seed().catch(err => console.error("Seeding failed:", err));
