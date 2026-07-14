const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const gis = require('google-image-sr').default;

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

function cleanTitle(title) {
  return title.toLowerCase()
    .replace(/\b(download|crack|free|pro|premium|mod|latest|version|for pc|windows)\b/g, '')
    .trim();
}

async function run() {
  console.log("Fetching non-PlayStore items from Database...");
  
  const { data: items } = await supabase.from('items').select('id, title, cover_url');
  if (!items) return;

  // Filter out items that already have Play Store icons (they contain play-lh.googleusercontent)
  const remainingItems = items.filter(item => !item.cover_url || !item.cover_url.includes('play-lh.googleusercontent.com'));
  
  console.log(`Found ${remainingItems.length} items needing Google Image Logos. Starting Scraping...`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < remainingItems.length; i++) {
    const item = remainingItems[i];
    const searchTerm = `${cleanTitle(item.title)} official software logo transparent icon`;
    
    try {
      const results = await gis(searchTerm);

      if (results && results.length > 0) {
        // Try to get a high quality image, avoid base64 if possible
        const validImages = results.filter(r => r.image && r.image.startsWith('http'));
        
        if (validImages.length > 0) {
          const iconUrl = validImages[0].image;
          await supabase.from('items').update({ cover_url: iconUrl }).eq('id', item.id);
          console.log(`[${i+1}/${remainingItems.length}] ✅ Set Logo for: ${item.title}`);
          successCount++;
        } else {
           console.log(`[${i+1}/${remainingItems.length}] ❌ No valid HTTP image for: ${item.title}`);
           failCount++;
        }
      } else {
        console.log(`[${i+1}/${remainingItems.length}] ❌ No Google result for: ${item.title}`);
        failCount++;
      }
    } catch (e) {
      console.log(`[${i+1}/${remainingItems.length}] ❌ Search Error for: ${item.title} - ${e.message || e}`);
      failCount++;
    }

    // Delay to prevent Google rate limit block
    await new Promise(r => setTimeout(r, 1200));
  }
  
  console.log(`\n🎉 Process Complete! Successfully assigned ${successCount} Official Google Logos. Failed: ${failCount}`);
}

run();
