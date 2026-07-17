import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// ─────────────────────────────────────────────
// ENGLISH  (30 questions)
// ─────────────────────────────────────────────
const englishQuestions = [
  { q: "A person living permanently in a certain place.", opts: ["Resident", "Native", "Domicile", "Subject"], ans: 0 },
  { q: "Choose the correct spellings.", opts: ["Qoloquial", "Coloquial", "Colloqial", "Colloquial"], ans: 3 },
  { q: "My room is infested _________ insects.", opts: ["In", "On", "From", "With"], ans: 3 },
  { q: "The planes flew in formation _________ the fields.", opts: ["On", "Above", "At", "Over"], ans: 3 },
  { q: "Antonym of EXPAND is _____________?", opts: ["Congest", "Conclude", "Convert", "Condense"], ans: 3 },
  { q: "Write the synonym of 'admonish'?", opts: ["defeat", "defend", "destroy", "counsel"], ans: 3 },
  { q: "Synonym of word Luscious:", opts: ["Loathe", "Succulent", "Abet", "Unappetizing"], ans: 1 },
  { q: "Synonym of abhor?", opts: ["love", "hate", "prefer", "admire"], ans: 1 },
  { q: "The Collins Dictionary's word of the year for 2022 is: __________?", opts: ["Moribund", "Vax", "permacrisis", "Succulent"], ans: 2 },
  { q: "Can you repair _____ computer in Liam's office? It's not working.", opts: ["a", "the", "an", "none of these"], ans: 1 },
  { q: "Everyone who works in this department uses ___________ computer.", opts: ["a", "the", "an", "none of these"], ans: 0 },
  { q: "'Xenzia' is the synonym of __________?", opts: ["Extrovert", "Reserved", "Outspoken", "Gregarious"], ans: 1 },
  { q: "Bring forward means?", opts: ["Produce", "Show up", "Clarify", "None of These"], ans: 0 },
  { q: "Antonym of ARTIFICIAL is ______________?", opts: ["Vice", "Quality", "Asset", "Purity"], ans: 3 },
  { q: "Change the voice 'Set the thief to catch the thief'.", opts: ["Let the thief to catch the thief", "Let the thief be set to catch the thief", "Thief is set to catch the thief", "None of These"], ans: 1 },
  { q: "A black and white cow ________ grazing in the field.", opts: ["is", "are", "were", "None of These"], ans: 0 },
  { q: "He is _________ doctor.", opts: ["a", "an", "the", "no article"], ans: 0 },
  { q: "We gave _________a meal.", opts: ["at the visitors", "for the visitors", "the visitors", "None of These"], ans: 2 },
  { q: "The idiom donkey's year means _________?", opts: ["Very Short period", "Very long period", "Both", "None"], ans: 1 },
  { q: "She was sitting ________her mother.", opts: ["Beside", "Along", "With", "None of These"], ans: 0 },
  { q: "I am satisfied ________ his performance.", opts: ["With", "By", "On", "None of these"], ans: 0 },
  { q: "Idiom of 'Smell A Rat'?", opts: ["To reveal secrets", "To suspect that something is wrong", "Talking nonsense", "To get momentum in a job"], ans: 1 },
  { q: "Alice is _______ at the flowers in the garden.", opts: ["Seeing", "Looking", "Watching", "Washing"], ans: 1 },
  { q: "What is the synonym of Anxiety?", opts: ["to be depressed", "Angry", "worried", "None of These"], ans: 2 },
  { q: "Select the word which is spelled correctly?", opts: ["pedagogical", "pediagogical", "pedagogcial", "padegogical"], ans: 0 },
  { q: "Synonyme of Garbage is _________?", opts: ["Level", "Standing", "Grade", "Trash"], ans: 3 },
  { q: "He is ________ home.", opts: ["in", "by", "at", "with"], ans: 2 },
  { q: "The shopkeeper sells sweets made ______ pure milk.", opts: ["of", "by", "with", "from"], ans: 3 },
  { q: "This chair is made______ wood.", opts: ["with", "of", "from", "by"], ans: 1 },
  { q: "Choose the antonym of Birth?", opts: ["Death", "End", "Conclusion", "All of the above"], ans: 0 },
]

