import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const biologyText = `
1. Haemodialysis means cleaning of
(A) urine (B) blood (C) glomerular filterate (D) coelomic fluid

2. Production of sweat and sebum is related with
(A) skin (B) liver (C) lungs (D) GIT

3. The evaporative cooling in the respiratory tract of dogs is called
(A) vasodilation (B) vasoconstriction (C) panting (D) all of these

4. Which of the following pathogen type cause disease that can be treated with antibiotics
(A) bacteria (B) fungi (C) virus (D) none of these

5. Most cell membranes are composed principally of
(A) DNA ad protein (B) protein and lipids (C) protein and chitin (D) protein and RNA

6. Normally, in the process of osmosis, the net flow of water molecules into or out of the cell depends upon differences in the
(A) concentration of water molecules inside and outside the cell (B) concentration of enzymes on either side of the cell membrane (C) rate of molecular motion on either side of the cell membrane (D) none of these

7. Sodium ions are “pumped” from a region of lower concentration to a region of higher concentration in the nerve cells of humans. This process is an example of
(A) diffusion (B) passive transport (C) osmosis (D) active transport

8. Proteins are made from amino acids by the process of
(A) hydrolysis (B) pinocytosis (C) dehydration synthesis (D) active transport

9. Which is an organic compound found in most cells
(A) water (B) glucose (C) oxygen (D) sodium chloride

10. Which are the four most abundant elements in living cells
(A) carbon, oxygen, nitrogen, sulfur (B) carbon, oxygen, hydrogen, nitrogen (C) carbon, oxygen, sulfur, phosphorus (D) carbon, sulfur, hydrogen, magnesium

ANSWERS: BIOLOGY QUIZ
1. B 2. A 3. C 4. A 5. B 6. A 7. D 8. C 9. B 10. B
`;

const compText = `
1. The major language of World Wide Web is
(A) HTML (B) PHP (C) ASP.NET (D) Java

2. HTML is an abbreviation for?
(A) HiTech Meaningful Language (B) HyperText Meaningful Language (C) HiTech Markup Language (D) HyperText Markup Language

3. ----------- is a device from where the information is sent.
(A) Transmitter (B) Spreadsheet (C) Simulation (D) Modulation

4. ---------- is a mathematical model of a real system in the form of a computer program.
(A) Transmitter (B) Spreadsheet (C) Simulation (D) Modulation

5. LAN is an abbreviation for?
(A) Large Access Network (B) Local Access Network (C) Large Area Network (D) Local Area Network

6. In peer-to-peer networking,
(A) there is only one server and many clients (B) there is only one client and many servers (C) every computer is capable of playing the role of server (D) every computer is capable of playing the role of client, server or both at the same time

7. URL is an abbreviation for?
(A) Universal Resource Locator (B) Uniform Resource Locator (C) Universal Resource Location (D) Uniform Resource Location

8. The network in which we connect each node to the network along a single piece of network cable is called
(A) Bus Network Topology (B) Star Network Topology (C) Ring Network Topology (D) None of these

9. The network in which we connect each network node to a central device (hub) is called
(A) Bus Network Topology (B) Star Network Topology (C) Ring Network Topology (D) None of these

10. FTP is an abbreviation for?
(A) File Transfer Position (B) File Transfer Protection (C) File Transfer Protocol (D) File Transfer Possibility

ANSWERS: COMPUTER SCIENCE QUIZ
1. A
2. D
3. A
4. C
5. D
6. D
7. B
8. A
9. B
10. C
`;

function extractQuestions(rawText: string) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const questionsList: any[] = [];
  
  let currentQ: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(\d+)[\)\.]\s*(.+)/);
    
    if (match) {
      if (currentQ) {
         questionsList.push(currentQ);
      }
      currentQ = { id: parseInt(match[1]), q: match[2], opts: [] };
    } else if (currentQ && line.match(/^[a-eA-E][\)\.]|\([a-eA-E]\)/)) {
      // Options line
      let optsLine = line;
      let optMatches = [...optsLine.matchAll(/(?:\([a-eA-E]\)|[a-eA-E][\)\.])\s*(.+?)(?=\([a-eA-E]\)|[a-eA-E][\)\.]|$)/g)];
      if (optMatches.length > 0) {
         for (const m of optMatches) {
           currentQ.opts.push(m[1].trim());
         }
      }
    }
  }
  
  if (currentQ) questionsList.push(currentQ);

  // Extract answers
  const answers: any = {};
  for (const line of lines) {
    if (line.match(/^\d+\./) && line.includes(' ')) {
       const parts = line.split(/(?=\d+\.)/g);
       for (const p of parts) {
         const m = p.trim().match(/^(\d+)\.\s*([A-E])/i);
         if (m) {
           answers[parseInt(m[1])] = m[2].toLowerCase().charCodeAt(0) - 97;
         }
       }
    } else if (line.match(/^\d+\.\s*[A-E]/)) {
       const m = line.trim().match(/^(\d+)\.\s*([A-E])/i);
       if (m) {
         answers[parseInt(m[1])] = m[2].toLowerCase().charCodeAt(0) - 97;
       }
    }
  }
  
  // Fill answers
  for (const q of questionsList) {
    if (answers[q.id] !== undefined) {
      q.ans = answers[q.id];
    } else {
      q.ans = 0; // fallback
    }
  }
  
  return questionsList.filter(q => q.opts.length > 1);
}

async function run() {
  const categories = [
    { text: biologyText, cat: 'mdcat', title: 'Biology Practice Test 1', desc: 'Attempt this MDCAT Biology Practice Test.' },
    { text: compText, cat: 'fpsc', title: 'FPSC Computer Science Quiz', desc: 'Attempt this FPSC Computer Science Test.' }
  ];

  for (const item of categories) {
    const questionsList = extractQuestions(item.text);
    console.log(`Extracted ${questionsList.length} questions for ${item.title}.`);
    
    if (questionsList.length === 0) continue;

    // Create Quiz
    const { data: quiz, error: quizError } = await supabase.from('quizzes').insert({
      title: item.title,
      description: item.desc,
      category: item.cat
    }).select().single();

    if (quizError) {
      console.error('Error creating quiz:', quizError);
      continue;
    }

    // Insert Questions
    const questionsToInsert = questionsList.map(q => ({
      quiz_id: quiz.id,
      question_text: q.q,
      options: q.opts,
      correct_option_index: q.ans
    }));

    const { error: qError } = await supabase.from('quiz_questions').insert(questionsToInsert);
    
    if (qError) {
      console.error('Error inserting questions:', qError);
    } else {
      console.log(`Successfully created ${item.title} with ${questionsList.length} questions.`);
    }
  }
}

run();
