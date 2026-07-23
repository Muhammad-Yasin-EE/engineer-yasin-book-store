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

async function getStats() {
    const { data: quizzes, error } = await supabase.from('quizzes').select('id, title, category');
    if (error) {
        console.error(error);
        return;
    }
    
    console.log(`Total Quizzes Found in Database: ${quizzes.length}`);
    
    // Group by category
    const byCategory = {};
    for (const q of quizzes) {
        if (!byCategory[q.category]) byCategory[q.category] = [];
        byCategory[q.category].push(q);
    }
    
    console.log('\n=== QUIZZES BY CATEGORY ===');
    for (const [cat, items] of Object.entries(byCategory)) {
        console.log(`\nCategory: [${cat.toUpperCase()}] - Total: ${items.length} quizzes`);
        
        // Group by title prefixes/keywords to guess the card
        const titles = items.map(q => q.title);
        const titleCounts = {};
        for (const title of titles) {
            // just use the title to group if they are exactly the same, or strip the number if there is one
            // actually just list the unique titles and their counts
            let normalized = title.replace(/\s*\d+$/, '').trim();
            if (!titleCounts[normalized]) titleCounts[normalized] = 0;
            titleCounts[normalized]++;
        }
        
        for (const [title, count] of Object.entries(titleCounts)) {
            console.log(`  - ${title}: ${count}`);
        }
    }
}
getStats();
