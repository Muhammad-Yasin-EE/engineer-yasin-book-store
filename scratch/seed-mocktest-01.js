const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const englishQuestions = [
  { question_text: "A person living permanently in a certain place.", options: ["Resident", "Native", "Domicile", "Subject"], correct_option_index: 2 },
  { question_text: "Choose the correct spellings.", options: ["Qoloquial", "Coloquial", "Colloqial", "Colloquial"], correct_option_index: 3 },
  { question_text: "My room is infested _________ insects.", options: ["In", "On", "From", "With"], correct_option_index: 3 },
  { question_text: "The planes flew in formation _________ the fields.", options: ["On", "Above", "At", "Over"], correct_option_index: 3 },
  { question_text: "Antonym of EXPAND is _____________?", options: ["Congest", "Conclude", "Convert", "Condense"], correct_option_index: 3 },
  { question_text: "Write the synonym of “admonish”?", options: ["defeat", "defend", "destroy", "counsel"], correct_option_index: 3 },
  { question_text: "Synonym of word Luscious:", options: ["Loathe", "Succulent", "Abet", "Unappetizing"], correct_option_index: 1 },
  { question_text: "Synonym of abhor?", options: ["love", "hate", "prefer", "admire"], correct_option_index: 1 },
  { question_text: "The Collins Dictionary’s word of the year for 2022 is: __________?", options: ["Moribund", "Vax", "permacrisis", "Succulent"], correct_option_index: 2 },
  { question_text: "Can you repair _____ compter in Liam’s office? It’s not working.", options: ["a", "the", "an", "none of these"], correct_option_index: 1 },
  { question_text: "Everyone who works in this department uses ___________ computer.", options: ["a", "the", "an", "none of these"], correct_option_index: 0 },
  { question_text: "“Xenzia” is the synonym of __________?", options: ["Extrovert", "Reserved", "Outspoken", "Gregarious"], correct_option_index: 1 },
  { question_text: "Bring forward means?", options: ["Produce", "Show up", "Clarify", "None of These"], correct_option_index: 0 },
  { question_text: "Antonym of ARTIFICIAL is ______________?", options: ["Vice", "Quality", "Asset", "Natural"], correct_option_index: 3 },
  { question_text: "Change the voice “Set the thief to catch the thief”.", options: ["Let the thief to catch the thief", "Let the thief be set to catch the thief", "Thief is set to catch the thief", "None of These"], correct_option_index: 1 },
  { question_text: "A black and white cow ________ grazing in the field.", options: ["is", "are", "were", "None of These"], correct_option_index: 0 },
  { question_text: "He is _________ doctor.", options: ["a", "an", "the", "no article"], correct_option_index: 0 },
  { question_text: "We gave _________a meal.", options: ["at the visitors", "for the visitors", "the visitors", "None of These"], correct_option_index: 2 },
  { question_text: "The idiom donkey’s year means _________?", options: ["Very Short period", "Very long period", "Both", "None"], correct_option_index: 1 },
  { question_text: "She was sitting ________her mother.", options: ["Beside", "Along", "With", "None of These"], correct_option_index: 0 },
  { question_text: "I am satisfied ________ his performance.", options: ["With", "By", "On", "None of these"], correct_option_index: 0 },
  { question_text: "idiom of “Smell A Rat” ?", options: ["To reveal secrets", "To suspect that something is wrong", "Talking nonsense", "To get momentum in a job"], correct_option_index: 1 },
  { question_text: "Alice is _______ at the flowers in the garden.", options: ["Seeing", "Looking", "Watching", "Washing"], correct_option_index: 1 },
  { question_text: "What is the synonym of Anxiety?", options: ["to be depressed", "Angry", "worried", "None of These"], correct_option_index: 2 },
  { question_text: "Select the word which is spelled correctly?", options: ["pedagogical", "pediagogical", "pedagogcial", "padegogical"], correct_option_index: 0 },
  { question_text: "Synonym of Garbage is _________?", options: ["Level", "Standing", "Grade", "Trash"], correct_option_index: 3 },
  { question_text: "He is ________ home.", options: ["in", "by", "at", "with"], correct_option_index: 2 },
  { question_text: "The shopkeeper sells sweets made ______ pure milk.", options: ["of", "by", "with", "from"], correct_option_index: 3 },
  { question_text: "This chair is made______ wood.", options: ["with", "of", "from", "by"], correct_option_index: 1 },
  { question_text: "Choose the antonym of Birth?", options: ["Death", "End", "Conclusion", "All of the above"], correct_option_index: 0 }
];

