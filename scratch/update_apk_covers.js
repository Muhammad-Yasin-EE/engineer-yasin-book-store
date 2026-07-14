const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ Error: Missing credentials in environment variables!");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

// Define domain mappings for each premium app to resolve official covers
const domainMappings = {
  "Nadra SIM Tracker DB Finder": "https://logo.clearbit.com/nadra.gov.pk",
  "Hadi SIM Toolkit Tracker": "https://logo.clearbit.com/pta.gov.pk",
  "Jutt SIM Database Tracker": "https://logo.clearbit.com/telenor.com.pk",
  "TopFollow Pro (Unlimited Coins Mod)": "https://logo.clearbit.com/instagram.com",
  "WhatsApp Number Ban & Unban v6.6": "https://logo.clearbit.com/whatsapp.com",
  "WhatsApp Ban & Unban Pro Tool": "https://logo.clearbit.com/whatsapp.com",
  "Termux Premium Scripts Mod Pack": "https://logo.clearbit.com/termux.dev",
  "CapCut Pro VIP (v9.0.0 Modded)": "https://logo.clearbit.com/capcut.com",
  "Remini Pro AI Photo Enhancer Mod": "https://logo.clearbit.com/remini.ai",
  "MT Manager VIP (File Decompiler Pro)": "https://logo.clearbit.com/github.com",
  "SafeUM Mod (Virtual Number Generator)": "https://logo.clearbit.com/safeum.com",
  "2nr Premium Polish Number Generator": "https://logo.clearbit.com/orange.pl",
  "Master SMS & Call Bomber (Prank Toolkit)": "https://logo.clearbit.com/android.com",
  "Umair-X SIM & SMS Bomber Toolkit": "https://logo.clearbit.com/jazz.com.pk",
  "InShot Pro Premium Video Editor Mod": "https://logo.clearbit.com/inshot.com",
  "Adobe Lightroom Mobile Pro (Full Presets)": "https://logo.clearbit.com/adobe.com",
  "GP Tool Pro 2.0 (8 Ball Pool Guideline)": "https://logo.clearbit.com/miniclip.com",
  "MX Player Pro (Ad-Free Premium Player)": "https://logo.clearbit.com/mxplayer.in",
  "Fake Pakistani CNIC ID Card Generator": "https://logo.clearbit.com/pakistan.gov.pk",
  "EasyPaisa History & Mock Transfer Tool": "https://logo.clearbit.com/easypaisa.com.pk",
  "All Banks Mock Screenshot Generator": "https://logo.clearbit.com/abl.com",
  "AnonyTun Pro VPN (Custom Payloads Unlocked)": "https://logo.clearbit.com/cloudflare.com",
  "HTTP Custom VPN (Payload Injector Pro)": "https://logo.clearbit.com/android.com",
  "OpenTunnel VPN Pro (Config Bypass)": "https://logo.clearbit.com/android.com",
  "Translate On Screen Premium Mod": "https://logo.clearbit.com/google.com",
  "AZ Screen Recorder Premium Unlocked": "https://logo.clearbit.com/azrecorder.co",
  "OfficeSuite Premium Pro Mobile Suite": "https://logo.clearbit.com/officesuite.com",
  "PhotoTune Pro AI Photo Enhancer Mod": "https://logo.clearbit.com/vyro.ai",
  "SnapTube VIP Premium Downloader": "https://logo.clearbit.com/snaptubeapp.com",
  "VidMate VIP Premium Downloader": "https://logo.clearbit.com/vidmateapp.com",
  "APK Editor Pro VIP UI Mod": "https://logo.clearbit.com/github.com"
};

async function updateApkCovers() {
  console.log("Updating cover URLs for premium Android APKs...");
  
  for (const [title, coverUrl] of Object.entries(domainMappings)) {
    const { data, error } = await supabase
      .from('items')
      .update({ cover_url: coverUrl })
      .eq('title', title);
      
    if (error) {
      console.error(`❌ Failed to update cover for "${title}":`, error.message);
    } else {
      console.log(`   ✅ Cover updated for "${title}" -> ${coverUrl}`);
    }
  }
  
  console.log("--- All APK cover URLs updated successfully! ---");
}

updateApkCovers();
