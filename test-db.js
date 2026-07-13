const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("--- Supabase Diagnostics ---");
console.log("Supabase URL:", url);
console.log("Supabase Anon Key:", key ? `${key.substring(0, 15)}... (Length: ${key.length})` : "undefined");

if (!url || !key) {
  console.error("Error: Missing credentials in environment variables!");
  process.exit(1);
}

const supabase = createClient(url, key);

async function runDiagnostics() {
  console.log("\nAttempting to query 'items' table...");
  try {
    const { data, error } = await supabase
      .from('items')
      .select('id, title, category, resource_type')
      .limit(3);

    if (error) {
      console.error("\n❌ Database Connection Failed!");
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
      console.error("Error Details:", error.details);
    } else {
      console.log("\n✅ Database Connection Successful!");
      console.log(`Successfully retrieved ${data.length} books.`);
      console.log("Samples:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("\n❌ Unexpected Network or Runtime Error:", err);
  }
}

runDiagnostics();