// ─────────────────────────────────────────────
// BIOLOGY  (30 questions)
// ─────────────────────────────────────────────
const biologyQuestions = [
  { q: "Tibia is a bone found in the ____________?", opts: ["Skull", "Arm", "Leg", "Face"], ans: 2 },
  { q: "Which is the largest gland in the human body?", opts: ["Thyroid", "Liver", "Pancreas", "None of these"], ans: 1 },
  { q: "Water has maximum density at____________?", opts: ["0°C", "4°C", "4° K", "4.8°C"], ans: 1 },
  { q: "The scientific study of livings is called?", opts: ["Anatomy", "Biology", "Geology", "Zoology"], ans: 1 },
  { q: "The word 'BIOLOGY' has been derived from_________ word?", opts: ["Latin", "English", "Greek", "French"], ans: 2 },
  { q: "According to modern system of taxonomy, living organisms have been classified into?", opts: ["Three Kingdoms", "Five Kingdoms", "Two Kingdoms", "Six Kingdoms"], ans: 1 },
  { q: "Kingdom Protoctista includes____________?", opts: ["Fungi", "Prokaryotes", "protists", "Plantae"], ans: 2 },
  { q: "Kingdom Fungi includes_______________?", opts: ["Acellular, eukaryotic organisms", "Non-chlorophylls, multicellular eukaryotic organisms", "Non-chlorophylls, multicellular, thallophytic organisms", "both B and C"], ans: 3 },
  { q: "Earthworm is included in_____________?", opts: ["Kingdom Plantae", "Kingdom Protoctista", "Kingdom Monera", "Kingdom Animalia"], ans: 3 },
  { q: "The Study of organisms inhabiting the sea and Ocean is:", opts: ["Social Biology", "Marine Biology", "Environmental Biology", "Fresh Water Biology"], ans: 1 },
  { q: "The interphase of meiosis lacks the stage?", opts: ["G1", "S", "G2", "All of these"], ans: 2 },
  { q: "Which is not recycled in the ecosystem?", opts: ["Wind", "Carbon", "Oxygen", "Energy"], ans: 3 },
  { q: "Which is important for screening input information before they reach higher brain centers?", opts: ["Pons", "Cranium", "Reticular formation", "Amygdala"], ans: 2 },
  { q: "Endocrine system consists of how many Endocrine glands/tissues?", opts: ["59", "29", "78", "20"], ans: 1 },
  { q: "Gonorrhoea is caused by ________?", opts: ["Gram + bacteria", "Gram – bacteria", "Chalko Virus", "Treponema palladium"], ans: 1 },
  { q: "Nuclein is in its nature?", opts: ["Basic", "Acidic", "Both", "None of these"], ans: 1 },
  { q: "Medulla oblongata and pons are collectively called _________?", opts: ["Brain stem", "Brain base", "Brain root", "None of These"], ans: 0 },
  { q: "The number of naturally occurring chemical elements involved in biochemical reaction is?", opts: ["126", "86", "92", "206"], ans: 2 },
  { q: "Which is not a category of classification in biology?", opts: ["ecotype", "Species", "Genus", "Order"], ans: 0 },
  { q: "Which bonds are broken during oxidation reduction reaction?", opts: ["C-H", "C-N", "C-O", "C-S"], ans: 0 },
  { q: "_______ bacterial disease affects Eye?", opts: ["Trachoma", "Rickets", "Osteoporosis", "Gum disease"], ans: 0 },
  { q: "All of the following can treat kidney Stone Except?", opts: ["Medicine", "Surgery", "Lithotripsy", "Dialysis"], ans: 3 },
  { q: "The human sperm was first discovered by ___________?", opts: ["Anton van Leeuwenhoek", "Von Baer", "Robert Hook", "None of These"], ans: 0 },
  { q: "Which structure gives ability to the bacterial cell to form biofilm?", opts: ["Slime", "Mesosomes", "Capsule", "Flagella"], ans: 0 },
  { q: "In humans no of tetrads formed during mitosis is __________?", opts: ["23", "46", "0", "None of These"], ans: 2 },
  { q: "The scientific name of cat is _________?", opts: ["Felis", "Ficus", "Homo", "Tigris"], ans: 0 },
  { q: "Path of Blood present in vessels called __________?", opts: ["Capillaries", "Lumen", "Platelets", "Plasma"], ans: 1 },
  { q: "Average heart beat of Adult Human?", opts: ["60 to 100", "70 to 100", "50 to 100", "80 to 100"], ans: 0 },
  { q: "Study of impact of extra-terrestrial environments on organisms belonging to earth is?", opts: ["Ecology", "Cosmology", "Exobiology", "None of These"], ans: 2 },
  { q: "How many bio elements constitute 99% of the total human body?", opts: ["8", "4", "6", "None of These"], ans: 2 },
]

