const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
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

if (!url || !serviceKey) {
  console.error("❌ Missing Supabase configuration.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

function extractDomain(urlStr) {
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname;
  } catch {
    return null;
  }
}

// Sleep utility to respect rate limits
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function updateCatalogCovers() {
  console.log("Fetching items without cover images...");
  const { data: items, error } = await supabase
    .from('items')
    .select('id, title, resource_type, file_path')
    .is('cover_url', null);

  if (error) {
    console.error("❌ Error fetching items:", error.message);
    return;
  }

  console.log(`Found ${items.length} items to update.`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let cover_url = null;

    console.log(`[${i+1}/${items.length}] Processing "${item.title}" (${item.resource_type})...`);

    if (item.resource_type === 'book') {
      try {
        // Query Open Library API for book cover
        const cleanTitle = item.title.replace(/[\(\[].*?[\)\]]/g, '').trim();
        const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(cleanTitle)}&limit=1`;
        
        const response = await fetch(searchUrl);
        if (response.ok) {
          const result = await response.json();
          if (result.docs && result.docs.length > 0 && result.docs[0].cover_i) {
            const coverId = result.docs[0].cover_i;
            cover_url = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
            console.log(`   Found cover ID: ${coverId}`);
          }
        }
      } catch (err) {
        console.error(`   ⚠️ Open Library fetch failed for "${item.title}":`, err.message);
      }
      // Delay 1 second to avoid rate limits
      await sleep(1000);
    } else if (item.resource_type === 'software' || item.resource_type === 'course') {
      const domain = extractDomain(item.file_path);
      if (domain) {
        // Clearbit Logo API
        cover_url = `https://logo.clearbit.com/${domain}`;
        console.log(`   Mapped domain: ${domain}`);
      }
    }

    if (cover_url) {
      const { error: updateError } = await supabase
        .from('items')
        .update({ cover_url })
        .eq('id', item.id);

      if (updateError) {
        console.error(`   ❌ Failed to update db:`, updateError.message);
      } else {
        console.log(`   ✅ Successfully updated cover URL!`);
      }
    } else {
      console.log(`   ℹ️ No cover found, keeping default graphic.`);
    }
  }

  console.log("--- All cover URLs processed successfully! ---");
}

updateCatalogCovers();
