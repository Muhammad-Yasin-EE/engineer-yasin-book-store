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

async function seedStats() {
  console.log("Fetching all items from database...");
  
  const { data: items, error: fetchError } = await supabase
    .from('items')
    .select('id, resource_type, category');
    
  if (fetchError || !items) {
    console.error("❌ Failed to fetch items:", fetchError);
    return;
  }

  console.log(`Found ${items.length} items. Updating random stats...`);

  let successCount = 0;

  for (const item of items) {
    let randomViews = 0;
    let randomDownloads = 0;

    if (item.resource_type === 'service') {
      // Services: High views, low orders (downloads column)
      randomViews = Math.floor(Math.random() * (450 - 150 + 1)) + 150; // 150 to 450 views
      randomDownloads = Math.floor(Math.random() * (35 - 5 + 1)) + 5;  // 5 to 35 orders
    } else if (item.resource_type === 'software') {
      // Softwares/APKs: Medium views, medium downloads
      randomViews = Math.floor(Math.random() * (900 - 250 + 1)) + 250; // 250 to 900 views
      randomDownloads = Math.floor(Math.random() * (200 - 30 + 1)) + 30; // 30 to 200 downloads
    } else {
      // Books, Courses, Scholarships, Jobs: High views, high interactions
      randomViews = Math.floor(Math.random() * (2000 - 500 + 1)) + 500; // 500 to 2000 views
      randomDownloads = Math.floor(Math.random() * (500 - 100 + 1)) + 100; // 100 to 500 downloads
    }

    const { error } = await supabase
      .from('items')
      .update({ views: randomViews, downloads: randomDownloads })
      .eq('id', item.id);

    if (error) {
      console.error(`Failed to update item ${item.id}:`, error.message);
    } else {
      successCount++;
    }
  }

  console.log(`✅ Successfully updated views and downloads for ${successCount} items!`);
}

seedStats();
