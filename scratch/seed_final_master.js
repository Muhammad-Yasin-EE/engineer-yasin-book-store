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

async function fetchUnsplashImages(query, count) {
  let images = [];
  try {
    for (let page = 1; page <= Math.ceil(count / 30); page++) {
      const res = await fetch(`https://unsplash.com/napi/search/photos?query=${query}&per_page=30&page=${page}`);
      const data = await res.json();
      const urls = data.results.map(img => img.urls.regular);
      images = images.concat(urls);
    }
  } catch (e) {
    console.error(`Failed to fetch ${query} from Unsplash`, e);
  }
  // Shuffle array for maximum randomness
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }
  return images;
}

async function run() {
  console.log("Fetching Official Unsplash HD images...");
  const laptopImages = await fetchUnsplashImages('laptop code software', 150);
  const mobileImages = await fetchUnsplashImages('smartphone mobile app', 150);
  
  if (!laptopImages.length || !mobileImages.length) {
    console.error("Failed to load Unsplash images. Aborting.");
    return;
  }
  console.log(`Loaded ${laptopImages.length} PC images and ${mobileImages.length} Mobile images.`);

  const { data: items } = await supabase.from('items').select('id, title, resource_type, category');
  if (!items) return;

  let successCount = 0;
  const updates = [];

  let pcIndex = 0;
  let mobileIndex = 0;

  for (const item of items) {
    if (item.resource_type === 'service' || item.category === 'Some Completed Projects' || item.category === 'Completed Projects') {
      continue; // Skip services
    }

    const t = item.title.toLowerCase();
    const c = item.category ? item.category.toLowerCase() : '';
    
    let isMobile = false;

    // Strict Mobile Detection
    if (t.includes('apk') || t.includes('android') || t.includes('mobile') || t.includes('whatsapp') || t.includes('instagram') || t.includes('mod') || t.includes('pro') || t.includes('lite') || c.includes('app')) {
      isMobile = true;
    } 

    let newResourceType = 'software';
    let coverUrl = '';

    if (isMobile) {
      newResourceType = 'apk';
      coverUrl = mobileImages[mobileIndex % mobileImages.length];
      mobileIndex++;
    } else {
      newResourceType = 'software';
      coverUrl = laptopImages[pcIndex % laptopImages.length];
      pcIndex++;
    }

    updates.push(supabase.from('items').update({ 
      cover_url: coverUrl,
      resource_type: newResourceType,
      pricing_mode: 'free',
      price: 0
    }).eq('id', item.id));
  }
  
  console.log(`Sending ${updates.length} updates to database with 100% UNIQUE HD Images and FREE pricing...`);
  
  const chunkSize = 50;
  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
    await Promise.all(chunk);
    successCount += chunk.length;
    console.log(`Progress: ${successCount} / ${updates.length}`);
  }
  
  console.log(`✅ Applied 100% FREE pricing & Zero-Repeat ${successCount} HD Images directly from Unsplash!`);
}
run();
