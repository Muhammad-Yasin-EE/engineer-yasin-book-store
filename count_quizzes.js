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

const categories = [
    { id: 'pma-long-course', name: 'PMA Long Course (Army)', category: 'armed-forces' },
    { id: 'lcc', name: 'LCC (Army)', category: 'armed-forces' },
    { id: 'dssc', name: 'DSSC (Army)', category: 'armed-forces' },
    { id: 'tcc', name: 'TCC (Army)', category: 'armed-forces' },
    { id: 'afns', name: 'AFNS (Army)', category: 'mdcat' },
    { id: 'soldier', name: 'Soldier (Army)', category: 'armed-forces' },
    { id: 'gd-pilot', name: 'GD Pilot (PAF)', category: 'armed-forces' },
    { id: 'aeronautical-engineering', name: 'Aeronautical Engineering (PAF)', category: 'armed-forces' },
    { id: 'air-defence', name: 'Air Defence (PAF)', category: 'armed-forces' },
    { id: 'admin', name: 'Admin (PAF)', category: 'armed-forces' },
    { id: 'accounts', name: 'Accounts (PAF)', category: 'armed-forces' },
    { id: 'pn-cadet', name: 'PN Cadet (Navy)', category: 'armed-forces' },
    { id: 'ssc', name: 'SSC (Navy)', category: 'armed-forces' },
    { id: 'marines', name: 'Marines (Navy)', category: 'armed-forces' },
    { id: 'sailor', name: 'Sailor (Navy)', category: 'armed-forces' },
    { id: 'civilian', name: 'Civilian (Navy)', category: 'armed-forces' },
];

async function checkAll() {
    let total = 0;
    console.log('--- QUIZZES PER BRANCH ---');
    for (let c of categories) {
        const { data, error } = await supabase
            .from('quizzes')
            .select('id, title')
            .ilike('title', `%${c.id}%`)
            .eq('category', c.category);
            
        let count = data ? data.length : 0;
        
        // Exclude verbal/intelligence for soldier/sailor/civilian as per the website logic
        if (data && ['soldier', 'sailor', 'civilian'].includes(c.id)) {
            count = data.filter(q => {
                const title = q.title.toLowerCase();
                return !title.includes('verbal') && !title.includes('intelligence');
            }).length;
        }
        
        total += count;
        if (count > 0) {
            console.log(`${c.name}: ${count} quiz(zes)`);
        }
    }
    console.log('--------------------------');
    console.log(`TOTAL QUIZZES ASSIGNED TO CARDS: ${total}`);
}
checkAll();
