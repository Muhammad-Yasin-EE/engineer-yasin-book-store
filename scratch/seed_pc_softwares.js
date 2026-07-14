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

// Define custom premium PC Softwares & Tools extracted from user screenshots
const pcSoftwares = [
  // Instagram Bots
  { title: "Efface Instagram Bot (Keygen)", author: "Efface Studios", category: "PC SOFTWARE / SOCIAL MARKETING", price: 400.00, cover_url: "https://logo.clearbit.com/instagram.com" },
  { title: "Simple Instagram Bot", author: "Social Automation", category: "PC SOFTWARE / SOCIAL MARKETING", price: 350.00, cover_url: "https://logo.clearbit.com/instagram.com" },
  { title: "InstaBotPro V2024 Cracked By TeamArman", author: "TeamArman", category: "PC SOFTWARE / SOCIAL MARKETING", price: 650.00, cover_url: "https://logo.clearbit.com/instagram.com" },
  { title: "InstaBotPro 6.2.4", author: "InstaBotPro", category: "PC SOFTWARE / SOCIAL MARKETING", price: 500.00, cover_url: "https://logo.clearbit.com/instagram.com" },
  
  // Facebook Bots & Extractors
  { title: "Efface Facebook Bot", author: "Efface Studios", category: "PC SOFTWARE / SOCIAL MARKETING", price: 350.00, cover_url: "https://logo.clearbit.com/facebook.com" },
  { title: "Facebook Leads Extractor - Keygen", author: "Lead Gen Tools", category: "PC SOFTWARE / SCRAPERS", price: 450.00, cover_url: "https://logo.clearbit.com/facebook.com" },
  { title: "Facebook Marketing - FaceBook Blaster Pro", author: "FB Blaster", category: "PC SOFTWARE / SOCIAL MARKETING", price: 500.00, cover_url: "https://logo.clearbit.com/facebook.com" },
  
  // WhatsApp Senders & Extractors
  { title: "Whatsapp Sender 5.8", author: "Bulk Sender", category: "PC SOFTWARE / COMMUNICATION", price: 300.00, cover_url: "https://logo.clearbit.com/whatsapp.com" },
  { title: "LeadXtract Business WhatsApp Sender", author: "LeadXtract", category: "PC SOFTWARE / COMMUNICATION", price: 550.00, cover_url: "https://logo.clearbit.com/whatsapp.com" },
  { title: "Whatsup Number Extractor", author: "Lead Gen Tools", category: "PC SOFTWARE / SCRAPERS", price: 400.00, cover_url: "https://logo.clearbit.com/whatsapp.com" },
  
  // Scrapers & Data Extractors
  { title: "Web Data Extractor 3.6", author: "Web Tools Pro", category: "PC SOFTWARE / SCRAPERS", price: 400.00, cover_url: "https://logo.clearbit.com/spideroak.com" },
  { title: "Google Map Data Extractor", author: "Lead Gen Tools", category: "PC SOFTWARE / SCRAPERS", price: 600.00, cover_url: "https://logo.clearbit.com/google.com" },
  
  // Traffic Bots & SEO Tools
  { title: "Simple Traffic Bot", author: "Traffic Masters", category: "PC SOFTWARE / SEO & TRAFFIC", price: 250.00, cover_url: "https://logo.clearbit.com/similarweb.com" },
  { title: "Automated Traffic Bot", author: "Traffic Masters", category: "PC SOFTWARE / SEO & TRAFFIC", price: 450.00, cover_url: "https://logo.clearbit.com/similarweb.com" },
  { title: "Traffic-Scorpion", author: "SEO Tools", category: "PC SOFTWARE / SEO & TRAFFIC", price: 300.00, cover_url: "https://logo.clearbit.com/ahrefs.com" },
  { title: "Web-2.0-Traffic-Generator", author: "SEO Tools", category: "PC SOFTWARE / SEO & TRAFFIC", price: 350.00, cover_url: "https://logo.clearbit.com/moz.com" },
  { title: "Web-Traffic-Spreader", author: "Traffic Masters", category: "PC SOFTWARE / SEO & TRAFFIC", price: 250.00, cover_url: "https://logo.clearbit.com/semrush.com" },
  { title: "Backlink-Finder", author: "SEO Tools", category: "PC SOFTWARE / SEO & TRAFFIC", price: 300.00, cover_url: "https://logo.clearbit.com/ahrefs.com" },
  { title: "Backlinks-Warrior", author: "SEO Tools", category: "PC SOFTWARE / SEO & TRAFFIC", price: 350.00, cover_url: "https://logo.clearbit.com/moz.com" },
  { title: "Easy-SEO-Ninja-Software", author: "SEO Tools", category: "PC SOFTWARE / SEO & TRAFFIC", price: 400.00, cover_url: "https://logo.clearbit.com/yoast.com" },
  { title: "Keyword-Tool", author: "SEO Tools", category: "PC SOFTWARE / SEO & TRAFFIC", price: 250.00, cover_url: "https://logo.clearbit.com/google.com" },
  { title: "Google-Adword-Evaluator", author: "AdWords Pro", category: "PC SOFTWARE / SEO & TRAFFIC", price: 350.00, cover_url: "https://logo.clearbit.com/google.com" },
  { title: "YT Rank Analyzer", author: "YT Masters", category: "PC SOFTWARE / SEO & TRAFFIC", price: 400.00, cover_url: "https://logo.clearbit.com/youtube.com" },
  
  // Email & SMS Marketing
  { title: "EMAIL SendBlaster 3 Pro License Keys", author: "SendBlaster", category: "PC SOFTWARE / EMAIL MARKETING", price: 500.00, cover_url: "https://logo.clearbit.com/sendblaster.com" },
  { title: "DRPU SMS cable connect", author: "DRPU Software", category: "PC SOFTWARE / COMMUNICATION", price: 200.00, cover_url: "https://logo.clearbit.com/twilio.com" },
  { title: "Android_Bulk_SMS_Sender", author: "Bulk Sender", category: "PC SOFTWARE / COMMUNICATION", price: 450.00, cover_url: "https://logo.clearbit.com/android.com" },
  { title: "smscasterenterprisesetup", author: "SMS Caster", category: "PC SOFTWARE / COMMUNICATION", price: 400.00, cover_url: "https://logo.clearbit.com/clickatell.com" },
  { title: "smscastersetup", author: "SMS Caster", category: "PC SOFTWARE / COMMUNICATION", price: 300.00, cover_url: "https://logo.clearbit.com/clickatell.com" },
  { title: "Email-List-Builder", author: "List Gen", category: "PC SOFTWARE / EMAIL MARKETING", price: 250.00, cover_url: "https://logo.clearbit.com/mailchimp.com" },
  { title: "Email-Protector", author: "Security Pro", category: "PC SOFTWARE / EMAIL MARKETING", price: 200.00, cover_url: "https://logo.clearbit.com/protonmail.com" },
  { title: "How-To-Set-Up-Your-Own-Email-Server", author: "Server Admin", category: "PC SOFTWARE / EMAIL MARKETING", price: 350.00, cover_url: "https://logo.clearbit.com/cpanel.net" },
  { title: "Xyber-Email-Assistant", author: "Xyber Tools", category: "PC SOFTWARE / EMAIL MARKETING", price: 250.00, cover_url: "https://logo.clearbit.com/gmail.com" },
  
  // Proxy & IP Tools
  { title: "Proxy.Switcher.PRO Crack", author: "Proxy Switcher", category: "PC SOFTWARE / SYSTEM TOOLS", price: 350.00, cover_url: "https://logo.clearbit.com/nordvpn.com" },
  { title: "Super Filter 2020", author: "Data Tools", category: "PC SOFTWARE / SYSTEM TOOLS", price: 250.00, cover_url: "https://logo.clearbit.com/microsoft.com" },
  
  // Affiliate & Ad Management
  { title: "AD-Shake", author: "Ad Tools", category: "PC SOFTWARE / MARKETING", price: 200.00, cover_url: "https://logo.clearbit.com/adsense.com" },
  { title: "Ad-Tracking-Pro", author: "Ad Tools", category: "PC SOFTWARE / MARKETING", price: 350.00, cover_url: "https://logo.clearbit.com/clickbank.com" },
  { title: "Ad-Unit-Pro", author: "Ad Tools", category: "PC SOFTWARE / MARKETING", price: 250.00, cover_url: "https://logo.clearbit.com/adsense.com" },
  { title: "AdWord-Analyst", author: "Ad Tools", category: "PC SOFTWARE / MARKETING", price: 400.00, cover_url: "https://logo.clearbit.com/google.com" },
  { title: "Affiliate-Ad-Pro", author: "Affiliate Masters", category: "PC SOFTWARE / AFFILIATE", price: 300.00, cover_url: "https://logo.clearbit.com/clickbank.com" },
  { title: "Affiliate-Fire-Extinguisher", author: "Affiliate Masters", category: "PC SOFTWARE / AFFILIATE", price: 250.00, cover_url: "https://logo.clearbit.com/shareasale.com" },
  { title: "Affiliate-List-Builder", author: "List Gen", category: "PC SOFTWARE / AFFILIATE", price: 350.00, cover_url: "https://logo.clearbit.com/aweber.com" },
  { title: "Affiliate-List-Pro", author: "Affiliate Masters", category: "PC SOFTWARE / AFFILIATE", price: 300.00, cover_url: "https://logo.clearbit.com/aweber.com" },
  { title: "Affiliate-Paymaster", author: "Affiliate Masters", category: "PC SOFTWARE / AFFILIATE", price: 400.00, cover_url: "https://logo.clearbit.com/paypal.com" },
  { title: "Affiliate-PDF-Brander", author: "Affiliate Masters", category: "PC SOFTWARE / AFFILIATE", price: 250.00, cover_url: "https://logo.clearbit.com/adobe.com" },
  { title: "Amazon-Affiliate-Pro", author: "Affiliate Masters", category: "PC SOFTWARE / AFFILIATE", price: 450.00, cover_url: "https://logo.clearbit.com/amazon.com" },
  { title: "The-Affiliate-Marketers-Toolkit", author: "Affiliate Masters", category: "PC SOFTWARE / AFFILIATE", price: 500.00, cover_url: "https://logo.clearbit.com/clickbank.com" },
  
  // Articles & Blogging
  { title: "Article-Analyzer-Software", author: "Content Tools", category: "PC SOFTWARE / CONTENT", price: 250.00, cover_url: "https://logo.clearbit.com/grammarly.com" },
  { title: "Article-Indexer", author: "SEO Tools", category: "PC SOFTWARE / CONTENT", price: 200.00, cover_url: "https://logo.clearbit.com/google.com" },
  { title: "Article-Rewriter-Pro", author: "Content Tools", category: "PC SOFTWARE / CONTENT", price: 450.00, cover_url: "https://logo.clearbit.com/spinrewriter.com" },
  { title: "Article-Site-Builder", author: "Web Tools Pro", category: "PC SOFTWARE / CONTENT", price: 350.00, cover_url: "https://logo.clearbit.com/wordpress.org" },
  { title: "Article-Submitter", author: "SEO Tools", category: "PC SOFTWARE / CONTENT", price: 300.00, cover_url: "https://logo.clearbit.com/medium.com" },
  { title: "Auto-Blog-Feeder", author: "Content Tools", category: "PC SOFTWARE / CONTENT", price: 250.00, cover_url: "https://logo.clearbit.com/rss.com" },
  { title: "Blog-Ad-Pro", author: "Content Tools", category: "PC SOFTWARE / CONTENT", price: 200.00, cover_url: "https://logo.clearbit.com/adsense.com" },
  { title: "Blog-For-Profits", author: "Content Tools", category: "PC SOFTWARE / CONTENT", price: 350.00, cover_url: "https://logo.clearbit.com/blogger.com" },
  { title: "Blogging-Ninja", author: "Content Tools", category: "PC SOFTWARE / CONTENT", price: 300.00, cover_url: "https://logo.clearbit.com/wordpress.org" },
  { title: "Blog-Theme-Generator", author: "Web Tools Pro", category: "PC SOFTWARE / CONTENT", price: 250.00, cover_url: "https://logo.clearbit.com/themeforest.net" },
  { title: "Plagiarism Checker 2in1 Pack - Cracked By TeamArman", author: "TeamArman", category: "PC SOFTWARE / CONTENT", price: 400.00, cover_url: "https://logo.clearbit.com/copyscape.com" },
  { title: "PLR-Article-Builder-Software", author: "Content Tools", category: "PC SOFTWARE / CONTENT", price: 250.00, cover_url: "https://logo.clearbit.com/medium.com" },
  
  // WordPress & Web Development Plugins
  { title: "WP-List-Pop", author: "WP Plugins", category: "PC SOFTWARE / WORDPRESS", price: 150.00, cover_url: "https://logo.clearbit.com/wordpress.org" },
  { title: "WP-Shield", author: "Security Pro", category: "PC SOFTWARE / WORDPRESS", price: 250.00, cover_url: "https://logo.clearbit.com/wordfence.com" },
  { title: "WP-Sorceress", author: "WP Plugins", category: "PC SOFTWARE / WORDPRESS", price: 200.00, cover_url: "https://logo.clearbit.com/wordpress.org" },
  { title: "Script-Zend", author: "Web Tools Pro", category: "PC SOFTWARE / WEB DEV", price: 300.00, cover_url: "https://logo.clearbit.com/php.net" },
  { title: "Massive-Site-Builder-Package", author: "Web Tools Pro", category: "PC SOFTWARE / WEB DEV", price: 500.00, cover_url: "https://logo.clearbit.com/wix.com" },
  { title: "Easy-Banner-Ad-Rotator", author: "Web Tools Pro", category: "PC SOFTWARE / WEB DEV", price: 150.00, cover_url: "https://logo.clearbit.com/html5.org" },
  { title: "Easy-Code-Pro", author: "Web Tools Pro", category: "PC SOFTWARE / WEB DEV", price: 200.00, cover_url: "https://logo.clearbit.com/visualstudio.com" },
  
  // Funnel, Leads & Conversion Optimization
  { title: "Bonus-URL", author: "Marketing Pro", category: "PC SOFTWARE / MARKETING", price: 150.00, cover_url: "https://logo.clearbit.com/bitly.com" },
  { title: "Boomerang-List-Pro", author: "List Gen", category: "PC SOFTWARE / MARKETING", price: 250.00, cover_url: "https://logo.clearbit.com/aweber.com" },
  { title: "Click-Maximizer", author: "Marketing Pro", category: "PC SOFTWARE / MARKETING", price: 300.00, cover_url: "https://logo.clearbit.com/clickfunnels.com" },
  { title: "ClickMonkey", author: "Marketing Pro", category: "PC SOFTWARE / MARKETING", price: 200.00, cover_url: "https://logo.clearbit.com/hotjar.com" },
  { title: "Clipboard-Spy-Defend", author: "Security Pro", category: "PC SOFTWARE / SYSTEM TOOLS", price: 150.00, cover_url: "https://logo.clearbit.com/avast.com" },
  { title: "CodeSumo", author: "Web Tools Pro", category: "PC SOFTWARE / WEB DEV", price: 250.00, cover_url: "https://logo.clearbit.com/github.com" },
  { title: "ComboLok-Squeeze-Machine", author: "Funnel Tools", category: "PC SOFTWARE / FUNNELS", price: 350.00, cover_url: "https://logo.clearbit.com/leadpages.com" },
  { title: "Content-Chain-Gang-System", author: "Content Tools", category: "PC SOFTWARE / CONTENT", price: 300.00, cover_url: "https://logo.clearbit.com/hubspot.com" },
  { title: "Contentri", author: "Content Tools", category: "PC SOFTWARE / CONTENT", price: 250.00, cover_url: "https://logo.clearbit.com/medium.com" },
  { title: "Conversion-Equalizer", author: "Marketing Pro", category: "PC SOFTWARE / MARKETING", price: 400.00, cover_url: "https://logo.clearbit.com/optimizely.com" },
  { title: "Coupon-List-Builder", author: "List Gen", category: "PC SOFTWARE / MARKETING", price: 200.00, cover_url: "https://logo.clearbit.com/groupon.com" },
  { title: "Customer-List-Builder", author: "List Gen", category: "PC SOFTWARE / MARKETING", price: 350.00, cover_url: "https://logo.clearbit.com/salesforce.com" },
  { title: "Easy-Password-Encryption", author: "Security Pro", category: "PC SOFTWARE / SYSTEM TOOLS", price: 150.00, cover_url: "https://logo.clearbit.com/lastpass.com" },
  { title: "Easy-Squeeze-Page-Tester", author: "Funnel Tools", category: "PC SOFTWARE / FUNNELS", price: 300.00, cover_url: "https://logo.clearbit.com/unbounce.com" },
  { title: "Easy-Upsell-Pro", author: "Funnel Tools", category: "PC SOFTWARE / FUNNELS", price: 350.00, cover_url: "https://logo.clearbit.com/shopify.com" },
  { title: "Easy-Web-Visitor-Counter", author: "Marketing Pro", category: "PC SOFTWARE / MARKETING", price: 150.00, cover_url: "https://logo.clearbit.com/analytics.google.com" },
  { title: "Ecover-Creator", author: "Design Tools", category: "PC SOFTWARE / DESIGN", price: 400.00, cover_url: "https://logo.clearbit.com/canva.com" },
  { title: "Exit-List-Pro", author: "List Gen", category: "PC SOFTWARE / MARKETING", price: 250.00, cover_url: "https://logo.clearbit.com/optinmonster.com" },
  { title: "Find-And-Replace", author: "Data Tools", category: "PC SOFTWARE / SYSTEM TOOLS", price: 100.00, cover_url: "https://logo.clearbit.com/notepad-plus-plus.org" },
  { title: "FTP-Uploader", author: "Web Tools Pro", category: "PC SOFTWARE / WEB DEV", price: 200.00, cover_url: "https://logo.clearbit.com/filezilla-project.org" },
  { title: "Headline-Maximizer", author: "Content Tools", category: "PC SOFTWARE / CONTENT", price: 250.00, cover_url: "https://logo.clearbit.com/copyblogger.com" },
  { title: "Headline-Studio", author: "Content Tools", category: "PC SOFTWARE / CONTENT", price: 350.00, cover_url: "https://logo.clearbit.com/coschedule.com" },
  { title: "HelpDroid", author: "Support Tools", category: "PC SOFTWARE / SUPPORT", price: 300.00, cover_url: "https://logo.clearbit.com/zendesk.com" },
  { title: "Instant-Empire-Builder", author: "Web Tools Pro", category: "PC SOFTWARE / WEB DEV", price: 450.00, cover_url: "https://logo.clearbit.com/wordpress.org" },
  { title: "Instant-Squeeze-Builder", author: "Funnel Tools", category: "PC SOFTWARE / FUNNELS", price: 300.00, cover_url: "https://logo.clearbit.com/leadpages.com" },
  { title: "List-Building-Software", author: "List Gen", category: "PC SOFTWARE / MARKETING", price: 250.00, cover_url: "https://logo.clearbit.com/aweber.com" },
  { title: "List-Cleaner", author: "Data Tools", category: "PC SOFTWARE / DATA", price: 200.00, cover_url: "https://logo.clearbit.com/neverbounce.com" },
  { title: "ListX", author: "Data Tools", category: "PC SOFTWARE / DATA", price: 300.00, cover_url: "https://logo.clearbit.com/excel.com" },
  { title: "Magic-Pop-Bar", author: "Marketing Pro", category: "PC SOFTWARE / MARKETING", price: 150.00, cover_url: "https://logo.clearbit.com/hellobar.com" },
  { title: "MiniMem", author: "System Tools", category: "PC SOFTWARE / SYSTEM TOOLS", price: 150.00, cover_url: "https://logo.clearbit.com/windows.com" },
  { title: "NinjaTok Cracked By TeamArman", author: "TeamArman", category: "PC SOFTWARE / SOCIAL MARKETING", price: 550.00, cover_url: "https://logo.clearbit.com/tiktok.com" },
  { title: "OTO-Popup-Builder-Software", author: "Funnel Tools", category: "PC SOFTWARE / FUNNELS", price: 300.00, cover_url: "https://logo.clearbit.com/clickfunnels.com" },
  { title: "OTO-Popup-Pro", author: "Funnel Tools", category: "PC SOFTWARE / FUNNELS", price: 350.00, cover_url: "https://logo.clearbit.com/clickfunnels.com" },
  { title: "Prospect-List-Builder", author: "List Gen", category: "PC SOFTWARE / DATA", price: 400.00, cover_url: "https://logo.clearbit.com/linkedin.com" },
  { title: "Push-Response-Ad-Campaign", author: "Ad Tools", category: "PC SOFTWARE / MARKETING", price: 250.00, cover_url: "https://logo.clearbit.com/onesignal.com" },
  { title: "Really-Easy-FTP", author: "Web Tools Pro", category: "PC SOFTWARE / WEB DEV", price: 200.00, cover_url: "https://logo.clearbit.com/filezilla-project.org" },
  { title: "rFunnel", author: "Funnel Tools", category: "PC SOFTWARE / FUNNELS", price: 450.00, cover_url: "https://logo.clearbit.com/clickfunnels.com" },
  { title: "Sales-Page-Sorcerer", author: "Funnel Tools", category: "PC SOFTWARE / FUNNELS", price: 350.00, cover_url: "https://logo.clearbit.com/instapage.com" },
  { title: "The-10-Minute-Funnel-Maker", author: "Funnel Tools", category: "PC SOFTWARE / FUNNELS", price: 400.00, cover_url: "https://logo.clearbit.com/clickfunnels.com" },
  { title: "TurboZon-Builder", author: "Affiliate Masters", category: "PC SOFTWARE / AFFILIATE", price: 300.00, cover_url: "https://logo.clearbit.com/amazon.com" },
  { title: "TurboZon-Builder-Pro", author: "Affiliate Masters", category: "PC SOFTWARE / AFFILIATE", price: 450.00, cover_url: "https://logo.clearbit.com/amazon.com" },
  { title: "Viral-Master-List-Builder", author: "List Gen", category: "PC SOFTWARE / MARKETING", price: 350.00, cover_url: "https://logo.clearbit.com/viral-loops.com" },
  { title: "Web-Link-Click-Counter", author: "Web Tools Pro", category: "PC SOFTWARE / MARKETING", price: 150.00, cover_url: "https://logo.clearbit.com/bitly.com" },
  { title: "Web-Photo-Cash-Saver", author: "Data Tools", category: "PC SOFTWARE / DATA", price: 200.00, cover_url: "https://logo.clearbit.com/dropbox.com" },
  { title: "Web-Profit-Doubler", author: "Marketing Pro", category: "PC SOFTWARE / MARKETING", price: 300.00, cover_url: "https://logo.clearbit.com/stripe.com" }
];

async function seedDatabase() {
  console.log(`Starting to seed ${pcSoftwares.length} PC Softwares...`);

  const itemsToInsert = pcSoftwares.map(app => {
    return {
      title: app.title,
      author: app.author,
      description: `Premium Full Version of ${app.title}. Complete bundle setup with all pro features enabled for marketing, automation, and data scraping. Verified and secure for PC users. Lifetime access key or pre-activated builder software.`,
      category: app.category,
      resource_type: "software",
      type: "premium",
      price: app.price,
      cover_url: app.cover_url,
      // Same WhatsApp number format as APKs: 923342806970
      file_path: `https://wa.me/923342806970?text=I%20want%20to%20buy%20${encodeURIComponent(app.title)}`
    };
  });

  const { data, error } = await supabase
    .from('items')
    .insert(itemsToInsert);

  if (error) {
    console.error("❌ Seeding Error:", error.message);
  } else {
    console.log(`✅ Successfully seeded ${itemsToInsert.length} PC Software tools into the database!`);
    console.log("Pricing ranges: PKR 150 - 650 with Premium dynamic URL setups.");
  }
}

seedDatabase();
