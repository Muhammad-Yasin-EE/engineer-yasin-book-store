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

const libraries = {
  mobileApps: [
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=800',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
    'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=800',
    'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800',
    'https://images.unsplash.com/photo-1533022139590-f225841f9e2d?w=800',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800',
    'https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?w=800',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800' // Phone on desk
  ],
  pcSoftware: [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', // Laptop
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    'https://images.unsplash.com/photo-1550439062-609e1531270e?w=800',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
    'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    'https://images.unsplash.com/photo-1507238692062-110ce31cb280?w=800'
  ],
  videoMedia: [
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
    'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800',
    'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?w=800',
    'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800',
    'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800',
    'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
    'https://images.unsplash.com/photo-1516280440502-85f8dc124e93?w=800'
  ]
};

async function run() {
  console.log("Fetching items ordered by UI display logic (created_at DESC)...");
  // Sorting by created_at DESC ensures sequential image assignment perfectly matches the UI!
  const { data: items } = await supabase.from('items').select('id, title, resource_type, category').order('created_at', { ascending: false });
  if (!items) return;

  const indexTrackers = {
    mobileApps: 0,
    pcSoftware: 0,
    videoMedia: 0
  };

  let successCount = 0;
  const updates = [];

  for (const item of items) {
    if (item.resource_type === 'service' || item.category === 'Some Completed Projects' || item.category === 'Completed Projects') {
      continue; 
    }

    let coverUrl = null;
    const t = item.title.toLowerCase();
    const c = item.category ? item.category.toLowerCase() : '';
    
    let cat = 'pcSoftware'; // Strict default for any software that is NOT explicitly mobile or video

    // Strict Mobile check
    if (t.includes('apk') || t.includes('android') || t.includes('mobile') || t.includes('whatsapp') || t.includes('instagram') || t.includes('tiktok') || c.includes('app')) {
      cat = 'mobileApps';
    } 
    // Strict Video/Media check
    else if (t.includes('video') || t.includes('editor') || t.includes('player') || t.includes('youtube') || t.includes('capcut') || t.includes('kinemaster') || t.includes('media') || c.includes('video')) {
      cat = 'videoMedia';
    }

    const arr = libraries[cat];
    const imgIndex = indexTrackers[cat] % arr.length;
    coverUrl = arr[imgIndex];
    indexTrackers[cat]++;
    
    if (coverUrl) {
      updates.push(supabase.from('items').update({ cover_url: coverUrl }).eq('id', item.id));
    }
  }
  
  console.log(`Processing ${updates.length} items in batches...`);
  
  const chunkSize = 50;
  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
    await Promise.all(chunk);
    successCount += chunk.length;
    console.log(`Progress: ${successCount} / ${updates.length}`);
  }
  
  console.log(`✅ Applied 100% strictly categorized, UI-ordered cover images for ${successCount} items!`);
}
run();
