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

async function run() {
    // 1. Verify columns exist
    const { data: colsCheck, error: colsErr } = await supabase.from('quizzes').select('is_paid, price').limit(1);
    if (colsErr) {
        console.error('ERROR: Columns is_paid and price do not exist in the quizzes table yet!');
        console.error('Please run the SQL command in Supabase first.');
        process.exit(1);
    }
    console.log('Columns verified successfully. Proceeding with randomization...');

    // 2. Fetch all quizzes
    const { data: quizzes, error: qErr } = await supabase.from('quizzes').select('id, category');
    if (qErr) throw qErr;

    // Group quizzes by category (branch)
    const quizzesByBranch = {};
    for (const quiz of quizzes) {
        if (!quizzesByBranch[quiz.category]) {
            quizzesByBranch[quiz.category] = [];
        }
        quizzesByBranch[quiz.category].push(quiz);
    }

    let totalUpdated = 0;
    const priceOptions = [10, 15, 20];

    for (const branch of Object.keys(quizzesByBranch)) {
        const branchQuizzes = quizzesByBranch[branch];
        console.log(`Processing branch: ${branch} (${branchQuizzes.length} quizzes)`);

        // Shuffle the array to randomize which ones become free
        for (let i = branchQuizzes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [branchQuizzes[i], branchQuizzes[j]] = [branchQuizzes[j], branchQuizzes[i]];
        }

        // Keep 3 or 4 free
        const numFree = Math.floor(Math.random() * 2) + 3; // 3 or 4
        
        for (let i = 0; i < branchQuizzes.length; i++) {
            const quiz = branchQuizzes[i];
            let isPaid = true;
            let price = priceOptions[Math.floor(Math.random() * priceOptions.length)];

            if (i < numFree) {
                isPaid = false;
                price = 0;
            }

            const { error: updateErr } = await supabase
                .from('quizzes')
                .update({ is_paid: isPaid, price: price })
                .eq('id', quiz.id);

            if (updateErr) {
                console.error(`Failed to update quiz ${quiz.id}:`, updateErr);
            } else {
                totalUpdated++;
                process.stdout.write('.');
            }
        }
        console.log(`\n  Finished ${branch}. Free: ${Math.min(numFree, branchQuizzes.length)}, Paid: ${Math.max(0, branchQuizzes.length - numFree)}`);
    }

    console.log(`\n=== DONE ===`);
    console.log(`Successfully updated prices for ${totalUpdated} quizzes!`);
}

run().catch(console.error);