// ─────────────────────────────────────────────
// CHEMISTRY  (30 questions)
// ─────────────────────────────────────────────
const chemistryQuestions = [
  { q: "Which of the following gases is the main cause of acid rain?", opts: ["CO", "NO2", "both a & b", "none of the above"], ans: 2 },
  { q: "Which of the following factors help to measure quality of water?", opts: ["DO", "BOD", "COD", "all of the above"], ans: 3 },
  { q: "A single chlorine free radical can destroy how many ozone molecules?", opts: ["10", "100", "10000", "100000"], ans: 3 },
  { q: "Chlorination of water may be harmful if the water contains_________________?", opts: ["Ammonia", "Dissolved oxygen", "Carbon dioxide", "All"], ans: 0 },
  { q: "Which of the following is used as water disinfectant to avoid the formation of toxic compounds?", opts: ["Cl2", "O3", "ClO2", "both B & C"], ans: 3 },
  { q: "Ozone hole is substantial depletion of ozone every year during__________________?", opts: ["Aug – Nov", "Sep – Nov", "Nov – Dec", "Dec – Jan"], ans: 1 },
  { q: "Which of the following solutions of H2SO4 is more concentrated?", opts: ["1 Molar solution", "1 molal solution", "1 normal solution", "all have same concentration"], ans: 1 },
  { q: "Which of the following is an example of liquid in gas solution?", opts: ["Opals", "Dust particles in smoke", "Paints", "Fog"], ans: 3 },
  { q: "Which of the following are the conditions of colligative properties?", opts: ["Non-electrolyte solute", "Non-volatile solute", "Dilute solution", "All of the above"], ans: 3 },
  { q: "When common salt is dissolved in water?", opts: ["Boiling point of water decreases", "Boiling point of water increases", "Boiling point of water remains same", "None of the above"], ans: 1 },
  { q: "Homogeneous mixture of two or more than two compounds is called__________________?", opts: ["solution", "compound", "radical", "ion"], ans: 0 },
  { q: "Solution with maximum concentration of solute at given temperature is called________________?", opts: ["Super saturated solution", "unsaturated solution", "saturated solution", "dilute solution"], ans: 2 },
  { q: "Number of moles in 1 kg of solvent is called_________________?", opts: ["normality", "molarity", "molality", "mole fraction"], ans: 2 },
  { q: "In partially miscible liquids the two layers are___________________?", opts: ["saturated solutions of each liquid", "unsaturated solutions of each liquid", "normal solution of each liquid", "no layer formation takes place"], ans: 0 },
  { q: "The relative lowering of vapour pressure is_____________________?", opts: ["equal to the mole fraction of solvent", "equal to the mole fraction of solute", "directly proportional to the mole fraction of solute", "both B & C"], ans: 3 },
  { q: "Mixtures which distill over without change in composition are called___________________?", opts: ["zeotropic mixture", "azeotropic mixture", "amphoteric mixture", "ideal solution"], ans: 1 },
  { q: "Solubility of KClO3 gives__________________?", opts: ["continuous and falling solubility curve", "discontinuous and falling solubility curve", "continuous and rising solubility curve", "discontinuous and rising solubility curve"], ans: 2 },
  { q: "Boiling point elevations can be measured by__________________?", opts: ["Beckmanns method", "Landsbergers method", "Linds method", "none of the above"], ans: 1 },
  { q: "The compounds in which water molecules are added are called_______________?", opts: ["Hydrated ions", "double salts", "hydrates", "complexes"], ans: 2 },
  { q: "Solution of Na2SO4 will be_________________?", opts: ["basic", "acidic", "neutral", "cannot be predicted without data"], ans: 2 },
  { q: "1 molar solution of glucose in water contains weight of glucose________________?", opts: ["180g/dm3", "170g/dm3", "190g/dm3", "195g/dm3"], ans: 0 },
  { q: "Water of crystallization can be removed by________________?", opts: ["drying", "heating", "evaporation", "All of the above"], ans: 3 },
  { q: "Which one of the following salt does not hydrolyze________________?", opts: ["Na2SO4", "AlCl3", "CuSO4", "NH4Cl"], ans: 0 },
  { q: "Which of the following unit of concentration is independent of temperature?", opts: ["Molarity", "Molality", "Mole fraction", "all"], ans: 1 },
  { q: "The molal boiling point constant is the ratio of the elevation of boiling point to____________________?", opts: ["Molarity", "Molality", "Mole fraction of solvent", "Mole fraction of solute"], ans: 1 },
  { q: "Which has the minimum freezing point?", opts: ["One Molal NaCl", "One molal KCl solution", "One molal CaCl2", "One molal urea solution"], ans: 2 },
  { q: "Which of the following substance does not show continuous solubility curve?", opts: ["KClO4", "Na2SO4.10H2O", "K2Cr2O7", "PbCl2"], ans: 1 },
  { q: "Every sample of matter with uniform properties and fixed composition is called_________________?", opts: ["solute", "solvent", "solution", "phase"], ans: 3 },
  { q: "The component of solution which is in smaller amount is called_________________?", opts: ["solvent", "solute", "phase", "ion"], ans: 1 },
  { q: "10ml of alcohol dissolves in 90ml of water, unit of concentration used is________________?", opts: ["% w/w", "% w/v", "% v/v", "% v/w"], ans: 2 },
]

