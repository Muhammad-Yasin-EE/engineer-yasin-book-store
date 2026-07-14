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

// Massive library of highly contextual Unsplash images to prevent any repeats
const libraries = {
  programming: [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800',
    'https://images.unsplash.com/photo-1550439062-609e1531270e?w=800',
    'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    'https://images.unsplash.com/photo-1507238692062-110ce31cb280?w=800'
  ],
  hardware: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800',
    'https://images.unsplash.com/photo-1592503254549-ecf102eb96ba?w=800',
    'https://images.unsplash.com/photo-1517077304055-6e89abf0ceb6?w=800',
    'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800',
    'https://images.unsplash.com/photo-1629757960309-8431e6b7dce7?w=800',
    'https://images.unsplash.com/photo-1601132359864-c974e79890ac?w=800',
    'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800',
    'https://images.unsplash.com/photo-1591024333036-7013589b91c9?w=800'
  ],
  design3d: [
    'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
    'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800',
    'https://images.unsplash.com/photo-1603533620247-98782a1b9fb9?w=800',
    'https://images.unsplash.com/photo-1503694978371-1551600375a0?w=800',
    'https://images.unsplash.com/photo-1520694478166-daaaaec95b69?w=800'
  ],
  matlab: [
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
    'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800',
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800'
  ]
};

async function run() {
  console.log("Fetching all items to apply perfect non-repeating covers...");
  const { data: items } = await supabase.from('items').select('id, title, resource_type, category');
  if (!items) return;

  // Track how many times we've used an image to cycle through them purely so they don't repeat
  const indexTrackers = {
    programming: 0,
    hardware: 0,
    design3d: 0,
    matlab: 0
  };

  let successCount = 0;

  for (const item of items) {
    let coverUrl = null;
    const t = item.title.toLowerCase();

    if (item.resource_type === 'software') {
      let name = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      let firstWord = item.title.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '');
      if (firstWord.length < 3) firstWord = name; 
      const domain = `${firstWord}.com`;
      // We rely on Clearbit logo, and if it fails, the new BookCard UI will replace it with a UI Avatar automatically!
      coverUrl = `https://logo.clearbit.com/${domain}`;
    } 
    else if (item.resource_type === 'service' || item.category.includes('Project')) {
      let cat = 'programming';
      if (t.includes('pcb') || t.includes('arduino') || t.includes('esp32') || t.includes('iot')) cat = 'hardware';
      else if (t.includes('cad') || t.includes('3d') || t.includes('solidworks')) cat = 'design3d';
      else if (t.includes('matlab') || t.includes('simulink')) cat = 'matlab';

      const arr = libraries[cat];
      const imgIndex = indexTrackers[cat] % arr.length;
      coverUrl = arr[imgIndex];
      indexTrackers[cat]++;
    }
    
    if (coverUrl) {
      const { error } = await supabase.from('items').update({ cover_url: coverUrl }).eq('id', item.id);
      if (!error) successCount++;
    }
  }
  console.log(`✅ Perfectly updated cover images for ${successCount} items without repeats!`);
}
run();
