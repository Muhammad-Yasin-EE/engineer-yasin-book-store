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

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log("Updating 'type' column to 'free' for all items...");
  
  const { data: items } = await supabase.from('items').select('id, type');
  if (!items) return;

  const updates = [];
  for (const item of items) {
    updates.push(supabase.from('items').update({ type: 'free' }).eq('id', item.id));
  }
  
  const chunkSize = 50;
  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
    await Promise.all(chunk);
  }
  
  console.log(`✅ Applied 'free' type to ${updates.length} items!`);
}
run();