const biologyQuestions = [
  { question_text: "Tibia is a bone found in the ____________?", options: ["Skull", "Arm", "Leg", "Face"], correct_option_index: 2 },
  { question_text: "Which is the largest gland in the human body?", options: ["Thyroid", "Liver", "Pancreas", "None of these"], correct_option_index: 1 },
  { question_text: "Water has maximum density at____________?", options: ["0°C", "4°C", "4° K", "4.8°C"], correct_option_index: 1 },
  { question_text: "The scientific study of livings is called?", options: ["Anatomy", "Biology", "Geology", "Zoology"], correct_option_index: 1 },
  { question_text: "The word “BIOLOGY” has been derived from_________ word?", options: ["Latin", "English", "Greek", "French"], correct_option_index: 2 },
  { question_text: "According to modern system of taxonomy, living organisms have been classified into?", options: ["Three Kingdoms", "Five Kingdoms", "Two Kingdoms", "Six Kingdoms"], correct_option_index: 1 },
  { question_text: "Kingdom Protoctista includes____________?", options: ["Fungi", "Prokaryotes", "Protists", "Plantae"], correct_option_index: 2 },
  { question_text: "Kingdom Fungi includes_______________?", options: ["A cellular, eukaryotic organisms", "Non-chlorophylls, multicellular eukaryotic organisms", "Non-chlorophylls, multicellular, thallophytic organisms", "both B and C"], correct_option_index: 3 },
  { question_text: "Earthworm is included in_____________?", options: ["Kingdom Plantae", "Kingdom Protoctista", "Kingdom Monera", "Kingdom Animalia"], correct_option_index: 3 },
  { question_text: "The Study of organisms inhabiting the sea and Ocean and the physical and chemical characteristics of their environment is:", options: ["Social Biology", "Marine Biology", "Environmental Biology", "Fresh Water Biology"], correct_option_index: 1 },
  { question_text: "The interphase of meiosis lacks the stage?", options: ["G1", "S", "G2", "All of these"], correct_option_index: 1 },
  { question_text: "Which is not recycled in the ecosystem?", options: ["Wind", "Carbon", "Oxygen", "Energy"], correct_option_index: 3 },
  { question_text: "Which is important for screening the input information, before they reach the higher brain centers?", options: ["Pons", "Cranium", "Reticular formation", "Amygdala"], correct_option_index: 2 },
  { question_text: "Endocrine system consists of some/how _______ Endocrine glands /tissues.", options: ["59", "29", "78", "20"], correct_option_index: 3 },
  { question_text: "Gonorrhoea is caused by ________?", options: ["Gram + bacteria", "Gram – bacteria", "Chalko Virus", "Treponema palladium"], correct_option_index: 1 },
  { question_text: "Nuclein is in its nature?", options: ["Basic", "Acidic", "Both", "None of these"], correct_option_index: 1 },
  { question_text: "Medulla oblongata and pons are collectively called _________?", options: ["Brain stem", "Brain base", "Brain root", "None of These"], correct_option_index: 0 },
  { question_text: "The number of naturally occurring chemical elements involved in biochemical reaction is", options: ["126", "86", "92", "206"], correct_option_index: 2 },
  { question_text: "Which is not a category of classification in biology.", options: ["ecotype", "Species", "Genus", "Order"], correct_option_index: 0 },
  { question_text: "Which bonds are broken during oxidation reduction reaction.", options: ["C-H", "C-N", "C-O", "C-S"], correct_option_index: 0 },
  { question_text: "_______ bacterial disease affects Eye?", options: ["Trachoma", "Rickets", "Osteoporosis", "Gum disease"], correct_option_index: 0 },
  { question_text: "All Of the following Can Treat kidney Stone Except?", options: ["Medicine", "Surgery", "Lithotripsy", "Dialysis"], correct_option_index: 3 },
  { question_text: "The human sperm was first discovered by ___________?", options: ["Anton van Leeuwenhoek", "Von Baer", "Robert Hook", "None of These"], correct_option_index: 0 },
  { question_text: "Which structure gives ability to the bacterial cell to form biofilm?", options: ["Slime", "Mesosomes", "Capsule", "Flagella"], correct_option_index: 0 },
  { question_text: "In humans no of tetrads formed during mitosis is __________?", options: ["23", "46", "0", "None of These"], correct_option_index: 2 },
  { question_text: "The scientific name of cat is _________?", options: ["Felis", "Ficus", "Homo", "Tigris"], correct_option_index: 0 },
  { question_text: "Path of Blood present in vessels called __________?", options: ["Capillaries", "Lumen", "Platelets", "Plasma"], correct_option_index: 1 },
  { question_text: "Average of heart beat of Adult Human?", options: ["60 to 100", "70 to 100", "50 to 100", "80 to 100"], correct_option_index: 1 },
  { question_text: "Study of impact of extra-terrestrial environments on organisms belonging to earth is component of", options: ["Ecology", "Cosmology", "Exobiology", "None of These"], correct_option_index: 2 },
  { question_text: "How many of the bio elements constituent 99% of the total human body?", options: ["8", "4", "6", "None of These"], correct_option_index: 2 }
];

