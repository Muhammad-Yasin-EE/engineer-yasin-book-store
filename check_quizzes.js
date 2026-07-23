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

async function check() {
    const { data, error } = await supabase.from('quizzes').select('title, category').ilike('title', '%admin%');
    console.log('Quizzes with admin in title: ' + (data ? data.length : 0));
    if (data && data.length > 0) {
        console.log(data.map(q => q.title).join('\n'));
    }
}
check();
