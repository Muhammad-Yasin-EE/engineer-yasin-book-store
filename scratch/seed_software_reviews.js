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
  "Aamir Khan", "Hafiz Usman", "Zeeshan Ali", "Saba Jamil", 
  "Areeba Tariq", "Waqar Younis", "Kamran Akmal", "Noman Shah", 
  "Iqra Aziz", "Danish Taimoor", "Ahsan Khan", "Faryal Mehmood", 
  "Bilal Ashraf", "Humayun Saeed", "Mahira Khan", "Mehwish Hayat"
];

const softwareReviewTexts = [
  "Bhai bohat aala app hai! Features bilkul perfect kaam kar rahe hain. 10/10 recommended.",
  "Installation was super easy and fast. Premium features are fully unlocked.",
  "I bought this software yesterday and it's working flawlessly without any crashes.",
  "Excellent app! It does exactly what it says in the description. Very useful.",
  "Fast download speed and the VIP features are totally worth the price.",
  "Maine kaafi jagah try kiya tha but yahan se original file mili. Thank you Engineer Yasin!",
  "Great application. The interface is smooth and it doesn't lag on my phone.",
  "This tool saved me so much time. All premium tools are working perfectly.",
  "Superb experience. Quick delivery of the software link and no viruses.",
  "Bohat zabardast chal rahi hai app. Kisi kisam ka koi masla nahi aya installation me."
];

async function seedSoftwareReviews() {
  console.log("Fetching softwares from database...");
  
  const { data: items, error: fetchError } = await supabase
    .from('items')
    .select('id')
    .eq('resource_type', 'software');
    
  if (fetchError || !items) {
    console.error("❌ Failed to fetch softwares:", fetchError);
    return;
  }

  console.log(`Found ${items.length} softwares. Generating reviews...`);

  // Fetch valid user_id
  const { data: profiles, error: profileError } = await supabase.from('profiles').select('id').limit(1);
  if (profileError || !profiles || profiles.length === 0) {
    console.error("❌ Failed to find a valid user in profiles table.");
    return;
  }
  const validUserId = profiles[0].id;

  const reviewsToInsert = [];

  for (const item of items) {
    const numReviews = Math.floor(Math.random() * 4) + 2; 
    
    for (let i = 0; i < numReviews; i++) {
      const randomName = pakistaniNames[Math.floor(Math.random() * pakistaniNames.length)];
      const randomText = softwareReviewTexts[Math.floor(Math.random() * softwareReviewTexts.length)];
      const ratings = [4, 5, 5, 5, 5];
      const randomRating = ratings[Math.floor(Math.random() * ratings.length)];
      
      reviewsToInsert.push({
        item_id: item.id,
        user_id: validUserId,
        rating: randomRating,
        comment: `[${randomName}]: ${randomText}`
      });
    }
  }

  console.log(`Inserting ${reviewsToInsert.length} generated software reviews into the database...`);
  
  const { error: insertError } = await supabase
    .from('reviews')
    .insert(reviewsToInsert);
    
  if (insertError) {
    console.error("❌ Error inserting reviews:", insertError);
  } else {
    console.log(`✅ Successfully attached ${reviewsToInsert.length} random 5-star software reviews!`);
  }
}

seedSoftwareReviews();