const chemistryQuestions = [
  { question_text: "Which of the following gases is the main cause of acid rain ?", options: ["CO", "NO2", "both a & b", "none of the above"], correct_option_index: 1 },
  { question_text: "Which of the following factors help to measure quality of water ?", options: ["DO", "BOD", "COD", "all of the above"], correct_option_index: 3 },
  { question_text: "A single chlorine free radical can destroy how many ozone molecules ?", options: ["10", "100", "10000", "100000"], correct_option_index: 3 },
  { question_text: "Chlorination of water may be harmful if the water contains_________________?", options: ["Ammonia", "Dissolved oxygen", "Carbon dioxide", "All"], correct_option_index: 0 },
  { question_text: "Which of the following is used as water disinfectant to avoid the formation of toxic compounds_________________?", options: ["Cl2", "O3", "ClO2", "both B & C"], correct_option_index: 3 },
  { question_text: "Ozone hole is substantial depletion of ozone in every year during__________________?", options: ["Aug – Nov", "Sep – Nov", "Nov – Dec", "Dec – Jan"], correct_option_index: 1 },
  { question_text: "Which of the following solutions of H2SO4 is more concentrated ?", options: ["1 Molar solution", "1 molal solution", "1 normal solution", "all have same concentration"], correct_option_index: 0 },
  { question_text: "Which of the following is an example of liquid in gas solution?", options: ["Opals", "Dust particles in smoke", "Paints", "Fog"], correct_option_index: 3 },
  { question_text: "Which of the following are the conditions of colligative properties_______________?", options: ["Non-electrolyte solute", "Non-volatile solute", "Dilute solution", "All of the above"], correct_option_index: 3 },
  { question_text: "When common salt is dissolved in water ?", options: ["Boiling point of water decrease", "Boiling point of water increase", "Boiling point of water remains same", "None of the above"], correct_option_index: 1 },
  { question_text: "Homogeneous mixture of two or more than two compounds is called__________________?", options: ["solution", "compound", "radical", "ion"], correct_option_index: 0 },
  { question_text: "Solution with maximum concentration of solute at given temperature is called________________?", options: ["Super saturated solution", "unsaturated solution", "saturated solution", "dilute solution"], correct_option_index: 2 },
  { question_text: "Number of moles in 1 kg of solvent is called_________________?", options: ["normality", "molarity", "molality", "mole fraction"], correct_option_index: 2 },
  { question_text: "In partially miscible liquids the two layers are___________________?", options: ["saturated solutions of each liquid", "unsaturated solutions of each liquid", "normal solution of each liquid", "no layer formation takes place"], correct_option_index: 0 },
  { question_text: "The relative lowering of vapour pressure is_____________________?", options: ["equal to the mole fraction of solvent", "equal to the mole fraction of solute", "directly proportional to the mole fraction of solute", "both B & C"], correct_option_index: 3 },
  { question_text: "Mixtures which distill over without change in composition called___________________?", options: ["zeotropic mixture", "azeotropic mixture", "amphoteric mixture", "ideal solution"], correct_option_index: 1 },
  { question_text: "Solubility of KClO3 gives__________________?", options: ["continuous and falling solubility curve", "discontinuous and falling solubility curve", "continuous and rising solubility curve", "discontinuous and rising solubility curve"], correct_option_index: 2 },
  { question_text: "Boiling point elevations can be measured by__________________?", options: ["Beckmanns method", "Landsbergers method", "Linds method", "none of the above"], correct_option_index: 1 },
  { question_text: "The compounds in which water molecules are added are called_______________?", options: ["Hydrated ions", "double salts", "hydrates", "complexes"], correct_option_index: 2 },
  { question_text: "Solution of Na2SO4 will be_________________?", options: ["basic", "acidic", "neutral", "cannot be predicted without data"], correct_option_index: 2 },
  { question_text: "1 molar solution of glucose in water contains weight of glucose________________?", options: ["180g/dm3", "170g/dm3", "190g/dm3", "195g/dm3"], correct_option_index: 0 },
  { question_text: "Water of crystallization can be removed by________________?", options: ["drying", "heating", "evaporation", "All of the above"], correct_option_index: 1 },
  { question_text: "Which one of the following salt does not hydrolyzed________________?", options: ["Na2SO4", "AlCl3", "CuSO4", "NH4Cl"], correct_option_index: 0 },
  { question_text: "Which of the following unit of concentration is independent of temperature ?", options: ["Molarity", "Molality", "Mole fraction", "all"], correct_option_index: 1 },
  { question_text: "The molal boiling point constant is the ration of the elevation of boiling point to____________________?", options: ["Molarity", "Molality", "More fraction of solvent", "Mole fraction of solute"], correct_option_index: 1 },
  { question_text: "Which has the minimum freezing point ?", options: ["One Molal NaCl", "One molal KCl solution", "One molal CaCl2", "One molal urea solution"], correct_option_index: 2 },
  { question_text: "Which of the following substance do not show continuous solubility curve ?", options: ["KClO4", "Na2SO4. 10H2O", "K2Cr2O7", "PbCl2"], correct_option_index: 1 },
  { question_text: "Every sample of matter with uniform properties and fixed composition is called_________________?", options: ["solute", "solvent", "solution", "phase"], correct_option_index: 3 },
  { question_text: "The component of solution which is in smaller amount is called_________________?", options: ["solvent", "solute", "phase", "ion"], correct_option_index: 1 },
  { question_text: "10ml of alcohol dissolve in 90ml of water unit of concentration used is________________?", options: ["% w/w", "% w/v", "% v/v", "% v/w"], correct_option_index: 2 }
];

