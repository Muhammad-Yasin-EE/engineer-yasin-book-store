const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("--- Supabase Admin Diagnostics ---");
console.log("Supabase URL:", url);
console.log("Service Key Length:", serviceKey ? serviceKey.length : "undefined");

if (!url || !serviceKey) {
  console.error("Error: Missing credentials in environment variables!");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function checkDatabase() {
  try {
    // 1. Test query on items
    console.log("\n1. Querying 'items' table as admin...");
    const { data: items, error: itemsErr } = await supabase
      .from('items')
      .select('id, title, category, resource_type')
      .limit(5);

    if (itemsErr) {
      console.error("❌ Admin Query Failed for 'items':", itemsErr.message);
    } else {
      console.log(`✅ Admin Query Successful! Found ${items.length} items.`);
      console.log("Sample items:", items);
    }

    // 2. Test query on profiles
    console.log("\n2. Querying 'profiles' table...");
    const { data: profiles, error: profilesErr } = await supabase
      .from('profiles')
      .select('count');
    
    if (profilesErr) {
      console.log("❌ Profiles Table Query Error:", profilesErr.message);
    } else {
      console.log("✅ Profiles Table Exists.");
    }

    // 3. Test query on orders
    console.log("\n3. Querying 'orders' table...");
    const { data: orders, error: ordersErr } = await supabase
      .from('orders')
      .select('count');
    
    if (ordersErr) {
      console.log("❌ Orders Table Query Error:", ordersErr.message);
    } else {
      console.log("✅ Orders Table Exists.");
    }

  } catch (err) {
    console.error("❌ Unexpected Error:", err);
  }
}

checkDatabase();
