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

async function getCols() {
    const { data, error } = await supabase.from('quizzes').select('*').limit(1);
    if(data && data.length > 0) {
        console.log(Object.keys(data[0]));
    } else {
        console.log(error);
    }
}
getCols();