const physicsQuestions = [
  { question_text: "A bird sitting on a high tension electric wire does not get electrocuted because:", options: ["It has high resistance", "the body is earthed", "it does not form a closed path for the flow of current", "its feet are good insulators"], correct_option_index: 2 },
  { question_text: "A person wears spectacles with concave lenses. It means that normally (when not using glasses), the image of distant objects is focused in his eyes:", options: ["behind the retina", "in front of the retina", "on the retina", "on the blind spot"], correct_option_index: 1 },
  { question_text: "CGS system of units is also called __________?", options: ["Metric system", "Metric or French system of units", "Metric or British system of units", "None of these"], correct_option_index: 1 },
  { question_text: "The power is the dot product of ___________ quantities.", options: ["Force and time", "Force and velocity", "Force and speed", "None of these"], correct_option_index: 1 },
  { question_text: "Kirchhoff’s 2nd rule is related to: ___________?", options: ["IR Drops", "Battery emf", "junction voltages", "both “1” and “2”"], correct_option_index: 3 },
  { question_text: "Matter itself has energy called ________?", options: ["Potential energy", "Rest energy", "Chemical energy", "Nuclear energy"], correct_option_index: 1 },
  { question_text: "The unit of force in CGS, system is __________?", options: ["Newton", "Pound", "Dyne", "None of these"], correct_option_index: 2 },
  { question_text: "Mohs scale is used for to measure ____________?", options: ["Hardness", "Humidity", "Pressure", "Temperature"], correct_option_index: 0 },
  { question_text: "Two coherent sources of light produce interference (destructive) when the phase difference between them is _________?", options: ["π", "2π", "π/2", "π/4"], correct_option_index: 0 },
  { question_text: "The distance between any two consecutive nodes or antinodes in a stationary wavelength (λ) is _________?", options: ["λ", "λ/2", "λ/4", "λ/8"], correct_option_index: 1 },
  { question_text: "Tesla is the unit for measuring:", options: ["Magnetic intensity", "Magnetic moment", "Magnetic induction", "None of the above"], correct_option_index: 2 },
  { question_text: "Neutron was discovered by: _________?", options: ["Chadwick", "Rutherford", "Neil Bohr", "Einstein"], correct_option_index: 0 },
  { question_text: "The synopsis of Einstein’s equation E = mc² is that", options: ["The faster you move, the lighter you get", "The faster you move, the heavier you get", "The slower you move, the heavier you get", "None of the above"], correct_option_index: 1 },
  { question_text: "A___________has no size or shape, just position.", options: ["line", "bottom", "point", "vertex"], correct_option_index: 2 },
  { question_text: "Force 100N is applied on a wire produces extension 5mm in it. Energy stored in it is", options: ["0.125 J", "0.250 J", "0.50 J", "1 J"], correct_option_index: 1 },
  { question_text: "The unit of power is _________?", options: ["watt", "Joule", "Newton", "Pascal"], correct_option_index: 0 },
  { question_text: "Newton’s first law of motion gives the concept of _________?", options: ["Energy", "Work", "Inertia", "Momentum"], correct_option_index: 2 },
  { question_text: "In addition to the daughter nucleus and an electron or positron, the products of a beta decay", options: ["Neutrons", "Neutrino", "Alpha particle", "Proton"], correct_option_index: 1 },
  { question_text: "Frequency is the inverse of __________?", options: ["Velocity", "Stress", "Time Period", "Gravity"], correct_option_index: 2 },
  { question_text: "Field particle of Electromagnetic interaction is _________?", options: ["Photon", "Meson", "Vector Boson", "Graviton"], correct_option_index: 0 },
  { question_text: "The value of acceleration due to gravity is minimum on which of these planets?", options: ["Mars", "Jupiter", "Mercury", "Neptune"], correct_option_index: 2 },
  { question_text: "Which of the following are not deflected by electric and magnetic fields ?", options: ["Alpha rays", "Beta rays", "Gamma rays", "None of these"], correct_option_index: 2 },
  { question_text: "Why the needle of iron swims on water surface when it is kept gently ?", options: ["It will remain under the water, when it will displace more water than its weight", "the density of needle is less than that of water", "due to surface tension", "due to its shape"], correct_option_index: 2 },
  { question_text: "Rain drops fall from great height Which among the following statements is true regarding it?", options: ["they fall with that ultimate velocity, which are different for different droplets", "they fall with same ultimate velocity", "their velocity increases and they fall with different velocity on the earth", "their velocity increases and they fall with same velocity on the earth"], correct_option_index: 0 },
  { question_text: "Which of the following statements is true when we see ‘rainbow’ ?", options: ["We face sun and raindrops", "The Sun remains behind us and we face raindrops", "In light rainfall, we face Sun", "The sky remains clear and the sun is at lower position in the sky"], correct_option_index: 1 },
  { question_text: "The audio signals of TV are _____________?", options: ["Amplitude modulated", "Frequency modulated", "fixe modulated", "Velocity modulated"], correct_option_index: 1 },
  { question_text: "The owl can see most clearly in total darkness because:", options: ["it has squint eyes", "it has light bulbs in its eyes provided by nature", "it produces infrasonic sounds", "it has large eyes with orbs directed forward, giving it binocular sight"], correct_option_index: 3 },
  { question_text: "A photostat machine works on _____________?", options: ["electromagnetic image making", "magnetic image making", "thermal image making", "electrostatic image making"], correct_option_index: 3 },
  { question_text: "To measure the speed of an approaching car a police officer shines?", options: ["light waves on it", "microwaves on it", "radio waves on it", "ultra high frequency waves on it"], correct_option_index: 1 },
  { question_text: "Rainbow is seen after rain because of hanging molecules of water which act as __________?", options: ["Lens", "Prism", "Mirror", "Slabs"], correct_option_index: 1 }
];

