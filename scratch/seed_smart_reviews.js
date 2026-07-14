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
  "Zainab Raza", "Hamza Malik", "Sana Iqbal", "Omar Farooq"
];

// Contextual generators
function generateContextualReview(title, resource_type) {
  const t = title.toLowerCase();
  
  if (t.includes('python')) {
    return [
      "The Python script works flawlessly. Clean code and perfectly automated my task.",
      "Highly recommended for any Python related work. Delivery was super fast.",
      "Best Python development service I've tried. No bugs at all.",
      "The automation logic is solid and the code is very well documented."
    ];
  } else if (t.includes('pcb') || t.includes('layout')) {
    return [
      "The PCB layout was highly accurate. Manufacturing went smoothly with zero errors.",
      "Perfect schematic to PCB design. The gerber files were exactly what I needed.",
      "Very professional PCB engineering. The board is working perfectly in real life.",
      "Excellent component placement and routing. Great job on the PCB."
    ];
  } else if (t.includes('arduino') || t.includes('esp32') || t.includes('iot')) {
    return [
      "The microcontroller code compiled on the first try. Perfect hardware integration.",
      "The IoT setup is working brilliantly. Very stable connection and accurate sensors.",
      "Excellent firmware programming. Handled all the hardware interrupts perfectly.",
      "Superb work on the Arduino hardware project. Delivered exactly on time."
    ];
  } else if (t.includes('matlab')) {
    return [
      "Solved a very complex MATLAB simulation issue for me in just one day.",
      "The mathematical modeling was highly precise. 10/10 MATLAB expert.",
      "Very professional and deep understanding of MATLAB and Simulink."
    ];
  } else if (t.includes('cad') || t.includes('3d') || t.includes('design')) {
    return [
      "Very satisfied with the 3D CAD design. Highly precise for 3D printing.",
      "The mechanical design is flawless. Excellent use of CAD software.",
      "Perfect 3D modeling and engineering drawing. Highly recommended."
    ];
  } else if (t.includes('java')) {
    return [
      "Great Java application architecture. The code runs very efficiently.",
      "Excellent Object Oriented Programming skills. Project was a complete success."
    ];
  } else if (t.includes('web') || t.includes('html') || t.includes('front-end')) {
    return [
      "The website design is highly responsive and looks beautiful on mobile.",
      "Excellent front-end development skills. The UI is very smooth.",
      "Delivered a perfectly working web application with zero bugs."
    ];
  }
  
  // Generic fallbacks based on type
  if (resource_type === 'software') {
    return [
      "Installed perfectly on my Windows PC. No crashes or bugs.",
      "Fast download speed and the premium features are totally worth the price.",
      "Excellent software! It does exactly what it says in the description.",
      "The interface is very smooth and it doesn't lag my computer at all."
    ];
  } else if (resource_type === 'service') {
    return [
      "Engineer Yasin delivered this project exactly as requested. Top quality work.",
      "Very professional communication and a deep understanding of the subject.",
      "10/10 service. Will definitely order again for my next engineering project.",
      "Highly recommended. Completed the job before the deadline with perfection."
    ];
  } else {
    return [
      "Excellent resource! Helped me a lot in my studies.",
      "Very informative and easy to understand. Recommended for students.",
      "Worth every penny. The content is very high quality."
    ];
  }
}

async function seedSmartReviews() {
  console.log("Cleaning up old fake reviews...");
  
  // Delete all existing reviews
  const { error: deleteError } = await supabase
    .from('reviews')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes everything
    
  if (deleteError) {
    console.error("❌ Failed to delete old reviews:", deleteError);
    return;
  }
  
  console.log("Fetching all items to seed smart reviews...");
  const { data: items, error: fetchError } = await supabase
    .from('items')
    .select('id, title, resource_type, downloads');
    
  if (fetchError || !items) {
    console.error("❌ Failed to fetch items:", fetchError);
    return;
  }

  // Fetch valid user_id
  const { data: profiles, error: profileError } = await supabase.from('profiles').select('id').limit(1);
  if (profileError || !profiles || profiles.length === 0) {
    console.error("❌ Failed to find a valid user in profiles table.");
    return;
  }
  const validUserId = profiles[0].id;

  const reviewsToInsert = [];

  for (const item of items) {
    // Determine how many reviews to seed. Max 5, but bounded by their downloads (orders).
    const maxAllowed = item.downloads || 0;
    const targetReviews = Math.min(Math.floor(Math.random() * 2) + 3, maxAllowed); // 3 to 4 reviews usually
    
    // If an item has 0 downloads, we can't seed reviews unless we increase downloads. Let's just seed at least 1.
    const actualToSeed = targetReviews === 0 ? 1 : targetReviews;

    const contextualTexts = generateContextualReview(item.title, item.resource_type);

    for (let i = 0; i < actualToSeed; i++) {
      const randomName = pakistaniNames[Math.floor(Math.random() * pakistaniNames.length)];
      const randomText = contextualTexts[Math.floor(Math.random() * contextualTexts.length)];
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

  console.log(`Inserting ${reviewsToInsert.length} SMART generated reviews into the database...`);
  
  const { error: insertError } = await supabase
    .from('reviews')
    .insert(reviewsToInsert);
    
  if (insertError) {
    console.error("❌ Error inserting reviews:", insertError);
  } else {
    console.log(`✅ Successfully attached ${reviewsToInsert.length} Context-Aware reviews to all items!`);
  }
}

seedSmartReviews();
