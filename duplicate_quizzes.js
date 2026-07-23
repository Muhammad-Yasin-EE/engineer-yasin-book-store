const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const envStr = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envStr.split('\n')) {
    if (line.includes('=')) {
        const [k, ...v] = line.split('=');
        env[k.trim()] = v.join('=').trim().replace(/['"]/g, '');
    }
}
const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY']);

const branches = [
    { id: 'm-cadet', category: 'armed-forces' },
    { id: 'amc', category: 'armed-forces' },
    { id: 'logistics', category: 'armed-forces' },
    { id: 'it', category: 'armed-forces' },
    { id: 'education', category: 'armed-forces' },
    { id: 'airmen', category: 'armed-forces' },
    { id: 'm-cadet-navy', category: 'armed-forces' },
    { id: 'pnec', category: 'armed-forces' }
];

async function run() {
    console.log('Fetching base quizzes...');
    
    // Fetch 4 existing Verbal tests
    const { data: verbalQuizzes } = await supabase
        .from('quizzes')
        .select('*')
        .ilike('title', '%Verbal Intelligence Test%')
        .limit(4);
        
    // Fetch 25 existing Academic tests
    const { data: acadQuizzes } = await supabase
        .from('quizzes')
        .select('*')
        .ilike('title', 'PMA 159 Academic Test%')
        .limit(25);
        
    console.log(`Found ${verbalQuizzes.length} Verbal base quizzes.`);
    console.log(`Found ${acadQuizzes.length} Academic base quizzes.`);

    if (verbalQuizzes.length === 0 || acadQuizzes.length === 0) {
        console.error('Base quizzes not found. Aborting.');
        return;
    }

    let quizzesCreated = 0;
    let questionsCreated = 0;

    for (const branch of branches) {
        console.log(`\nProcessing branch: ${branch.id}`);
        
        // --- Process Verbal Tests ---
        for (let i = 0; i < verbalQuizzes.length; i++) {
            const baseQuiz = verbalQuizzes[i];
            // Format name cleanly
            const newTitle = `${branch.id} Verbal Intelligence Test: ${i + 1}`;
            
            // Check if exists
            const { data: existing } = await supabase
                .from('quizzes')
                .select('id')
                .eq('title', newTitle)
                .single();
                
            if (!existing) {
                // Fetch base questions
                const { data: baseQuestions } = await supabase
                    .from('quiz_questions')
                    .select('*')
                    .eq('quiz_id', baseQuiz.id);
                    
                // Insert new quiz
                const newQuizId = uuidv4();
                await supabase.from('quizzes').insert({
                    id: newQuizId,
                    title: newTitle,
                    description: `Verbal Intelligence Practice Test ${i + 1} for ${branch.id}`,
                    category: branch.category,
                    created_at: new Date().toISOString()
                });
                quizzesCreated++;
                
                // Insert questions
                if (baseQuestions && baseQuestions.length > 0) {
                    const newQuestions = baseQuestions.map(q => ({
                        id: uuidv4(),
                        quiz_id: newQuizId,
                        question_text: q.question_text,
                        options: q.options,
                        correct_answer: q.correct_answer,
                        explanation: q.explanation,
                        created_at: new Date().toISOString()
                    }));
                    
                    // Batch insert in chunks of 50
                    for (let j = 0; j < newQuestions.length; j += 50) {
                        const chunk = newQuestions.slice(j, j + 50);
                        await supabase.from('quiz_questions').insert(chunk);
                        questionsCreated += chunk.length;
                    }
                }
                process.stdout.write(`V${i+1} `);
            } else {
                process.stdout.write(`(Skip V${i+1}) `);
            }
        }
        
        // --- Process Academic Tests ---
        for (let i = 0; i < acadQuizzes.length; i++) {
            const baseQuiz = acadQuizzes[i];
            // The original names are 'PMA 159 Academic Test: 1', so we extract the number if we can, or just use i+1
            const newTitle = `${branch.id} Academic Test: ${i + 1}`;
            
            // Check if exists
            const { data: existing } = await supabase
                .from('quizzes')
                .select('id')
                .eq('title', newTitle)
                .single();
                
            if (!existing) {
                // Fetch base questions
                const { data: baseQuestions } = await supabase
                    .from('quiz_questions')
                    .select('*')
                    .eq('quiz_id', baseQuiz.id);
                    
                // Insert new quiz
                const newQuizId = uuidv4();
                await supabase.from('quizzes').insert({
                    id: newQuizId,
                    title: newTitle,
                    description: `Academic Practice Test ${i + 1} for ${branch.id}`,
                    category: branch.category,
                    created_at: new Date().toISOString()
                });
                quizzesCreated++;
                
                // Insert questions
                if (baseQuestions && baseQuestions.length > 0) {
                    const newQuestions = baseQuestions.map(q => ({
                        id: uuidv4(),
                        quiz_id: newQuizId,
                        question_text: q.question_text,
                        options: q.options,
                        correct_answer: q.correct_answer,
                        explanation: q.explanation,
                        created_at: new Date().toISOString()
                    }));
                    
                    for (let j = 0; j < newQuestions.length; j += 50) {
                        const chunk = newQuestions.slice(j, j + 50);
                        await supabase.from('quiz_questions').insert(chunk);
                        questionsCreated += chunk.length;
                    }
                }
                process.stdout.write(`A${i+1} `);
            } else {
                 // skip silently for academics to not clutter console
            }
        }
    }
    
    console.log(`\n\n=== DONE ===`);
    console.log(`Duplicated ${quizzesCreated} new quizzes!`);
    console.log(`Inserted ${questionsCreated} new questions!`);
}

run().catch(console.error);