const quizzes = [
  // English Practice Tests
  {
    title: "Armed Forces English Practice Test 1",
    category: "armed-forces",
    description: "English section of AFNS + PN Cadet + PAF + LCC Practice Test 1. 30 questions covering grammar, vocabulary, spellings, synonyms, and antonyms.",
    questions: englishQuestions
  },
  {
    title: "AFNS English Practice Test 1",
    category: "mdcat",
    description: "English section of AFNS Practice Test 1. 30 questions covering grammar, vocabulary, spellings, synonyms, and antonyms.",
    questions: englishQuestions
  },
  // Biology Practice Tests
  {
    title: "Armed Forces Biology Practice Test 1",
    category: "armed-forces",
    description: "Biology section of AFNS + LCC Practice Test 1. 30 questions covering cell biology, taxonomy, biochemistry, and human physiology.",
    questions: biologyQuestions
  },
  {
    title: "AFNS Biology Practice Test 1",
    category: "mdcat",
    description: "Biology section of AFNS Practice Test 1. 30 questions covering cell biology, taxonomy, biochemistry, and human physiology.",
    questions: biologyQuestions
  },
  // Chemistry Practice Tests
  {
    title: "Armed Forces Chemistry Practice Test 1",
    category: "armed-forces",
    description: "Chemistry section of AFNS + PN Cadet + PAF + LCC Practice Test 1. 30 questions covering solutions, environmental chemistry, and stoichiometry.",
    questions: chemistryQuestions
  },
  {
    title: "AFNS Chemistry Practice Test 1",
    category: "mdcat",
    description: "Chemistry section of AFNS Practice Test 1. 30 questions covering solutions, environmental chemistry, and stoichiometry.",
    questions: chemistryQuestions
  },
  // Physics Practice Tests
  {
    title: "Armed Forces Physics Practice Test 1",
    category: "armed-forces",
    description: "Physics section of AFNS + PN Cadet + PAF + LCC Practice Test 1. 30 questions covering mechanics, wave motion, and modern physics.",
    questions: physicsQuestions
  },
  {
    title: "AFNS Physics Practice Test 1",
    category: "mdcat",
    description: "Physics section of AFNS Practice Test 1. 30 questions covering mechanics, wave motion, and modern physics.",
    questions: physicsQuestions
  }
];

