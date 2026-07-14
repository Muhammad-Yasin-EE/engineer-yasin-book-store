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

// Define custom premium APKs extracted from user screenshots
const customApks = [
  {
    title: "Nadra SIM Tracker DB Finder",
    author: "NADRA Finder",
    description: "Premium NADRA registration and live SIM database tracker. Locate CNIC address, phone network records, and active simulation tracker data.",
    category: "Android APK / Premium Solved Apps",
    resource_type: "software",
    type: "premium",
    price: 650.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20Nadra%20SIM%20Tracker%20DB%20Finder"
  },
  {
    title: "Hadi SIM Toolkit Tracker",
    author: "Hadi Developers",
    description: "Premium live SIM information tracker and details helper tool. Allows checking registration details and SIM operator data for networks in Pakistan.",
    category: "Android APK / Premium Solved Apps",
    resource_type: "software",
    type: "premium",
    price: 550.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20Hadi%20SIM%20Toolkit%20Tracker"
  },
  {
    title: "Jutt SIM Database Tracker",
    author: "Jutt DB",
    description: "SIM Database Tracker APK with direct connection utility for finding SIM owner network details, registry coordinates, and caller identification.",
    category: "Android APK / Premium Solved Apps",
    resource_type: "software",
    type: "premium",
    price: 500.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20Jutt%20SIM%20Database%20Tracker"
  },
  {
    title: "TopFollow Pro (Unlimited Coins Mod)",
    author: "TopFollow Mod",
    description: "Social media likes and follower booster coin helper script package. Unlocked unlimited task configurations and booster logs.",
    category: "Android APK / Premium Solved Apps",
    resource_type: "software",
    type: "premium",
    price: 450.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20TopFollow%20Pro"
  },
  {
    title: "WhatsApp Number Ban & Unban v6.6",
    author: "AD Magsi Mods",
    description: "Advanced WhatsApp account appeal helper. Equipped with pre-written templates to review and request number suspensions bypass.",
    category: "Android APK / Premium Solved Apps",
    resource_type: "software",
    type: "premium",
    price: 500.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20WhatsApp%20Number%20Ban%20Unban%20v6.6"
  },
  {
    title: "WhatsApp Ban & Unban Pro Tool",
    author: "UN+BN Team",
    description: "Security toolkit for account recovery. Automates templates to file suspension reviews to restore suspended numbers.",
    category: "Android APK / Premium Solved Apps",
    resource_type: "software",
    type: "premium",
    price: 450.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20WhatsApp%20Ban%20Unban%20Pro%20Tool"
  },
  {
    title: "Termux Premium Scripts Mod Pack",
    author: "Termux Team",
    description: "Complete pre-configured Termux environment. Pre-installed with required pip packages, python libraries, and code compilators directly on Android.",
    category: "Android APK / System Tools",
    resource_type: "software",
    type: "premium",
    price: 350.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20Termux%20Premium%20Scripts"
  },
  {
    title: "CapCut Pro VIP (v9.0.0 Modded)",
    author: "Bytedance Mod",
    description: "DaVinci-style advanced video editor for mobile. Unlocked premium filters, 4K rendering templates, and complete ad-free editing environment.",
    category: "Android APK / Mobile Photo & Video",
    resource_type: "software",
    type: "premium",
    price: 350.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20CapCut%20Pro%20VIP"
  },
  {
    title: "Remini Pro AI Photo Enhancer Mod",
    author: "Remini Mod",
    description: "AI-powered blur removal and photo scale tool. Unlocked unlimited VIP processing queues, no ads, and full HD image exports.",
    category: "Android APK / Mobile Photo & Video",
    resource_type: "software",
    type: "premium",
    price: 300.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20Remini%20Pro%20AI"
  },
  {
    title: "MT Manager VIP (File Decompiler Pro)",
    author: "Lin Jin Bin",
    description: "The gold standard file manager and APK decompiler. Unlocked VIP editor capabilities, script syntax highlighter, and package signer tool.",
    category: "Android APK / System Tools",
    resource_type: "software",
    type: "premium",
    price: 350.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20MT%20Manager%20VIP"
  },
  {
    title: "SafeUM Mod (Virtual Number Generator)",
    author: "SafeUM",
    description: "Virtual phone numbers generator APK for foreign registration codes. High success rate for Latvia and Poland SMS verification.",
    category: "Android APK / System Tools",
    resource_type: "software",
    type: "premium",
    price: 350.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20SafeUM%20Mod"
  },
  {
    title: "2nr Premium Polish Number Generator",
    author: "2nr",
    description: "Poland virtual number creator tool. Generates secondary temporary numbers for registering social media profiles and bypassing verification screens.",
    category: "Android APK / System Tools",
    resource_type: "software",
    type: "premium",
    price: 300.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%202nr%20Premium"
  },
  {
    title: "Master SMS & Call Bomber (Prank Toolkit)",
    author: "Jhon Mods",
    description: "High-speed SMS and call spam prank simulation tool. Floods target test phone numbers with high speed automated OTP logs.",
    category: "Android APK / Premium Solved Apps",
    resource_type: "software",
    type: "premium",
    price: 300.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20Master%20SMS%20Call%20Bomber"
  },
  {
    title: "Umair-X SIM & SMS Bomber Toolkit",
    author: "Umair-X",
    description: "Combined SIM details registry finder and SMS bomber helper. Built-in network check utilities and custom speed configurations.",
    category: "Android APK / Premium Solved Apps",
    resource_type: "software",
    type: "premium",
    price: 400.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20Umair-X%20Toolkit"
  },
  {
    title: "InShot Pro Premium Video Editor Mod",
    author: "InShot Mod",
    description: "Unlocks premium effects, stickers, canvas options, custom transition templates, ad-free UI, and high-definition video exports.",
    category: "Android APK / Mobile Photo & Video",
    resource_type: "software",
    type: "premium",
    price: 250.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20InShot%20Pro%20Premium"
  },
  {
    title: "Adobe Lightroom Mobile Pro (Full Presets)",
    author: "Adobe Mod",
    description: "Professional camera and image color grading editor. Pre-loaded with hundreds of premium design presets for instant filter edits.",
    category: "Android APK / Mobile Photo & Video",
    resource_type: "software",
    type: "premium",
    price: 300.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20Adobe%20Lightroom%20Mobile%20Pro"
  },
  {
    title: "GP Tool Pro 2.0 (8 Ball Pool Guideline)",
    author: "GP Tool",
    description: "Helper overlay tool for pool game simulators. Displays long guidelines and vector lines to practice shots in matching pools.",
    category: "Android APK / Premium Solved Apps",
    resource_type: "software",
    type: "premium",
    price: 350.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20GP%20Tool%20Pro%202.0"
  },
  {
    title: "MX Player Pro (Ad-Free Premium Player)",
    author: "J2 Interactive Mod",
    description: "Ad-free, hardware-accelerated mobile media player. Full subtitle sync support and comprehensive multi-format audio codec libraries.",
    category: "Android APK / System Tools",
    resource_type: "software",
    type: "premium",
    price: 200.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20MX%20Player%20Pro"
  },
  {
    title: "Fake Pakistani CNIC ID Card Generator",
    author: "Mock Maker",
    description: "Graphic tool to create fake mock CNIC identity card templates. Recommended for pranks, design mockups, and layout templates.",
    category: "Android APK / Premium Solved Apps",
    resource_type: "software",
    type: "premium",
    price: 200.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20Fake%20Pakistani%20CNIC%20ID%2520Card%20Generator"
  },
  {
    title: "EasyPaisa History & Mock Transfer Tool",
    author: "Prank Studio",
    description: "Mock generator utility to simulate EasyPaisa transfers. Great for prank receipts, screenshots, and visual transfer jokes.",
    category: "Android APK / Premium Solved Apps",
    resource_type: "software",
    type: "premium",
    price: 250.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20EasyPaisa%20History%20Mock%20Transfer%20Tool"
  },
  {
    title: "All Banks Mock Screenshot Generator",
    author: "Mock Screen",
    description: "Mock screen generator for banking transaction screenshots. Supports major Pakistani banks (HBL, Alfalah, UBL, Meezan) for mockup designers.",
    category: "Android APK / Premium Solved Apps",
    resource_type: "software",
    type: "premium",
    price: 250.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20All%20Banks%20Mock%20Screenshot%20Generator"
  },
  {
    title: "AnonyTun Pro VPN (Custom Payloads Unlocked)",
    author: "ArtOfTunnel",
    description: "Tunneling VPN client with fully unlocked custom header payloads, proxy ports, and SNI host bypass servers for network configurations.",
    category: "Android APK / System Tools",
    resource_type: "software",
    type: "premium",
    price: 200.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20AnonyTun%20Pro%20VPN"
  },
  {
    title: "HTTP Custom VPN (Payload Injector Pro)",
    author: "eNet Network Mod",
    description: "SSH and VPN tunnel injector with unlocked config exports and custom SNI config headers for cell carrier bypassing.",
    category: "Android APK / System Tools",
    resource_type: "software",
    type: "premium",
    price: 250.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20HTTP%20Custom%20VPN"
  },
  {
    title: "OpenTunnel VPN Pro (Config Bypass)",
    author: "ArtOfTunnel Mod",
    description: "Lightweight VPN SSH tunnel client. Supports importing pre-configured tunneling payload scripts with an ad-free interface.",
    category: "Android APK / System Tools",
    resource_type: "software",
    type: "premium",
    price: 200.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20OpenTunnel%20VPN%20Pro"
  },
  {
    title: "Translate On Screen Premium Mod",
    author: "Dictionary Mod",
    description: "Universal on-screen translator. Instantly translates text of games, books, or apps live with a single floating icon tap.",
    category: "Android APK / Productivity & Office",
    resource_type: "software",
    type: "premium",
    price: 250.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20Translate%20On%20Screen%20Premium%20Mod"
  },
  {
    title: "AZ Screen Recorder Premium Unlocked",
    author: "AZ Provider Mod",
    description: "High-definition mobile screen recorder. Unlocked no-watermark rendering, no time limits, and equipped with a built-in trim editor.",
    category: "Android APK / System Tools",
    resource_type: "software",
    type: "premium",
    price: 200.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20AZ%20Screen%20Recorder%20Premium"
  },
  {
    title: "OfficeSuite Premium Pro Mobile Suite",
    author: "MobiSystems Mod",
    description: "Full premium mobile office editor suite. Edit, print, and export Word docs, Excel sheets, and PowerPoint presentations with PDF utilities.",
    category: "Android APK / Productivity & Office",
    resource_type: "software",
    type: "premium",
    price: 300.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20OfficeSuite%20Premium%20Pro%2520Mobile%20Suite"
  },
  {
    title: "PhotoTune Pro AI Photo Enhancer Mod",
    author: "Vyro AI Mod",
    description: "High-speed AI image scaling tool. Unblurs low-quality pictures, adjusts skin details, and restores old pictures in seconds.",
    category: "Android APK / Mobile Photo & Video",
    resource_type: "software",
    type: "premium",
    price: 250.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20PhotoTune%20Pro"
  },
  {
    title: "SnapTube VIP Premium Downloader",
    author: "SnapTube Mod",
    description: "Ad-free social media video and audio downloader. Supports 4K downloads and fast MP3 conversions in one click.",
    category: "Android APK / System Tools",
    resource_type: "software",
    type: "premium",
    price: 200.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20SnapTube%20VIP"
  },
  {
    title: "VidMate VIP Premium Downloader",
    author: "VidStudio Mod",
    description: "High speed multi-threaded ad-free video downloader for social links. Includes built-in search and fast background downloading.",
    category: "Android APK / System Tools",
    resource_type: "software",
    type: "premium",
    price: 200.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20VidMate%20VIP"
  },
  {
    title: "APK Editor Pro VIP UI Mod",
    author: "APKEditor Mod",
    description: "Advanced package cloner and modifier. Decompile, clone, sign, and modify resource strings or manifest parameters of Android packages.",
    category: "Android APK / System Tools",
    resource_type: "software",
    type: "premium",
    price: 250.00,
    file_path: "https://wa.me/923342806970?text=I%20want%20to%20buy%20APK%20Editor%20Pro"
  }
];

async function seedApks() {
  console.log(`Seeding ${customApks.length} premium APKs to Supabase...`);
  
  // Insert in batches of 10 to keep payload balanced
  const batchSize = 10;
  for (let i = 0; i < customApks.length; i += batchSize) {
    const batch = customApks.slice(i, i + batchSize);
    
    // We map default cover_url to null, so the app page will dynamically fetch logos or fall back to cover placeholders
    const payload = batch.map(apk => ({
      title: apk.title,
      author: apk.author,
      description: apk.description,
      category: apk.category,
      resource_type: apk.resource_type,
      type: apk.type,
      price: apk.price,
      file_path: apk.file_path,
      cover_url: null, // Client components will fetch brand logo fallbacks
      download_count: Math.floor(Math.random() * 45) + 5 // Simulates realistic initial interest download metrics
    }));

    const { data, error } = await supabase
      .from('items')
      .insert(payload);

    if (error) {
      console.error(`❌ Error seeding batch starting at index ${i}:`, error.message);
    } else {
      console.log(`   ✅ Successfully seeded batch of ${payload.length} items (indices ${i} to ${i + payload.length - 1}).`);
    }
  }

  console.log("--- Seeding Custom APKs Complete! ---");
}

seedApks();