// ─────────────────────────────────────────────
// PHYSICS  (30 questions)
// ─────────────────────────────────────────────
const physicsQuestions = [
  { q: "A bird sitting on a high tension electric wire does not get electrocuted because:", opts: ["it has high resistance", "the body is earthed", "it does not form a closed path for the flow of current", "its feet are good insulators"], ans: 2 },
  { q: "A person wears spectacles with concave lenses. The image of distant objects is focused:", opts: ["behind the retina", "in front of the retina", "on the retina", "on the blind spot"], ans: 1 },
  { q: "CGS system of units is also called __________?", opts: ["Metric system", "Metric or French system of units", "Metric or British system of units", "None of these"], ans: 1 },
  { q: "The power is the dot product of ___________ quantities.", opts: ["Force and time", "Force and velocity", "Force and speed", "None of these"], ans: 1 },
  { q: "Kirchhoff's 2nd rule is related to: ___________?", opts: ["IR Drops", "Battery emf", "junction voltages", "both IR Drops and Battery emf"], ans: 3 },
  { q: "Matter itself has energy called ________?", opts: ["Potential energy", "Rest energy", "Chemical energy", "Nuclear energy"], ans: 1 },
  { q: "The unit of force in CGS system is __________?", opts: ["Newton", "Pound", "Dyne", "None of these"], ans: 2 },
  { q: "Mohs scale is used to measure ____________?", opts: ["Hardness", "Humidity", "Pressure", "Temperature"], ans: 0 },
  { q: "Two coherent sources of light produce destructive interference when the phase difference between them is _________?", opts: ["π", "2π", "π/2", "π/4"], ans: 0 },
  { q: "The distance between any two consecutive nodes or antinodes in a stationary wave is _________?", opts: ["λ", "λ/2", "λ/4", "λ/8"], ans: 1 },
  { q: "Tesla is the unit for measuring:", opts: ["Magnetic intensity", "Magnetic moment", "Magnetic induction", "None of the above"], ans: 2 },
  { q: "Neutron was discovered by: _________?", opts: ["Chadwick", "Rutherford", "Neil Bohr", "Einstein"], ans: 0 },
  { q: "The synopsis of Einstein's equation E = mc² is that:", opts: ["The faster you move, the lighter you get", "The faster you move, the heavier you get", "The slower you move, the heavier you get", "None of the above"], ans: 1 },
  { q: "A___________has no size or shape, just position.", opts: ["line", "bottom", "point", "vertex"], ans: 2 },
  { q: "Force 100N is applied on a wire producing extension 5mm. Energy stored in it is:", opts: ["0.125 J", "0.250 J", "0.50 J", "1 J"], ans: 1 },
  { q: "The unit of power is _________?", opts: ["watt", "Joule", "Newton", "Pascal"], ans: 0 },
  { q: "Newton's first law of motion gives the concept of _________?", opts: ["Energy", "Work", "Inertia", "Momentum"], ans: 2 },
  { q: "In addition to the daughter nucleus, the products of a beta decay include:", opts: ["Neutrons", "Neutrino", "Alpha particle", "Proton"], ans: 1 },
  { q: "Frequency is the inverse of __________?", opts: ["Velocity", "Stress", "Time Period", "Gravity"], ans: 2 },
  { q: "Field particle of Electromagnetic interaction is _________?", opts: ["Photon", "Meson", "Vector Boson", "Graviton"], ans: 0 },
  { q: "The value of acceleration due to gravity is minimum on which planet?", opts: ["Mars", "Jupiter", "Mercury", "Neptune"], ans: 2 },
  { q: "Which of the following are not deflected by electric and magnetic fields?", opts: ["Alpha rays", "Beta rays", "Gamma rays", "None of these"], ans: 2 },
  { q: "Why does a needle of iron swim on water surface when kept gently?", opts: ["It displaces more water than its weight", "the density of needle is less than that of water", "due to surface tension", "due to its shape"], ans: 2 },
  { q: "Rain drops fall from great height. Which statement is true?", opts: ["they fall with different ultimate velocities for different droplets", "they fall with same ultimate velocity", "velocity increases; fall with different velocity on earth", "velocity increases; fall with same velocity on earth"], ans: 0 },
  { q: "Which of the following statements is true when we see 'rainbow'?", opts: ["We face sun and raindrops", "The Sun remains behind us and we face raindrops", "In light rainfall, we face Sun", "The sky remains clear and the sun is at lower position"], ans: 1 },
  { q: "The audio signals of TV are _____________?", opts: ["Amplitude modulated", "Frequency modulated", "fixed modulated", "Velocity modulated"], ans: 1 },
  { q: "The owl can see most clearly in total darkness because:", opts: ["it has squint eyes", "it has light bulbs in its eyes", "it produces infrasonic sounds", "it has large eyes with orbs directed forward, giving binocular sight"], ans: 3 },
  { q: "A photostat machine works on _____________?", opts: ["electromagnetic image making", "magnetic image making", "thermal image making", "electrostatic image making"], ans: 3 },
  { q: "To measure the speed of an approaching car a police officer shines?", opts: ["light waves on it", "microwaves on it", "radio waves on it", "ultra high frequency waves on it"], ans: 1 },
  { q: "Rainbow is seen after rain because hanging molecules of water act as __________?", opts: ["Lens", "Prism", "Mirror", "Slabs"], ans: 1 },
]