async function seed() {
  console.log("Seeding practice quizzes...");
  for (const quiz of quizzes) {
    // Check if a quiz with the same title already exists in that category to avoid duplicates
    const { data: existingQuizzes, error: checkError } = await supabase
      .from('quizzes')
      .select('id')
      .eq('title', quiz.title)
      .eq('category', quiz.category);

    if (checkError) {
      console.error(`Error checking duplicate for ${quiz.title}:`, checkError);
      continue;
    }

    let quizId;
    if (existingQuizzes && existingQuizzes.length > 0) {
      console.log(`Quiz already exists: ${quiz.title} in ${quiz.category}. Deleting old questions to re-seed...`);
      quizId = existingQuizzes[0].id;
      
      const { error: deleteError } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('quiz_id', quizId);

      if (deleteError) {
        console.error(`Error deleting old questions for quiz ${quizId}:`, deleteError);
        continue;
      }
    } else {
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
        console.error(`Error inserting quiz ${quiz.title}:`, qError);
        continue;
      }
      quizId = qData.id;
    }

    const questionsToInsert = quiz.questions.map(q => ({
      quiz_id: quizId,
      question_text: q.question_text,
      options: q.options,
      correct_option_index: q.correct_option_index
    }));

    const { error: qtError } = await supabase
      .from('quiz_questions')
      .insert(questionsToInsert);

    if (qtError) {
      console.error(`Error inserting questions for ${quiz.title}:`, qtError);
    } else {
      console.log(`Successfully seeded: "${quiz.title}" with ${questionsToInsert.length} questions in category "${quiz.category}".`);
    }
  }
  console.log("Seeding complete.");
}

seed();
