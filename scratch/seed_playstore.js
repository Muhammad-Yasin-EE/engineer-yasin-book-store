const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const gplay = require('google-play-scraper').default || require('google-play-scraper');

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
  // Remove words like "Premium", "Mod", "APK", "Pro" to get better play store results
  return title.toLowerCase()
    .replace(/\b(apk|mod|premium|pro|unlocked|free|download|latest)\b/g, '')
    .trim();
}

async function run() {
  console.log("Fetching APKs from Database...");
  
  const { data: items } = await supabase.from('items').select('id, title, resource_type');
  if (!items) return;

  const apks = items.filter(item => {
    const t = item.title.toLowerCase();
    const c = item.category ? item.category.toLowerCase() : '';
    return t.includes('apk') || t.includes('android') || t.includes('mobile') || t.includes('whatsapp') || t.includes('instagram') || t.includes('mod') || t.includes('pro') || t.includes('lite') || c.includes('app');
  });
  console.log(`Found ${apks.length} APKs. Starting Google Play Store Scraping...`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < apks.length; i++) {
    const item = apks[i];
    const searchTerm = cleanTitle(item.title) || item.title;
    
    try {
      const results = await gplay.search({
        term: searchTerm,
        num: 1
      });

      if (results && results.length > 0 && results[0].icon) {
        let iconUrl = results[0].icon;
        // Make sure icon is high quality, play store usually adds =s180-rw at the end, we can make it =s512-rw
        iconUrl = iconUrl.replace(/=s\d+-rw/, '=s512-rw');

        await supabase.from('items').update({ cover_url: iconUrl }).eq('id', item.id);
        console.log(`[${i+1}/${apks.length}] ✅ Set Official Logo for: ${item.title} -> Found: ${results[0].title}`);
        successCount++;
      } else {
        console.log(`[${i+1}/${apks.length}] ❌ No Play Store result for: ${item.title}`);
        failCount++;
      }
    } catch (e) {
      console.log(`[${i+1}/${apks.length}] ❌ Play Store Error for: ${item.title} - ${e.message || e}`);
      failCount++;
    }

    // Small delay to prevent rate limiting from Google
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`\n🎉 Process Complete! Successfully assigned ${successCount} Official Play Store Logos. Failed: ${failCount}`);
}

run();