// ─────────────────────────────────────────────
// QUIZ DEFINITIONS  – category IDs matching site
// ─────────────────────────────────────────────
const quizBatches = [
  {
    title: 'English Language Practice Test',
    description: 'Attempt this English Language Practice Test covering vocabulary, grammar, idioms, synonyms & antonyms. Suitable for PMA, PAF, Navy and all armed forces exams.',
    category: 'armed-forces',
    questions: englishQuestions,
  },
  {
    title: 'Biology Practice Test',
    description: 'Attempt this Biology Practice Test covering human body systems, classification, genetics and ecology. Suitable for MDCAT, NUMS and related entry tests.',
    category: 'mdcat',
    questions: biologyQuestions,
  },
  {
    title: 'Chemistry Practice Test',
    description: 'Attempt this Chemistry Practice Test covering solutions, concentration units, colligative properties and environmental chemistry. Suitable for MDCAT and related entry tests.',
    category: 'mdcat',
    questions: chemistryQuestions,
  },
  {
    title: 'Physics Practice Test',
    description: 'Attempt this Physics Practice Test covering mechanics, optics, electromagnetism, nuclear physics and waves. Suitable for armed forces and MDCAT entry tests.',
    category: 'armed-forces',
    questions: physicsQuestions,
  },
]

async function run() {
  for (const batch of quizBatches) {
    console.log(`\n▶  Creating quiz: ${batch.title}`)

    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        title: batch.title,
        description: batch.description,
        category: batch.category,
      })
      .select()
      .single()

    if (quizError) {
      console.error(`✗ Failed to create quiz "${batch.title}":`, quizError.message)
      continue
    }

    const questionsToInsert = batch.questions.map((q) => ({
      quiz_id: quiz.id,
      question_text: q.q,
      options: q.opts,
      correct_option_index: q.ans,
    }))

    const { error: qError } = await supabase
      .from('quiz_questions')
      .insert(questionsToInsert)

    if (qError) {
      console.error(`✗ Failed to insert questions for "${batch.title}":`, qError.message)
    } else {
      console.log(`✔  Created "${batch.title}" with ${batch.questions.length} questions (category: ${batch.category})`)
    }
  }

  console.log('\n✅  All done!')
}

run()
