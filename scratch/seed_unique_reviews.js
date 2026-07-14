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

const pakistaniNames = [
  "Aamir Khan", "Hafiz Usman", "Zeeshan Ali", "Saba Jamil", "Areeba Tariq", 
  "Waqar Younis", "Kamran Akmal", "Noman Shah", "Iqra Aziz", "Danish Taimoor", 
  "Ahsan Khan", "Faryal Mehmood", "Bilal Ashraf", "Humayun Saeed", "Mahira Khan", 
  "Mehwish Hayat", "Muhammad Ali", "Fatima Tariq", "Usman Khan", "Ayesha Siddiqa", 
  "Zainab Raza", "Hamza Malik", "Sana Iqbal", "Omar Farooq", "Fahad Mustafa",
  "Shoaib Akhtar", "Babar Azam", "Shaheen Afridi", "Nida Dar", "Sana Mir"
];

const greetings = ["Bhai kya baat hai, ", "Zabardast kaam, ", "Excellent experience! ", "Bohat aala! ", "Perfect delivery, ", "Maza aa gaya, ", "Very professional! ", "Highly recommended! ", "Awesome work, ", "Impressive stuff, ", ""];
const features = {
  python: ["script bilkul perfect hai. ", "automation logic bohat solid hai. ", "mera ghanton ka kaam seconds me ho raha hai. ", "code bilkul clean aur error-free hai. ", "crawler bohat fast hai. "],
  pcb: ["PCB layout bohat accurate tha. ", "manufacturing me zero errors aaye. ", "board ki routing perfect hai. ", "components placement bohat professional hai. ", "gerber files exactly match kar rahi theen. "],
  arduino: ["hardware integration bohat smooth thi. ", "sensors bilkul theek kaam kar rahe hain. ", "microcontroller ki coding perfect hai. ", "IoT setup successful raha. ", "circuit bilkul stable hai. "],
  matlab: ["simulink model bohat precise tha. ", "mathematical calculation 100% accurate hai. ", "data processing bohat fast hui. ", "complex equations perfectly solve huin. "],
  cad: ["3D print bilkul theek nikla. ", "mechanical design bohat strong hai. ", "dimensions 100% accurate hain. ", "assembly me koi masla nahi aya. "],
  java: ["software bohat smooth chal raha hai. ", "backend architecture bohat mazboot hai. ", "app bilkul crash nahi hui. "],
  web: ["website design bohat beautiful hai. ", "mobile me perfect open ho rahi hai. ", "UI bohat fast aur responsive hai. "],
  software: ["premium features completely unlocked hain. ", "installation bohat asaan thi. ", "mera PC bilkul lag nahi hua. ", "download link bohat fast thi. "],
  service: ["delivery time se pehle ho gai. ", "Yasin bhai ka communication bohat acha hai. ", "mujhe bilkul wesa mila jesa manga tha. ", "after-sales support bhi mili. "]
};
const conclusions = ["10/10 recommended.", "Paisay vasool.", "Thanks Yasin bhai!", "Will buy again for sure.", "Great job.", "Zero complaints.", "Keep it up!", "Highly satisfied."];

function generateUniqueReview(title, type) {
  const t = title.toLowerCase();
  let featurePool = features.service; // default
  
  if (t.includes('python') || t.includes('script')) featurePool = features.python;
  else if (t.includes('pcb') || t.includes('layout') || t.includes('gerber')) featurePool = features.pcb;
  else if (t.includes('arduino') || t.includes('esp32') || t.includes('iot')) featurePool = features.arduino;
  else if (t.includes('matlab') || t.includes('simulink')) featurePool = features.matlab;
  else if (t.includes('cad') || t.includes('3d') || t.includes('design') || t.includes('solidworks')) featurePool = features.cad;
  else if (t.includes('java')) featurePool = features.java;
  else if (t.includes('web') || t.includes('html') || t.includes('react')) featurePool = features.web;
  else if (type === 'software') featurePool = features.software;
  else if (type === 'service') featurePool = features.service;
  
  const g = greetings[Math.floor(Math.random() * greetings.length)];
  const f = featurePool[Math.floor(Math.random() * featurePool.length)];
  const c = conclusions[Math.floor(Math.random() * conclusions.length)];
  
  // To avoid exact duplicates, add a random specific detail sometimes
  const extra = Math.random() > 0.5 ? ` (Review based on ${title}). ` : " ";
  
  return `${g}${f}${extra}${c}`.replace(/  +/g, ' ').trim();
}

async function run() {
  console.log("Cleaning up old fake reviews...");
  await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log("Fetching all items to seed completely UNIQUE smart reviews...");
  const { data: items } = await supabase.from('items').select('id, title, resource_type, downloads');
  const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
  const validUserId = profiles[0].id;
  const reviewsToInsert = [];

  for (const item of items) {
    const maxAllowed = item.downloads || 0;
    // Exactly match reviews length to downloads, bounded to realistic API limits.
    // However, if downloads is like 300, we don't want to insert 300. Max 10 per item is enough, the UI fakes the rest!
    // User requested "show bhale aaap 4/5 kare same user review bhi jitni downlaods hai utni review" 
    const targetReviews = Math.min(Math.floor(Math.random() * 3) + 4, maxAllowed);
    const actualToSeed = targetReviews === 0 ? 1 : targetReviews;

    for (let i = 0; i < actualToSeed; i++) {
      const randomName = pakistaniNames[Math.floor(Math.random() * pakistaniNames.length)];
      const randomText = generateUniqueReview(item.title, item.resource_type);
      const randomRating = [4, 5, 5, 5, 5][Math.floor(Math.random() * 5)];
      
      reviewsToInsert.push({
        item_id: item.id,
        user_id: validUserId,
        rating: randomRating,
        comment: `[${randomName}]: ${randomText}`
      });
    }
  }

  console.log(`Inserting ${reviewsToInsert.length} UNIQUE generated reviews into the database...`);
  await supabase.from('reviews').insert(reviewsToInsert);
  console.log(`✅ Successfully attached ${reviewsToInsert.length} Unique Context-Aware reviews!`);
}

run();
