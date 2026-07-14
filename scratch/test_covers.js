const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const dotenvPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(dotenvPath)) {
  const envContent = fs.readFileSync(dotenvPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
      process.env[key] = val;
    }
  });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, serviceKey);

async function runCheck() {
  const { data: items } = await supabase
    .from('items')
    .select('id, title, resource_type, cover_url')
    .in('resource_type', ['software', 'course'])
    .limit(10);

  console.log("Sample Software/Course Database Entries:");
  console.log(JSON.stringify(items, null, 2));
}

runCheck();
