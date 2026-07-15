const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const quizzes = [
  {
    title: "PMA 159 Initial Academic Test - Part 1",
    category: "General Knowledge",
    description: "Part 1 of the Pakistan Military Academy 159 Initial Academic Test preparation.",
    questions: [
      { question_text: "Tenda dam was built in?", options: ["1960", "1968", "1975", "1980"], correct_option_index: 1 },
      { question_text: "Tarbela dam is located in?", options: ["Haripur, KPK", "Mirpur, AJK", "Swabi, KPK", "Attock, Punjab"], correct_option_index: 0 },
      { question_text: "Mangla dam is built on which river?", options: ["River Indus", "River Chenab", "River Jhelum", "River Ravi"], correct_option_index: 2 },
      { question_text: "The largest river in Pakistan is the?", options: ["Jhelum River", "Chenab River", "Indus River", "Sutlej River"], correct_option_index: 2 },
      { question_text: "Longest River of Asia is?", options: ["Yellow River", "Mekong", "Ganges", "Yangtze"], correct_option_index: 3 },
      { question_text: "Shortest river of the world?", options: ["Amazon River", "Roe River", "Nile River", "Thames River"], correct_option_index: 1 },
      { question_text: "The largest ocean is the?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], correct_option_index: 2 },
      { question_text: "World's smallest ocean is?", options: ["Indian Ocean", "Arctic Ocean", "Southern Ocean", "Atlantic Ocean"], correct_option_index: 1 },
      { question_text: "Deepest Ocean in the world is?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correct_option_index: 2 },
      { question_text: "The smallest country in the world is?", options: ["Monaco", "Nauru", "Vatican City", "San Marino"], correct_option_index: 2 },
      { question_text: "Which country has no capital?", options: ["Nauru", "Tuvalu", "Palau", "Marshall Islands"], correct_option_index: 0 },
      { question_text: "Which Country Is Called Rising Sun?", options: ["China", "Japan", "South Korea", "Thailand"], correct_option_index: 1 },
      { question_text: "Country with highest number of satellites?", options: ["Russia", "China", "America", "India"], correct_option_index: 2 },
      { question_text: "Who is the Chief Minister of Sindh?", options: ["Bilawal Bhutto", "Syed Murad Ali Shah", "Kamran Tessori", "Qaim Ali Shah"], correct_option_index: 1 },
      { question_text: "Who is the Chief Minister of KPK?", options: ["Mahmood Khan", "Ali Amin Khan Gandapur", "Pervez Khattak", "Akram Khan Durrani"], correct_option_index: 1 },
      { question_text: "Who is the Chief Minister of Punjab?", options: ["Hamza Shahbaz", "Maryam Nawaz Sharif", "Usman Buzdar", "Mohsin Naqvi"], correct_option_index: 1 },
      { question_text: "Who is the Chief Minister of Balochistan?", options: ["Jam Kamal Khan", "Abdul Quddus Bizenjo", "Sarfraz Bugti", "Sanaullah Zehri"], correct_option_index: 2 },
      { question_text: "Rann of Kutch is located in the province of:", options: ["Punjab", "Balochistan", "Sindh", "KPK"], correct_option_index: 2 },
      { question_text: "Pak vs India border name is:", options: ["Durand Line", "McMahon Line", "Radcliffe Line", "Line of Control"], correct_option_index: 2 },
      { question_text: "Border of India-China is called:", options: ["Durand Line", "McMahon Line", "Radcliffe Line", "Maginot Line"], correct_option_index: 1 },
      { question_text: "Border of Pak-Afghan is known as:", options: ["Durand Line", "Radcliffe Line", "Line of Control", "Curzon Line"], correct_option_index: 0 },
      { question_text: "Cube root of unity is?", options: ["0", "1", "-1", "infinity"], correct_option_index: 1 },
      { question_text: "Kitab ul umm was written by?", options: ["Imam Abu Hanifa", "Imam ash-Shafi'i", "Imam Malik", "Imam Ahmad"], correct_option_index: 1 },
      { question_text: "Zabur e ajam was written by?", options: ["Mirza Ghalib", "Allama Iqbal", "Faiz Ahmed Faiz", "Hafeez Jalandhari"], correct_option_index: 1 },
      { question_text: "Hayat e jawaid is written by?", options: ["Sir Syed Ahmed Khan", "Altaf hussain hali", "Shibli Nomani", "Deputy Nazir Ahmad"], correct_option_index: 1 },
      { question_text: "Who hosted Asian games first?", options: ["China", "Japan", "India", "South Korea"], correct_option_index: 2 },
      { question_text: "When did the Asian games start?", options: ["1948", "1951", "1954", "1960"], correct_option_index: 1 },
      { question_text: "Where is the Leaning Tower of Pisa?", options: ["France", "Italy", "Spain", "Greece"], correct_option_index: 1 },
      { question_text: "Hazrat Muhammad (PBUH) was born in:", options: ["Medina", "Mecca", "Taif", "Jerusalem"], correct_option_index: 1 },
      { question_text: "Who took care of Hazrat Muhammad (PBUH) in his childhood?", options: ["Hazrat Aminah", "Hazrat Halima", "Hazrat Khadija", "Hazrat Ayesha"], correct_option_index: 1 }
    ]
  },
  {
    title: "PMA 159 Initial Academic Test - Part 2",
    category: "General Knowledge",
    description: "Part 2 of the Pakistan Military Academy 159 Initial Academic Test preparation.",
    questions: [
      { question_text: "First wife of Hazrat Muhammad (PBUH) was:", options: ["Hazrat Ayesha", "Hazrat Khadija", "Hazrat Hafsa", "Hazrat Zainab"], correct_option_index: 1 },
      { question_text: "Height of K2 is?", options: ["8848 meter", "8611 meter", "8126 meter", "8586 meter"], correct_option_index: 1 },
      { question_text: "Another name of K2 is?", options: ["Mount Everest", "Nanga Parbat", "Godwin Austin", "Broad Peak"], correct_option_index: 2 },
      { question_text: "The logarithm of unity to any base is?", options: ["One", "Zero", "Infinity", "Base value"], correct_option_index: 1 },
      { question_text: "What is used for correct computations?", options: ["Geometry", "Logarithms", "Algebra", "Calculus"], correct_option_index: 1 },
      { question_text: "First martial law was imposed in:", options: ["1956", "1958", "1969", "1977"], correct_option_index: 1 },
      { question_text: "The biggest bird in the world is?", options: ["Eagle", "Ostrich", "Emu", "Penguin"], correct_option_index: 1 },
      { question_text: "The smallest bird in the world is?", options: ["Sparrow", "Hummingbird", "Robin", "Finch"], correct_option_index: 1 },
      { question_text: "The fastest bird in the world is?", options: ["Falcon", "Swift", "Eagle", "Hawk"], correct_option_index: 1 },
      { question_text: "Kiwi is associated with which country?", options: ["Australia", "New Zealand", "South Africa", "Fiji"], correct_option_index: 1 },
      { question_text: "Khilafat Movement started in:", options: ["1914", "1919", "1924", "1930"], correct_option_index: 1 },
      { question_text: "Deoband movement started in:", options: ["1857", "1866", "1875", "1885"], correct_option_index: 1 },
      { question_text: "Quit India Movement started on:", options: ["1940", "8 August 1942", "1945", "1947"], correct_option_index: 1 },
      { question_text: "Faraizi movement was started by?", options: ["Shah Waliullah", "Haji Shariatullah", "Syed Ahmed Barelvi", "Titumir"], correct_option_index: 1 },
      { question_text: "Civil Disobedience Movement was started in 1930 by:", options: ["Quaid-e-Azam", "Gandhi", "Nehru", "Allama Iqbal"], correct_option_index: 1 },
      { question_text: "First Round Table Conference date:", options: ["1928", "1930", "1931", "1932"], correct_option_index: 1 },
      { question_text: "When was the second round table conference held?", options: ["1930", "1931", "1932", "1933"], correct_option_index: 1 },
      { question_text: "Third Round Table Conference date:", options: ["1931", "1932", "1933", "1934"], correct_option_index: 1 },
      { question_text: "Capital of Malaysia is?", options: ["Jakarta", "Kuala Lumpur", "Bangkok", "Manila"], correct_option_index: 1 },
      { question_text: "The currency of Malaysia is the:", options: ["Rupiah", "Baht", "Ringgit", "Peso"], correct_option_index: 2 },
      { question_text: "The pass that connects Pakistan with China is the:", options: ["Khyber Pass", "Bolan Pass", "Khunjerab Pass", "Tochi Pass"], correct_option_index: 2 },
      { question_text: "Tirich Mir's height is approximately:", options: ["8,611 meters", "7,708 meters", "8,126 meters", "7,492 meters"], correct_option_index: 1 },
      { question_text: "Quaid-e-Azam's 14 Points were presented in:", options: ["1927", "1928", "March 28, 1929", "1930"], correct_option_index: 2 },
      { question_text: "The border between Pakistan and India in Kashmir is called:", options: ["LAC", "Line of Control (LoC)", "Durand Line", "Working Boundary"], correct_option_index: 1 },
      { question_text: "The border line between India and China is known as:", options: ["LoC", "Line of Actual Control (LAC)", "McMahon Line", "Radcliffe Line"], correct_option_index: 1 },
      { question_text: "Hajj takes place in the Islamic month of?", options: ["Ramadan", "Shawwal", "Dhu al-Qadah", "Dhu al-Hijjah"], correct_option_index: 3 },
      { question_text: "In northwest Pakistan, the major mountain range is:", options: ["Karakoram", "Himalayas", "Hindu Kush Range", "Sulaiman"], correct_option_index: 2 },
      { question_text: "'Friends, Not Masters' was written by:", options: ["Zulfiqar Ali Bhutto", "Muhammad Ayub Khan", "Pervez Musharraf", "Yahya Khan"], correct_option_index: 1 },
      { question_text: "According to the 1973 Constitution of Pakistan, the President is the head of:", options: ["Government", "State", "Parliament", "Armed Forces"], correct_option_index: 1 },
      { question_text: "Tipu Sultan was defeated by the British under the leadership of Lord:", options: ["Clive", "Cornwallis", "Wellesley", "Dalhousie"], correct_option_index: 1 }
    ]
  },
  {
    title: "PMA 159 Initial Academic Test - Part 3",
    category: "General Knowledge",
    description: "Part 3 of the Pakistan Military Academy 159 Initial Academic Test preparation.",
    questions: [
      { question_text: "We boil milk to kill:", options: ["Viruses", "Bacteria and pathogens", "Fungi", "Dust"], correct_option_index: 1 },
      { question_text: "We send children to school to:", options: ["Play", "Acquire knowledge", "Eat", "Sleep"], correct_option_index: 1 },
      { question_text: "The headquarters of the World Health Organization (WHO) is located in:", options: ["New York", "Geneva, Switzerland", "Paris", "London"], correct_option_index: 1 },
      { question_text: "'Pakistaniat' was written by:", options: ["Allama Iqbal", "Raza Rumi", "Faiz Ahmed Faiz", "Tariq Ali"], correct_option_index: 1 },
      { question_text: "Warsak Dam is located near Peshawar on which river?", options: ["Indus River", "Kabul River", "Swat River", "Kurram River"], correct_option_index: 1 },
      { question_text: "A prism typically has five sides:", options: ["Two circular bases", "Two triangular bases and three rectangular faces", "Four triangular faces", "Six rectangular faces"], correct_option_index: 1 },
      { question_text: "The word 'the' is defined as the:", options: ["indefinite article", "definite article", "pronoun", "verb"], correct_option_index: 1 },
      { question_text: "The first Asian Games were hosted by India in New Delhi in:", options: ["1947", "1951", "1955", "1960"], correct_option_index: 1 },
      { question_text: "Plants feed themselves through the process of:", options: ["respiration", "photosynthesis", "transpiration", "digestion"], correct_option_index: 1 },
      { question_text: "Amnesty International's headquarters is located in:", options: ["New York", "Geneva", "London, United Kingdom", "Paris"], correct_option_index: 2 },
      { question_text: "A famous Kashmiri poet is:", options: ["Mirza Ghalib", "Allama Muhammad Iqbal", "Faiz Ahmed Faiz", "Mir Taqi Mir"], correct_option_index: 1 },
      { question_text: "'Pakistan: A Hard Country' was written by:", options: ["Stanley Wolpert", "Anatol Lieven", "Ayesha Jalal", "Ian Talbot"], correct_option_index: 1 },
      { question_text: "The world's largest dam is the Three Gorges Dam in:", options: ["USA", "Russia", "China", "India"], correct_option_index: 2 },
      { question_text: "Book 'Mein Kampf' was written by:", options: ["Benito Mussolini", "Adolf Hitler", "Joseph Stalin", "Winston Churchill"], correct_option_index: 1 },
      { question_text: "Indus Water Treaty was made with the help of:", options: ["United Nations", "World Bank", "IMF", "Asian Development Bank"], correct_option_index: 1 },
      { question_text: "Founder of Dawn newspaper:", options: ["Sir Syed Ahmed Khan", "Quaid-e-Azam Muhammad Ali Jinnah", "Liaquat Ali Khan", "Allama Iqbal"], correct_option_index: 1 },
      { question_text: "World War 1 started in:", options: ["1910", "1914", "1918", "1939"], correct_option_index: 1 },
      { question_text: "Kargil War date is:", options: ["1965", "1971", "1999", "2001"], correct_option_index: 2 },
      { question_text: "First Cricket World Cup started in:", options: ["1971", "1975", "1979", "1983"], correct_option_index: 1 },
      { question_text: "Solar System was discovered by:", options: ["Galileo Galilei", "Isaac Newton", "Nicolaus Copernicus", "Johannes Kepler"], correct_option_index: 2 },
      { question_text: "Headquarter of IMF is in:", options: ["New York", "Washington D.C.", "Geneva", "London"], correct_option_index: 1 },
      { question_text: "The first assembly meeting of Pakistan was held under the leadership of:", options: ["Liaquat Ali Khan", "Quaid-e-Azam Muhammad Ali Jinnah", "Fatima Jinnah", "Ayub Khan"], correct_option_index: 1 },
      { question_text: "The Battle of Plassey took place on:", options: ["June 23, 1757", "1857", "1764", "1799"], correct_option_index: 0 },
      { question_text: "World War II ended on:", options: ["1943", "1944", "September 2, 1945", "1946"], correct_option_index: 2 },
      { question_text: "Which quadrant does the point (-2, 3) lie in?", options: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"], correct_option_index: 1 },
      { question_text: "What is the slope of a line with the equation y = 2x + 5?", options: ["2", "5", "-2", "0"], correct_option_index: 0 },
      { question_text: "What is the area of a rectangle with sides 4 cm and 7 cm?", options: ["11 cm", "14 cm", "28 cm", "56 cm"], correct_option_index: 2 },
      { question_text: "Length of Pak-China border is:", options: ["595 km", "1610 km", "2430 km", "2252 km"], correct_option_index: 0 },
      { question_text: "Highest peak of Hindukush range:", options: ["K2", "Tirch Mir", "Mount Everest", "Nanga Parbat"], correct_option_index: 1 },
      { question_text: "Pakistan won Olympic gold medal in Hockey for the first time in:", options: ["1948", "1956", "1960", "1964"], correct_option_index: 3 }
    ]
  }
];

async function seed() {
  console.log("Seeding quizzes...");
  for (const quiz of quizzes) {
    const { data: qData, error: qError } = await supabase
      .from('quizzes')
      .insert({
        title: quiz.title,
        category: quiz.category,
        description: quiz.description
      })
      .select()
      .single();

    if (qError) {
      console.error("Error inserting quiz:", qError);
      continue;
    }

    const questionsToInsert = quiz.questions.map(q => ({
      quiz_id: qData.id,
      question_text: q.question_text,
      options: q.options,
      correct_option_index: q.correct_option_index
    }));

    const { error: qtError } = await supabase
      .from('quiz_questions')
      .insert(questionsToInsert);

    if (qtError) {
      console.error("Error inserting questions:", qtError);
    } else {
      console.log(`Inserted: ${quiz.title} with ${questionsToInsert.length} questions.`);
    }
  }
  console.log("Done.");
}

seed();
