import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const questions = [
  { q: "Covalent compounds mostly exist in the form of:", opts: ["protons", "Atoms", "Molecules", "Neutron"], ans: 2 },
  { q: "The mass of the mole of iodine:", opts: ["53g", "75g", "127g", "245g"], ans: 2 },
  { q: "Nonmetals tend to again electrons, becoming:", opts: ["positively charged ions", "All of above", "Metal", "Negativity charged ions"], ans: 3 },
  { q: "Atoms and molecules can either again or lose electrons, forming charged particles called:", opts: ["Ions", "photons", "positrons", "Electrons"], ans: 0 },
  { q: "Plasma consists of:", opts: ["Neutral particles", "Negative electrons", "positive ions", "maxitur of all above"], ans: 3 },
  { q: "All gases can be compressed by:", opts: ["Decreasing pressure", "keeping constant pressure", "increasing pressure", "None of these"], ans: 2 },
  { q: "Alpha rays consists of:", opts: ["Helium nucleus", "Hydrogen", "protons", "Neutron"], ans: 0 },
  { q: "x-ray have same nature as:", opts: ["Gamma rays", "Alpha rays", "beta rays", "Cathode rays"], ans: 0 },
  { q: "Neutron was discovered by:", opts: ["plank", "Chadwick", "Rutherford", "bohr"], ans: 2 },
  { q: "wood spirit is the commercial name of?", opts: ["phenol", "ethanol", "methyl alcohol", "ethyl alcohol"], ans: 2 },
  { q: "Substance which are added to soil to provide nutrients to plants are called:", opts: ["fertilizers", "minerals", "pesticides", "growth hormone"], ans: 0 },
  { q: "SI unit of heat is:", opts: ["joule", "kilowatt hormone", "calorie", "BTU"], ans: 0 },
  { q: "properties of gases and liquids arem", opts: ["isomeric", "anisotropic", "isomorphic", "isotropic"], ans: 3 },
  { q: "Urea contains nitrogen?", opts: ["50%", "36%", "40%", "46%"], ans: 3 },
  { q: "Surface tension is measured in unit of?", opts: ["ergs", "Nm-1", "joule", "Nf"], ans: 1 },
  { q: "SAND formula is?", opts: ["Sio2", "NaCl", "CaCO3", "H2SO4"], ans: 0 },
  { q: "EMF of 3 dry cell?", opts: ["3.12", "1.5", "4.5", "6.0"], ans: 0 },
  { q: "which is covalent bond is?", opts: ["Water", "NaCl", "KCl", "MgCl2"], ans: 0 },
  { q: "which elements produce most global warming ?", opts: ["CO2", "O2", "N2", "H2"], ans: 0 },
  { q: "what SI not a sate function?", opts: ["Temperature", "Pressure", "Volume", "Work"], ans: 0 },
  { q: "A substance or a mixture undergoing a physical change is called:", opts: ["System", "Surrounding", "Boundary", "Universe"], ans: 0 },
  { q: "The SI unit of heat+energy is:", opts: ["Joule", "Watt", "Newton", "Pascal"], ans: 0 },
  { q: "Which is an inert gas?", opts: ["Nitrogen", "Oxygen", "Hydrogen", "Chlorine"], ans: 0 },
  { q: "The brown gas formed when metal reduces NHO3 is:", opts: ["NO2", "NO", "N2O", "N2O4"], ans: 0 },
  { q: "Water contain oxygen about:", opts: ["89%", "70%", "50%", "30%"], ans: 0 },
  { q: "Element with higher oxidation state form oxides:", opts: ["Acidic", "Basic", "Amphoteric", "Neutral"], ans: 0 },
  { q: "which term was derived from atoms?", opts: ["Atom", "Molecule", "Ion", "Element"], ans: 0 },
  { q: "Mineral oil is called?", opts: ["petroleum", "kerosene", "diesel", "gasoline"], ans: 0 },
  { q: "major components of natural gas is:", opts: ["Methane", "Ethane", "Propane", "Butane"], ans: 0 },
  { q: "A mixture of low boiling of hydrocarbons is:", opts: ["Natural gas", "Petroleum", "Coal", "Biogas"], ans: 0 },
  { q: "A substance having sigma and pi bond is it gives:", opts: ["Addition", "Substitution", "Elimination", "Rearrangement"], ans: 0 },
  { q: "Metallic conduction is also called as:", opts: ["Electronic condition", "Ionic condition", "Thermal condition", "Magnetic condition"], ans: 0 },
  { q: "Fuel cells are mostly used in space aircrafts as the source of:", opts: ["Drinking water and power", "Oxygen", "Hydrogen", "Nitrogen"], ans: 0 },
  { q: "First atomic theory was put forward by an english school teacher:", opts: ["John Dalton", "J.J Thomson", "Rutherford", "Niels Bohr"], ans: 0 },
  { q: "Covenant compounds mostly exist in the form of:", opts: ["Molecules", "Ions", "Atoms", "Radicals"], ans: 0 },
  { q: "Metals tends to lose electrons becoming:", opts: ["positively charged ions", "negatively charged ions", "neutral atoms", "free radicals"], ans: 0 },
  { q: "Swedish chemist J.Berzelius determined:", opts: ["Atomic mass", "Atomic number", "Electron configuration", "Isotopes"], ans: 0 },
  { q: "The branch of chemistry which deals with quantitative relationship between reactants and products in a balanced chemical equation is called:", opts: ["Stoichiometry", "Thermodynamics", "Kinetics", "Equilibrium"], ans: 0 },
  { q: "The mass of one mole of iodine:", opts: ["245g", "127g", "53g", "75g"], ans: 0 },
  { q: "At same temperature, the kinetic energy of one mole of each H2 and O2 separately by:", opts: ["Same", "Different", "Zero", "Infinite"], ans: 0 },
  { q: "Which of the following is the simple form of matter?", opts: ["Gaseous state", "Liquid state", "Solid state", "Plasma state"], ans: 0 },
  { q: "Electron was discoverd by:", opts: ["Michael Faraday", "JJ Thamson", "James Maxwell", "Yuri Gagarin"], ans: 1 },
  { q: "Sodium Carbonate is produced by....?", opts: ["Ammonia Solvay process", "Haber process", "Decons Process", "Lead Chamber process"], ans: 0 },
  { q: "All of the following substance are crystalline expert?", opts: ["Ice", "Diamond", "Plastics", "Sucrose"], ans: 2 },
  { q: "what is the mixture of potassium nitrate charcoal and sulphur called?", opts: ["Paint", "Glass", "Cement", "Gun Powder"], ans: 3 },
  { q: "Empirical fomula of chloroform is?", opts: ["CH2 C12", "CHCL3", "CH3 C1", "CC14"], ans: 1 },
  { q: "How many isotopes have odd Atomic number?", opts: ["86", "184", "280", "300"], ans: 0 },
  { q: "which of the following has the maximum number of isotopes?", opts: ["Oxygen", "Carbon", "Tin", "Chlorine"], ans: 2 },
  { q: "percentage of calcium in calcium carbonate is?", opts: ["80%", "30%", "50%", "40%"], ans: 3 },
  { q: "which one of the following is not the mono isotopic element?", opts: ["Arsenic", "Uranium", "Iodine", "Nickel"], ans: 1 },
  { q: "The nucleus of an atom always contains?", opts: ["Proton", "Neutron", "Electron", "None of these"], ans: 0 },
  { q: "Dalton's atomic theory given the concept of?", opts: ["Electrons", "Valency", "Ionization", "Radioactivity"], ans: 1 },
  { q: "Most of the known elements are?", opts: ["None metals", "Transition metals", "Metals", "None"], ans: 2 },
  { q: "On descending a group in periodic table electropositive character of elements?", opts: ["Remains same", "Fluctuate", "Decrease", "Increase"], ans: 3 },
  { q: "Who was first prepare sulphuric Acid?", opts: ["Aristotle", "Jabar Bin Hayan", "Dalton", "Bohr"], ans: 1 },
  { q: "Chemical Soap is?", opts: ["Salt", "Base", "Acid", "Gas"], ans: 1 }
];

async function run() {
  const QUIZ_SIZE = 30;
  const numQuizzes = Math.ceil(questions.length / QUIZ_SIZE);

  for (let i = 0; i < numQuizzes; i++) {
    const slice = questions.slice(i * QUIZ_SIZE, (i + 1) * QUIZ_SIZE);
    
    // Create Quiz
    const { data: quiz, error: quizError } = await supabase.from('quizzes').insert({
      title: `MDCAT Chemistry Practice Test ${i + 1}`,
      description: `Attempt this MDCAT Chemistry Practice Test. It contains ${slice.length} questions to evaluate your preparation for the Medical & Dental College Admission Test.`,
      category: 'mdcat'
    }).select().single();

    if (quizError) {
      console.error('Error creating quiz:', quizError);
      continue;
    }

    // Insert Questions
    const questionsToInsert = slice.map(q => ({
      quiz_id: quiz.id,
      question_text: q.q,
      options: q.opts,
      correct_option_index: q.ans
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
