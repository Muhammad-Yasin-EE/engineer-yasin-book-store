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

const mySkills = [
  // Programming & Automation
  { title: "Custom Python Automation Script", category: "Programming", price: 3000 },
  { title: "Python Web Scraper & Data Miner", category: "Programming", price: 4500 },
  { title: "Advanced Java Desktop Application", category: "Programming", price: 8000 },
  { title: "Java Backend API Development", category: "Programming", price: 7500 },
  { title: "Responsive HTML/CSS Landing Page", category: "Programming", price: 2500 },
  { title: "React Frontend Web Development", category: "Programming", price: 6000 },
  { title: "Next.js Full-Stack Web Portal", category: "Programming", price: 12000 },
  { title: "Python Script for Excel/CSV Automation", category: "Programming", price: 2000 },
  { title: "Custom Design System Implementation", category: "Programming", price: 5000 },
  { title: "Java GUI Application (JavaFX/Swing)", category: "Programming", price: 5500 },
  { title: "Web Automation with Selenium/Python", category: "Programming", price: 4000 },
  { title: "RESTful API Integration Service", category: "Programming", price: 3500 },
  
  // Hardware, PCB & Electronics
  { title: "Arduino Custom Code & Circuit Design", category: "Hardware & PCB", price: 3000 },
  { title: "ESP32 IoT Project Development", category: "Hardware & PCB", price: 4500 },
  { title: "Professional PCB Layout Design", category: "Hardware & PCB", price: 6000 },
  { title: "Custom PCB Routing (Altium/KiCad)", category: "Hardware & PCB", price: 5500 },
  { title: "Electronic Circuit Design & Simulation", category: "Hardware & PCB", price: 4000 },
  { title: "Microcontroller Firmware (C/C++)", category: "Hardware & PCB", price: 5000 },
  { title: "Sensor Interfacing with Arduino/ESP32", category: "Hardware & PCB", price: 2500 },
  { title: "Computer Hardware Assembly Consultation", category: "Hardware & PCB", price: 1500 },
  { title: "Electrical Engineering Systems Design", category: "Hardware & PCB", price: 8000 },
  { title: "IoT Cloud Dashboard for ESP32", category: "Hardware & PCB", price: 7000 },
  { title: "Analog & Digital Circuit Schematic", category: "Hardware & PCB", price: 3500 },
  { title: "Embedded Systems Prototyping", category: "Hardware & PCB", price: 9000 },
  { title: "Wireless Communication Setup (Bluetooth/WiFi)", category: "Hardware & PCB", price: 4500 },
  
  // 3D Modeling & CAD
  { title: "3D CAD Modeling for 3D Printing", category: "3D Modeling", price: 4000 },
  { title: "SolidWorks Mechanical Part Design", category: "3D Modeling", price: 5500 },
  { title: "AutoCAD 2D Engineering Drawings", category: "3D Modeling", price: 3000 },
  { title: "Product Design & Engineering CAD", category: "3D Modeling", price: 7500 },
  { title: "Custom Enclosure Design for PCB", category: "3D Modeling", price: 4500 },
  { title: "Assembly Modeling & Tolerancing", category: "3D Modeling", price: 6000 },
  { title: "Reverse Engineering 3D Scans", category: "3D Modeling", price: 8500 },
  { title: "Sheet Metal CAD Design", category: "3D Modeling", price: 5000 },
  
  // MATLAB
  { title: "MATLAB Code for Signal Processing", category: "MATLAB & Simulink", price: 4000 },
  { title: "Simulink Model for Control Systems", category: "MATLAB & Simulink", price: 5500 },
  { title: "Custom MATLAB Scripting & Debugging", category: "MATLAB & Simulink", price: 2500 },
  { title: "Image Processing Algorithms in MATLAB", category: "MATLAB & Simulink", price: 4500 },
  { title: "Mathematical Modeling in Simulink", category: "MATLAB & Simulink", price: 6000 },
  { title: "MATLAB GUI/App Designer Development", category: "MATLAB & Simulink", price: 5000 },
  
  // Tutoring
  { title: "One-on-One Math Tutoring Session", category: "Tutoring", price: 1500 },
  { title: "High School Physics Online Teaching", category: "Tutoring", price: 1500 },
  { title: "University Calculus Tutoring", category: "Tutoring", price: 2000 },
  { title: "Engineering Physics Concepts Class", category: "Tutoring", price: 2500 },
  { title: "Programming Basics (Python/Java) Tutoring", category: "Tutoring", price: 2000 },
  
  // Completed Projects (Portfolio)
  { title: "IoT Smart Agriculture System (ESP32) - Completed Project", category: "Completed Projects", price: 15000 },
  { title: "Custom PCB for Drone Flight Controller - Completed Project", category: "Completed Projects", price: 12000 },
  { title: "Python Trading Bot Automation - Completed Project", category: "Completed Projects", price: 18000 },
  { title: "MATLAB Antenna Array Simulation - Completed Project", category: "Completed Projects", price: 8000 },
  { title: "E-Commerce Website Full-Stack - Completed Project", category: "Completed Projects", price: 25000 },
  { title: "3D Printed Robotic Arm CAD - Completed Project", category: "Completed Projects", price: 11000 },
  { title: "Java Inventory Management Software - Completed Project", category: "Completed Projects", price: 22000 },
  { title: "Home Automation Circuit Design - Completed Project", category: "Completed Projects", price: 9500 },
  { title: "Data Scraping Tool for Real Estate - Completed Project", category: "Completed Projects", price: 6500 },
  { title: "Advanced Simulink Motor Controller - Completed Project", category: "Completed Projects", price: 13500 },
];

async function seedServices() {
  console.log(`Preparing to seed ${mySkills.length} custom services...`);

  const items = mySkills.map(skill => {
    return {
      title: skill.title,
      author: "Engineer Yasin",
      description: `Premium professional service offered by Engineer Yasin. Specializing in ${skill.category}. Ensure high-quality, verified delivery, and exact requirement matching. Includes consultation, source files, and 1-on-1 support.`,
      category: skill.category,
      resource_type: "service",
      type: "premium",
      price: skill.price,
      // Generic icon mapping based on category
      cover_url: skill.category === "Programming" ? "https://logo.clearbit.com/github.com" :
                 skill.category === "Hardware & PCB" ? "https://logo.clearbit.com/arduino.cc" :
                 skill.category === "3D Modeling" ? "https://logo.clearbit.com/autodesk.com" :
                 skill.category === "MATLAB & Simulink" ? "https://logo.clearbit.com/mathworks.com" :
                 skill.category === "Completed Projects" ? "https://logo.clearbit.com/behance.net" :
                 "https://logo.clearbit.com/khanacademy.org",
      file_path: `https://wa.me/923342806970?text=I%20want%20to%20order%20the%20following%20service:%20${encodeURIComponent(skill.title)}`
    };
  });

  const { data, error } = await supabase.from('items').insert(items);
  if (error) {
    console.error("❌ Error inserting services:", error);
  } else {
    console.log(`✅ Successfully inserted ${items.length} services!`);
  }
}

seedServices();
