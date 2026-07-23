const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function unifyAcademicQuizzes() {
  console.log("Fetching questions from the existing separated Mock Tests...");

  const sourceTitles = [
    "Armed Forces English Practice Test 1",
    "Armed Forces Biology Practice Test 1",
    "Armed Forces Chemistry Practice Test 1",
    "Armed Forces Physics Practice Test 1"
  ];

  let allQuestions = [];

  for (const title of sourceTitles) {
    const { data: quizData } = await supabase.from('quizzes').select('id').eq('title', title).single();
    if (quizData) {
      const { data: questions } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quizData.id);
      if (questions) {
        allQuestions.push(...questions.map(q => ({
          question_text: q.question_text,
          options: q.options,
          correct_option_index: q.correct_option_index
        })));
      }
    }
  }

  console.log(`Fetched a total of ${allQuestions.length} questions.`);

  if (allQuestions.length === 0) {
      console.log("Could not find questions in DB. Attempting to fetch from MDCAT separated quizzes...");
      const mdcatTitles = [
        "AFNS English Practice Test 1",
        "AFNS Biology Practice Test 1",
        "AFNS Chemistry Practice Test 1",
        "AFNS Physics Practice Test 1"
      ];
      for (const title of mdcatTitles) {
        const { data: quizData } = await supabase.from('quizzes').select('id').eq('title', title).single();
        if (quizData) {
          const { data: questions } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quizData.id);
          if (questions) {
            allQuestions.push(...questions.map(q => ({
              question_text: q.question_text,
              options: q.options,
              correct_option_index: q.correct_option_index
            })));
          }
        }
      }
      console.log(`Fetched a total of ${allQuestions.length} questions from MDCAT tests.`);
  }

  if (allQuestions.length === 0) {
      console.log("ERROR: No questions found to unify. Exiting.");
      return;
  }

  // 1. Delete the old separated quizzes
  const oldTitles = [
    "Armed Forces English Practice Test 1",
    "Armed Forces Biology Practice Test 1",
    "Armed Forces Chemistry Practice Test 1",
    "Armed Forces Physics Practice Test 1",
    "AFNS English Practice Test 1",
    "AFNS Biology Practice Test 1",
    "AFNS Chemistry Practice Test 1",
    "AFNS Physics Practice Test 1",
    "Armed Forces Practice Test 1 - English",
    "AFNS Practice Test 1 - English"
  ];

  console.log("Deleting old separated quizzes...");
  for (const title of oldTitles) {
    const { data, error } = await supabase.from('quizzes').select('id').eq('title', title);
    if (!error && data && data.length > 0) {
      const ids = data.map(d => d.id);
      await supabase.from('quiz_questions').delete().in('quiz_id', ids);
      await supabase.from('quizzes').delete().in('id', ids);
      console.log(`Deleted old quiz: ${title}`);
    }
  }

  // 2. Insert the unified quizzes
  const unifiedQuizzes = [
    {
      title: "Armed Forces Academic Practice Test 1",
      category: "armed-forces",
      description: "Comprehensive Academic Practice Test featuring a mix of English, Physics, Chemistry, and Biology. Contains 50 MCQs with a 30-minute time limit.",
      questions: allQuestions
    },
    {
      title: "AFNS MDCAT Academic Practice Test 1",
      category: "mdcat",
      description: "Comprehensive AFNS MDCAT Academic Practice Test featuring a mix of English, Physics, Chemistry, and Biology. Contains 50 MCQs with a 30-minute time limit.",
      questions: allQuestions
    }
  ];

  for (const qDef of unifiedQuizzes) {
    const { data: existing, error: checkError } = await supabase
      .from('quizzes')
      .select('id')
      .eq('title', qDef.title)
      .eq('category', qDef.category);

    let quizId;
    if (existing && existing.length > 0) {
      console.log(`Unified quiz already exists: "${qDef.title}". Overwriting questions...`);
      quizId = existing[0].id;
      await supabase.from('quiz_questions').delete().eq('quiz_id', quizId);
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
      console.log(`Successfully seeded: "${qDef.title}" with ${questionsToInsert.length} mixed academic questions in category "${qDef.category}".`);
    }
  }

  console.log("Academic Quizzes Unification complete.");
}

unifyAcademicQuizzes().catch(err => console.error("Unification failed:", err));
