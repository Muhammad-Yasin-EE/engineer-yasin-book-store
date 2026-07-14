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
  "Muhammad Ali", "Fatima Tariq", "Usman Khan", "Ayesha Siddiqa", 
  "Bilal Ahmed", "Zainab Raza", "Hamza Malik", "Hira Shah", 
  "Saad Qureshi", "Sana Iqbal", "Omar Farooq", "Nida Anwar", 
  "Hassan Ali", "Sara Khan", "Ali Abbas", "Mariam Jamil", 
  "Waqas Mehmood", "Khadija Noor", "Fahad Mustafa", "Amna Sheikh"
];

const reviewTexts = [
  "Excellent work! Delivered on time and exactly what I needed.",
  "Very professional and deep understanding of the subject.",
  "Highly recommended. Yasin is an expert in this field.",
  "Great communication and top-tier code quality.",
  "10/10 service. Will definitely order again for my next project.",
  "Solved a very complex MATLAB issue for me in just one day.",
  "Perfect PCB layout, no errors in manufacturing. Thanks!",
  "Best tutoring session I've had. Concepts are crystal clear now.",
  "The custom bot works flawlessly without any crashes.",
  "Very satisfied with the 3D CAD design. Highly precise."
];

async function seedReviews() {
  console.log("Fetching services from database...");
  
  const { data: services, error: fetchError } = await supabase
    .from('items')
    .select('id')
    .eq('resource_type', 'service');
    
  if (fetchError || !services) {
    console.error("❌ Failed to fetch services:", fetchError);
    return;
  }

  console.log(`Found ${services.length} services. Generating reviews...`);
  const reviewsToInsert = [];

  const { data: profiles, error: profileError } = await supabase.from('profiles').select('id').limit(1);
  if (profileError || !profiles || profiles.length === 0) {
    console.error("❌ Failed to find a valid user in profiles table.");
    return;
  }
  const validUserId = profiles[0].id;

  for (const service of services) {
    const numReviews = Math.floor(Math.random() * 3) + 2; 
    
    for (let i = 0; i < numReviews; i++) {
      const randomName = pakistaniNames[Math.floor(Math.random() * pakistaniNames.length)];
      const randomText = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
      const ratings = [4, 5, 5, 5, 5];
      const randomRating = ratings[Math.floor(Math.random() * ratings.length)];
      
      reviewsToInsert.push({
        item_id: service.id,
        user_id: validUserId,
        rating: randomRating,
        comment: `[${randomName}]: ${randomText}`
      });
    }
  }

  console.log(`Inserting ${reviewsToInsert.length} generated reviews into the database...`);
  
  const { error: insertError } = await supabase
    .from('reviews')
    .insert(reviewsToInsert);
    
  if (insertError) {
    console.error("❌ Error inserting reviews:", insertError);
  } else {
    console.log(`✅ Successfully attached ${reviewsToInsert.length} random 5-star Pakistani reviews to the services!`);
  }
}

seedReviews();
