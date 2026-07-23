const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envStr = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envStr.split('\n')) {
    if (line.includes('=')) {
        const [k, ...v] = line.split('=');
        env[k.trim()] = v.join('=').trim().replace(/['"]/g, '');
    }
}
const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY']);

const targetBranches = ['lcc', 'dssc', 'ssc', 'accounts'];

async function run() {
    console.log('Starting cleanup process...');
    let totalQuizzesDeleted = 0;
    let totalQuestionsDeleted = 0;

    for (const branch of targetBranches) {
        console.log(`\nProcessing branch: ${branch}`);
        
        // Find quizzes starting with the branch prefix
        // We will match exactly `${branch} Verbal Intelligence Test:` and `${branch} Academic Test:`
        const { data: quizzes } = await supabase
            .from('quizzes')
            .select('id, title')
            .or(`title.ilike.${branch} Verbal Intelligence Test%,title.ilike.${branch} Academic Test%`);
            
        if (!quizzes || quizzes.length === 0) {
            console.log(`  No quizzes found to delete for ${branch}.`);
            continue;
        }

        console.log(`  Found ${quizzes.length} quizzes to delete.`);
        
        // Delete each quiz and its questions
        for (const quiz of quizzes) {
            // Delete questions first to handle any lack of ON DELETE CASCADE
            const { data: qs, error: qErr } = await supabase
                .from('quiz_questions')
                .delete()
                .eq('quiz_id', quiz.id)
                .select('id');
                
            if (qs) {
                totalQuestionsDeleted += qs.length;
            }

            // Delete quiz
            await supabase
                .from('quizzes')
                .delete()
                .eq('id', quiz.id);
                
            totalQuizzesDeleted++;
            process.stdout.write('.');
        }
        console.log(`\n  Finished deleting quizzes for ${branch}.`);
    }

    console.log(`\n=== CLEANUP COMPLETE ===`);
    console.log(`Deleted ${totalQuizzesDeleted} quizzes.`);
    console.log(`Deleted ${totalQuestionsDeleted} questions.`);
}

run().catch(console.error);
