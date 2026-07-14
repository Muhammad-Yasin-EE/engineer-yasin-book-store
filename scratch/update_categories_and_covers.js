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

// Relevant images for services based on their categories
const serviceImages = {
  'Programming': [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
  ],
  'Hardware & PCB': [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800',
    'https://images.unsplash.com/photo-1592503254549-ecf102eb96ba?w=800'
  ],
  '3D Modeling': [
    'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
    'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800'
  ],
  'MATLAB & Simulink': [
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
    'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800'
  ],
  'Some Completed Projects': [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'
  ],
  'default': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
  ]
};

async function run() {
  console.log("Updating category 'Completed Projects' to 'Some Completed Projects'...");
  await supabase
    .from('items')
    .update({ category: 'Some Completed Projects' })
    .eq('category', 'Completed Projects');

  console.log("Fetching all items to update covers...");
  const { data: items } = await supabase.from('items').select('id, title, resource_type, category');
  
  if (!items) return;

  let successCount = 0;

  for (const item of items) {
    let coverUrl = null;

    if (item.resource_type === 'software') {
      // Clean title for domain extraction
      let name = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      // If it's something like "adobe photoshop", we just take "adobe"
      let firstWord = item.title.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '');
      if (firstWord.length < 3) firstWord = name; // fallback
      
      const domain = `${firstWord}.com`;
      coverUrl = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=256`;
    } 
    else if (item.resource_type === 'service') {
      const categoryImages = serviceImages[item.category] || serviceImages['default'];
      // Pick a semi-random but consistent image based on ID so it doesn't change on every refresh
      const index = item.id.charCodeAt(0) % categoryImages.length;
      coverUrl = categoryImages[index];
    }
    
    if (coverUrl) {
      const { error } = await supabase
        .from('items')
        .update({ cover_url: coverUrl })
        .eq('id', item.id);
        
      if (!error) successCount++;
    }
  }

  console.log(`✅ Updated cover images for ${successCount} items!`);
}

run();
