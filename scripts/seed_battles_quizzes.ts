import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const rawText = `
Battle of Marathon
490 BC
Athenians and Persians. King Darius of Persia defeated.

Battle of Thermoplaye
480 BC
Spartans led by Leonidas and Persians led by Xerexes. Greeks
defeated.

Battle of Salamis
480 BC
Athenian fleet and Persian fleet in bay of Salamis; Persian fleet
defeated.

Battle of Platae
479 BC
Greek and Persians forces defeated.

Battle of Mycale
479 BC
Greek and Persian fleets; Persian fleet defeated.

Spartan War I (Peloponesian War)
459 BC
Sparta and Athens, lasted for 30 years.

Spartan War II
431 BC-421
Sparta and Athens; Spartans victorious.

Battle of Arabia
331 BC
Greek and Persian forces; Greeks victorious.

Battle of Magnesia
190 BC
Syrian and Roman forces; Syrian forces defeated (North-west Lydia).

Battle of Pharasalus
48 AD
Caesar defeated Pompey.

Battle of Hastings
1066
William, the Duck of Normandy defeated Harold, the king of England.
England came under the control of Normans.

Hundred- year War
1338-1453
Fought between France and England .

War of the Roses
1455-1485
Civil War in England; The Cause of the
War was a struggle for the throne o England between the two royal
houses of Lancaster and York.

Anglo-Spanish War (Spanish armada War)
1588
Spanish and England fleets fought in the England Channel

Battle of Gibraltar Way
1607
The Dutch defeated the Spanish and Portuguese.

Thirty-year War
1618-1648
Stated as religious-cum-political war
Between the Lutherans and Catholics in Germany

Civil War in England
1642-1649
Between Cavaliers (King Charles I supporters)and forces of
Parliament led by Oliver Cromwell, king Charles I executed .

Battle of Blenheim
1704
England and Austria headed by Marlborough defended France and Russia.

War of Austrian Succession
1740-1748
Queen of Austria, Maria Theresa
(daughter of Charles VII ) was Challenged by king Frederick II of Prussia.

Seven -Year War (Anglo-French War III)
1756-1763
Britain and France against Austria and
Prussia; the British alliance won.

Battle of the Nile
1798
British and French fleets, Britain victorious.

Battle of Trafolgar
1805
British fleet defeated fleets of France and Spain. British fleets were
commanded by Admiral Nelson, who was killed during the Battle.

Battle of Austerliz
1805
Britain , Austria ,Russia and Prussia .On side and France on the other. Napoleon (France)
defeated Austria and Russia.

Battle of Borodino
1812
Between France and Russia. Napolean invaded Russia at Borodino,
and nearly defeated the Russians.

Battle of Leipzing
1813
Germany and combined force of Austria, Prussia and Russia, Defeated Napolean.

Battle of Waterloo
1815
British forces and by Duke of Wellington (sir Arthur Wellesly)
defeated French forces led by Napolean. Napolean was Captured
and exiled to St. Helena where he died in 1821.

First Opium War
1840
China and Britain; Chinese yielded opium. It was a trade war.

Crimean War
1854-1856
The Combined forces of the British,
French and Turks defeated Russia.

American Civil War
1861-1865
Northern states of America under
Abraham Lincon defeated the Southern states and abolished the
slavery.

Sino- Japanese War
1894-1895
Japan Defeated China and occupied
Formosa and Korea.

Battle of Omdurman
1898
The British and Egyptian forces defeated
The forces of Khalifa (Mehdits).

Bear War
1899-1901
The revolt of Transvaal Boers was
Suppressed by the British forces.

Russo- Japanese War (Battle of Port Arthur& Battle of Yalu)
1904-1905
Russia and Japan in the sea of Japan.
Russia defeated; It led the wave of the idea of Asian Resurgence.

Balkan War I
1912
Turkey and Balkan countries (Montenegro, Serbia, Bulgaria and
Greece), Turkey defeated.

Balkan War II
1913
Invasion of Serbia and Greece by Bulgaria. Bulgaria was Defeated by
Combined forces of Serbia, Greece. Rumania, Montengro.

world War I
1914-1918
Central Power (Germany and its allies)
Against the Allied Power (Britain and its allies); Central power were defeated.

World War II
1939-1945
Axis Powers (Germany and its allies)
Against the Allied Power (Britain and its allies); Axis Power were defeated.
`;

function generateOptions(correctAnswer: string): string[] {
  const options = new Set<string>();
  options.add(correctAnswer);

  const allYears = [
    "490 BC", "480 BC", "479 BC", "459 BC", "431 BC-421", "331 BC", "190 BC", "48 AD", "1066", 
    "1338-1453", "1455-1485", "1588", "1607", "1618-1648", "1642-1649", "1704", "1740-1748", 
    "1756-1763", "1798", "1805", "1812", "1813", "1815", "1840", "1854-1856", "1861-1865", 
    "1894-1895", "1898", "1899-1901", "1904-1905", "1912", "1913", "1914-1918", "1939-1945"
  ];
  
  while (options.size < 4) {
    const randomYear = allYears[Math.floor(Math.random() * allYears.length)];
    if (randomYear !== correctAnswer) {
      options.add(randomYear);
    }
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
}

async function run() {
  const blocks = rawText.trim().split(/\n\s*\n/);
  const questionsList = [];

  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length >= 3) {
      const battleName = lines[0].trim();
      const date = lines[1].trim();
      const desc = lines.slice(2).join(' ').trim();
      
      const qText = `When was the ${battleName} fought? (${desc})`;
      const options = generateOptions(date);
      const correctIndex = options.indexOf(date);

      questionsList.push({
        question_text: qText,
        options: options,
        correct_option_index: correctIndex
      });
    }
  }

  console.log(`Parsed ${questionsList.length} questions.`);

  const QUIZ_SIZE = 20;
  const numQuizzes = Math.ceil(questionsList.length / QUIZ_SIZE);

  for (let i = 0; i < numQuizzes; i++) {
    const slice = questionsList.slice(i * QUIZ_SIZE, (i + 1) * QUIZ_SIZE);
    
    // Create Quiz
    const { data: quiz, error: quizError } = await supabase.from('quizzes').insert({
      title: `FPSC General Knowledge - World Battles ${i + 1}`,
      description: `Attempt this FPSC General Knowledge Quiz on World Famous Battles. It contains ${slice.length} questions and evaluates your history knowledge.`,
      category: 'fpsc'
    }).select().single();

    if (quizError) {
      console.error('Error creating quiz:', quizError);
      continue;
    }

    // Insert Questions
    const questionsToInsert = slice.map(q => ({
      quiz_id: quiz.id,
      question_text: q.question_text,
      options: q.options,
      correct_option_index: q.correct_option_index
    }));

    const { error: qError } = await supabase.from('quiz_questions').insert(questionsToInsert);
    
    if (qError) {
      console.error('Error inserting questions:', qError);
    } else {
      console.log(`Successfully created Quiz ${i + 1} with ${slice.length} questions.`);
    }
  }
}

run();
