// lib/data/armedForcesData.ts
// Complete eligibility, selection process, and info for all 16 Armed Forces commissions

export interface SelectionStep {
  step: number
  title: string
  desc: string
}

export interface ExamInfo {
  title: string
  branch: 'Pakistan Army' | 'Pakistan Air Force' | 'Pakistan Navy'
  branchSlug: 'army' | 'paf' | 'navy'
  commissionType: string
  overview: string
  quickFacts: { label: string; value: string }[]
  eligibility: string[]
  selectionProcess: SelectionStep[]
  training: string
  commission: string
  officialUrl: string
  quizCategory: string // Supabase category to fetch quizzes
  quizSearchTerms: string[] // Partial titles to match quizzes
}

export const armedForcesData: Record<string, ExamInfo> = {

  // ─── PAKISTAN ARMY ────────────────────────────────────────────────────────

  'pma-long-course': {
    title: 'PMA Long Course',
    branch: 'Pakistan Army',
    branchSlug: 'army',
    commissionType: 'Permanent Commission',
    overview: 'The flagship route to a Permanent Commission in the Pakistan Army. Selected candidates undergo 2-year training at Pakistan Military Academy (PMA) Kakul, Abbottabad, and are commissioned as Second Lieutenants across all Army arms and services.',
    quickFacts: [
      { label: 'Age', value: '17 – 25 years' },
      { label: 'Education', value: 'FSc / Equivalent (55%)' },
      { label: 'Training', value: '2 Years at PMA Kakul' },
      { label: 'Gender', value: 'Male Only' },
    ],
    eligibility: [
      'Pakistani citizen or AJK/GB domicile holder',
      'Must be unmarried (exception for serving military personnel over 20 years of service)',
      'Age: FSc holders 17–22 yrs | Graduates 17–24 yrs | Serving soldiers up to 25 yrs',
      'Minimum 55% marks in FSc/Intermediate or equivalent (Hope Certificate accepted)',
      'Minimum height: 5\'4" (162.5 cm)',
      'Good vision: 6/6 with or without glasses',
      'Weight proportionate to height (per BMI standards)',
      'Must pass initial physical fitness test (1.6km run, push-ups, sit-ups, chin-ups)',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpakarmy.gov.pk during the announced window. Upload documents and fill in bio-data.' },
      { step: 2, title: 'Intelligence Test', desc: 'Verbal and non-verbal reasoning test at Army Selection & Recruitment Centres (AS&RCs).' },
      { step: 3, title: 'Physical Fitness Test', desc: '1.6km run, push-ups, sit-ups, chin-ups, and ditch crossing at the AS&RC.' },
      { step: 4, title: 'Initial Medical Examination', desc: 'Full medical check-up at the AS&RC to verify physical and health standards.' },
      { step: 5, title: 'ISSB (4–5 Days)', desc: 'Inter Services Selection Board: psychological tests, group tasks, outdoor activities, and Deputy President interview.' },
      { step: 6, title: 'Final Medical Board', desc: 'Comprehensive medical at a Combined Military Hospital (CMH).' },
      { step: 7, title: 'Final Selection (GHQ)', desc: 'Merit list compiled by General Headquarters. Successful candidates receive joining instructions.' },
    ],
    training: '2 years (4 terms of 6 months each) at PMA Kakul, Abbottabad',
    commission: 'Second Lieutenant',
    officialUrl: 'https://www.joinpakarmy.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['pma-long-course'],
  },

  'lcc': {
    title: 'LCC (Lady Cadet Course)',
    branch: 'Pakistan Army',
    branchSlug: 'army',
    commissionType: 'Permanent Commission',
    overview: 'The Lady Cadet Course is the women\'s commission pathway into the Pakistan Army, open to female graduates in technical and professional fields including Engineering, Computer Sciences, IT, and other specializations announced per course.',
    quickFacts: [
      { label: 'Age', value: 'Up to 28 years' },
      { label: 'Education', value: '16-yr Degree (2.5 CGPA)' },
      { label: 'Training', value: '~1 Year at PMA Kakul' },
      { label: 'Gender', value: 'Female Only' },
    ],
    eligibility: [
      'Pakistani citizen (including AJK/GB); dual nationals must renounce foreign nationality',
      'Must be unmarried',
      'Age: Up to 28 years',
      'Minimum 16 years of education (Bachelor\'s or Master\'s degree)',
      'Fields: Software/Electrical/Biomedical Engineering, Computer Sciences, IT, etc. (per advertisement)',
      'Minimum CGPA: 2.5/4.0 or 62.5% (annual system)',
      'No 3rd division or Grade D throughout academic career',
      'HEC/PEC-recognized degree only',
      'Minimum height: 5\'0" (152.4 cm)',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpakarmy.gov.pk during the announced window.' },
      { step: 2, title: 'Written / Intelligence Tests', desc: 'Conducted at AS&RCs — verbal and non-verbal reasoning plus academic subjects.' },
      { step: 3, title: 'Preliminary Medical Examination', desc: 'Initial health and physical assessment at the AS&RC.' },
      { step: 4, title: 'ISSB (4–5 Days)', desc: 'Full ISSB assessment: psychological tests, group tasks, outdoor activities, and interview.' },
      { step: 5, title: 'Final Medical Examination', desc: 'Detailed medical at a Combined Military Hospital.' },
      { step: 6, title: 'Final Selection (GHQ)', desc: 'Merit list compiled by GHQ. Joining instructions issued to selected candidates.' },
    ],
    training: 'Approximately 1 year at PMA Kakul alongside relevant long course',
    commission: 'Second Lieutenant',
    officialUrl: 'https://www.joinpakarmy.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['lcc'],
  },

  'dssc': {
    title: 'DSSC (Direct Short Service Commission)',
    branch: 'Pakistan Army',
    branchSlug: 'army',
    commissionType: 'Short Service Commission',
    overview: 'The Direct Short Service Commission brings specialized professionals — engineers, lawyers, educators, IT experts, veterinarians, and psychologists — into the Pakistan Army as officers for a fixed tenure, allowing the Army to benefit from civilian expertise.',
    quickFacts: [
      { label: 'Age', value: 'Up to 28–35 years' },
      { label: 'Education', value: '16-yr Degree (60% / 2.5 CGPA)' },
      { label: 'Training', value: '6 Months at PMA Kakul' },
      { label: 'Gender', value: 'Male (Female for select branches)' },
    ],
    eligibility: [
      'Pakistani citizen (AJK/GB included); dual nationals must surrender foreign citizenship',
      'Married or unmarried (varies per advertisement)',
      'Age: Generally up to 28 years; up to 35 years for Veterinary (RV&FC)',
      'Minimum 16 years education from HEC/PEC-recognized university',
      'Science subjects: Min. 60% or 2.5 CGPA | Arts subjects: Min. 50% or 2.0 CGPA',
      'No 3rd division/Grade D; maximum one 2nd division/Grade C throughout academic career',
      'Must have been a regular (not private) student',
      'Common branches: Army Education Corps (AEC), JAG (Law), RV&FC (Veterinary), ICT, Psychology',
      'Minimum height: 5\'4" (162.5 cm)',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpakarmy.gov.pk during the announced period.' },
      { step: 2, title: 'Written / Intelligence Tests', desc: 'Academic and reasoning tests at AS&RCs relevant to the branch applied for.' },
      { step: 3, title: 'Physical Fitness Test', desc: '1.6km run, push-ups, sit-ups, chin-ups at the AS&RC.' },
      { step: 4, title: 'Initial Medical Examination', desc: 'Health assessment at AS&RC.' },
      { step: 5, title: 'ISSB', desc: 'Full ISSB evaluation over 4–5 days.' },
      { step: 6, title: 'Final Medical Board', desc: 'Comprehensive medical at CMH.' },
      { step: 7, title: 'Final Selection (GHQ)', desc: 'GHQ compiles merit list; selected candidates receive joining instructions.' },
    ],
    training: '6 months at PMA Kakul',
    commission: 'Lieutenant (short service tenure: 2–5 years, extendable)',
    officialUrl: 'https://www.joinpakarmy.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['dssc'],
  },

  'tcc': {
    title: 'TCC (Technical Cadet Course)',
    branch: 'Pakistan Army',
    branchSlug: 'army',
    commissionType: 'Permanent Commission',
    overview: 'The Technical Cadet Course is an engineering-focused permanent commission pathway. Candidates complete a full 4-year engineering degree at NUST-affiliated military colleges, followed by 1-year military training at PMA Kakul. Commissioned as Captains — one rank higher than the Long Course.',
    quickFacts: [
      { label: 'Age', value: '17 – 21 years' },
      { label: 'Education', value: 'FSc Pre-Eng (65%)' },
      { label: 'Training', value: '5 Years (Degree + PMA)' },
      { label: 'Gender', value: 'Male Only' },
    ],
    eligibility: [
      'Pakistani citizen',
      'Must be unmarried',
      'Age: 17–21 years',
      'FSc (Pre-Engineering): Minimum 65% marks',
      'ICS accepted only for Computer Software Engineering track (min. 65%)',
      'A-Levels: Physics + Mathematics + Chemistry/Computer Studies/CS (Grades A–C)',
      'Hope Certificate accepted if FSc Part-I marks ≥ 65%',
      'Minimum height: 5\'4" (162.5 cm)',
      'Weight proportionate to height (per BMI)',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpakarmy.gov.pk during the announced period.' },
      { step: 2, title: 'Computerized Intelligence & Academic Tests', desc: 'Engineering-focused tests at AS&RCs: Physics, Mathematics, and reasoning.' },
      { step: 3, title: 'Physical Fitness Test & Initial Medical', desc: 'Fitness and health assessment at AS&RC.' },
      { step: 4, title: 'Initial Interview Panel', desc: 'Personality and academic aptitude interview at the AS&RC.' },
      { step: 5, title: 'ISSB (4–5 Days)', desc: 'Full ISSB evaluation: psychological, group tasks, outdoor activities, interview.' },
      { step: 6, title: 'Final Medical Board', desc: 'Comprehensive medical at CMH.' },
      { step: 7, title: 'Final Selection (GHQ)', desc: 'GHQ merit list; selected candidates proceed to engineering colleges.' },
    ],
    training: '4 years engineering degree at NUST-affiliated college + 1 year at PMA Kakul = 5 years total',
    commission: 'Captain (one rank higher than PMA Long Course graduates)',
    officialUrl: 'https://www.joinpakarmy.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['tcc'],
  },

  'afns': {
    title: 'AFNS (Army Nursing Service)',
    branch: 'Pakistan Army',
    branchSlug: 'army',
    commissionType: 'Permanent / Short Service Commission',
    overview: 'Army Field Nursing Service offers two pathways for women: a 4-year BSc Nursing Permanent Commission for fresh candidates, and a Short Service Commission for qualified registered nurses. Commissioned nurses serve in military hospitals across Pakistan.',
    quickFacts: [
      { label: 'Age', value: '17–25 (BSc) | 18–28 (SSC)' },
      { label: 'Education', value: 'FSc Pre-Medical 50% or Nursing Diploma' },
      { label: 'Training', value: '4 Yrs BSc / Short SSC Training' },
      { label: 'Gender', value: 'Female Only' },
    ],
    eligibility: [
      'Pakistani citizen (including AJK/GB)',
      'BSc Nursing (PC): Unmarried or Widow/Separated/Divorced; Age 17–25',
      'Trained Nurse (SSC): Married or unmarried; Age 18–28',
      'BSc entry: Matric (Science) min. 60% + FSc (Pre-Medical) min. 50%',
      'Trained Nurse entry: Nursing Diploma & Midwifery OR BSc Nursing; PNC-registered',
      'Hope Certificate accepted for BSc entry if FSc Part-I passed with min. 50%',
      'Minimum height: 5\'0" (152.4 cm)',
      'Weight proportionate to height (per BMI)',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration / Walk-In', desc: 'Apply at joinpakarmy.gov.pk or walk-in at nearest AS&RC during advertisement period.' },
      { step: 2, title: 'Written / Intelligence Test', desc: 'Biology, Chemistry, Physics, English + verbal/non-verbal reasoning.' },
      { step: 3, title: 'Physical & Medical Examination', desc: 'Health and physical assessment at AS&RCs.' },
      { step: 4, title: 'GHQ Selection Board Interview', desc: 'Personality and academic interview conducted by a GHQ panel.' },
      { step: 5, title: 'Final Merit List (GHQ)', desc: 'Compiled by GHQ; successful candidates receive nursing college admission or training orders.' },
    ],
    training: 'BSc Nursing: 4 years at Army Nursing Colleges | Trained Nurse SSC: Specialized orientation training',
    commission: 'Lieutenant (upon completion); 10-year service bond',
    officialUrl: 'https://www.joinpakarmy.gov.pk',
    quizCategory: 'mdcat',
    quizSearchTerms: ['afns'],
  },

  'soldier': {
    title: 'Soldier (General Duty)',
    branch: 'Pakistan Army',
    branchSlug: 'army',
    commissionType: 'Enlisted (Non-Commissioned)',
    overview: 'The standard enlisted entry into the Pakistan Army as a foot soldier across various arms, services, and trades. Soldiers form the backbone of the Army and serve in combat, technical, and administrative roles at regimental centers nationwide.',
    quickFacts: [
      { label: 'Age', value: '17½ – 23 years' },
      { label: 'Education', value: 'Matriculation (SSC)' },
      { label: 'Training', value: '6 Months at Regimental Center' },
      { label: 'Gender', value: 'Male Only' },
    ],
    eligibility: [
      'Pakistani citizen (including AJK/GB)',
      'Must be unmarried',
      'Age: 17½ to 23 years (relaxations available for graduates, Shuhada children, and Balochistan/FATA/GB candidates)',
      'Minimum Matriculation (SSC) — higher for specialized trades',
      'Clerk trade requires Intermediate; Technical trades require Matric with Science or DAE',
      'Minimum height: 5\'6" (167.5 cm) for General Duty (regional relaxations to 5\'4" possible)',
      'Weight proportionate to height (per BMI)',
      'Physical Fitness: 1.6km run in ~7–8 min, 15 push-ups, 20 sit-ups, 3 chin-ups, 7×7 ft ditch crossing',
      'No ISSB required — enlisted entry only',
    ],
    selectionProcess: [
      { step: 1, title: 'Registration (Walk-In or Online)', desc: 'Register at joinpakarmy.gov.pk or report to nearest AS&RC during open recruitment.' },
      { step: 2, title: 'Document Verification', desc: 'Educational certificates, domicile, CNIC, and character certificate verification.' },
      { step: 3, title: 'Physical Fitness Test', desc: 'Run, push-ups, sit-ups, chin-ups, and ditch crossing at the AS&RC.' },
      { step: 4, title: 'Medical Examination', desc: 'Full medical check-up at the AS&RC medical facility.' },
      { step: 5, title: 'Intelligence / Written Test', desc: 'Basic academic test (Urdu, English, Mathematics, General Knowledge).' },
      { step: 6, title: 'Final Selection & Regimental Allocation', desc: 'Merit list compiled; selected soldiers sent to their respective Regimental Centers.' },
    ],
    training: 'Approximately 6 months basic recruit training at respective Regimental Centers',
    commission: 'N/A — Enlisted rank; begins as Private/Sepoy',
    officialUrl: 'https://www.joinpakarmy.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['soldier'],
  },

  // ─── PAKISTAN AIR FORCE ───────────────────────────────────────────────────

  'gd-pilot': {
    title: 'GD Pilot',
    branch: 'Pakistan Air Force',
    branchSlug: 'paf',
    commissionType: 'Permanent Commission',
    overview: 'The most prestigious PAF entry route, training candidates to become combat and multi-role pilots. Inducted twice per year, candidates spend 4 years at PAF Academy Asghar Khan, Risalpur, graduating with a BS in Aviation Sciences and commissioned as Pilot Officers.',
    quickFacts: [
      { label: 'Age', value: '16 – 22 years' },
      { label: 'Education', value: 'FSc (60–65%)' },
      { label: 'Training', value: '4 Years at PAF Academy Risalpur' },
      { label: 'Gender', value: 'Male Only (Combat)' },
    ],
    eligibility: [
      'Pakistani citizen',
      'Must be unmarried',
      'Age: 16–22 years',
      'FSc (Pre-Engineering, Pre-Medical, or Computer Science) with minimum 60–65%',
      'A-Levels with Physics + Mathematics/Biology/CS also accepted',
      'Hope Certificate accepted based on Part-I result',
      'CRITICAL: Vision must be 6/6 in BOTH eyes WITHOUT glasses (no corrective lenses permitted for pilots)',
      'Minimum height: 5\'4" (163 cm)',
      'Weight proportionate to height per PAF medical standards',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpaf.gov.pk (2 windows/year: Feb/Mar and Aug/Sep).' },
      { step: 2, title: 'Computer-Based Test', desc: 'Intelligence test + academic subjects: English, Physics, Mathematics at PAF Selection Centers.' },
      { step: 3, title: 'Initial Medical Examination', desc: 'Height, weight, vision (strict 6/6 unaided), and general fitness check.' },
      { step: 4, title: 'Initial Interview', desc: 'Panel interview assessing personality, communication, and motivation.' },
      { step: 5, title: 'Physical Fitness Test', desc: '1.6km run, push-ups, sit-ups, chin-ups.' },
      { step: 6, title: 'ISSB (5 Days)', desc: 'Comprehensive assessment: psychological tests, group tasks, outdoor activities, and DP interview.' },
      { step: 7, title: 'Flying Aptitude Test (FAT)', desc: 'Unique to pilots — computer-based psychomotor and aptitude test to assess flying potential.' },
      { step: 8, title: 'Final Medical Board (CMB)', desc: 'Central Medical Board comprehensive examination.' },
      { step: 9, title: 'Final Selection (AHQ)', desc: 'Air Headquarters compiles merit list; joining instructions issued.' },
    ],
    training: '4 years at PAF Academy Asghar Khan, Risalpur — academic + flying training',
    commission: 'Pilot Officer | Degree: BS Aviation Sciences',
    officialUrl: 'https://www.joinpaf.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['gd-pilot'],
  },

  'aeronautical-engineering': {
    title: 'Aeronautical Engineering',
    branch: 'Pakistan Air Force',
    branchSlug: 'paf',
    commissionType: 'Permanent / Short Service Commission',
    overview: 'Trains engineers for maintenance, development, and technical management of PAF aircraft and systems. Cadets study at the College of Aeronautical Engineering (CAE) at PAF Academy Risalpur, earning a BE in Aerospace or Avionics Engineering.',
    quickFacts: [
      { label: 'Age', value: '16–22 (PC) | Up to 30 (SSC)' },
      { label: 'Education', value: 'FSc Pre-Eng (65%) or BE Degree' },
      { label: 'Training', value: '4 Years at CAE, PAF Academy' },
      { label: 'Gender', value: 'Male (PC) | Male/Female (SSC)' },
    ],
    eligibility: [
      'Pakistani citizen',
      'Unmarried for Permanent Commission/FSc intake',
      'PC Age: 16–22 years | SSC Age: Up to 26–30 years',
      'PC: FSc (Pre-Engineering) with Physics, Chemistry, Mathematics — min. 65%',
      'FSc Computer Science or DAE (Avionics/Mechanical/Electrical) sometimes accepted',
      'SSC Graduates: 4-year BE/BSc in Aerospace, Avionics, Mechanical, or Electronics — min. 2.5 CGPA or 62.5%',
      'Degrees must be HEC & PEC recognized',
      'Height (Male): Min. 5\'4" (163 cm) | Height (Female): Min. 4\'10" (147 cm)',
      'Corrective glasses permitted for engineering branch (unlike pilots)',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpaf.gov.pk during announced intake.' },
      { step: 2, title: 'Intelligence & Academic Tests', desc: 'Physics, Mathematics, English (PC) or Engineering subjects (SSC graduates).' },
      { step: 3, title: 'Initial Medical Examination', desc: 'General health and physical standards assessment.' },
      { step: 4, title: 'Initial Interview', desc: 'Personality and motivation assessment.' },
      { step: 5, title: 'Physical Fitness Test', desc: 'Run, push-ups, sit-ups, chin-ups.' },
      { step: 6, title: 'ISSB (5 Days)', desc: 'Full ISSB assessment.' },
      { step: 7, title: 'Final Medical Board (CMB)', desc: 'Comprehensive medical at Central Medical Board.' },
      { step: 8, title: 'Final Selection (AHQ)', desc: 'Air Headquarters merit list and joining instructions.' },
    ],
    training: '4 years at College of Aeronautical Engineering (CAE), PAF Academy Risalpur',
    commission: 'Pilot Officer | Degree: BE Aerospace / BE Avionics Engineering',
    officialUrl: 'https://www.joinpaf.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['aeronautical-engineering'],
  },

  'air-defence': {
    title: 'Air Defence',
    branch: 'Pakistan Air Force',
    branchSlug: 'paf',
    commissionType: 'Permanent Commission',
    overview: 'Trains officers to manage Pakistan\'s air defence radar networks, missile systems, and air surveillance operations. Cadets spend 4 years at PAF Academy Risalpur and graduate with a BS in Air Defence Management.',
    quickFacts: [
      { label: 'Age', value: '16 – 22 years' },
      { label: 'Education', value: 'FSc (60–65%)' },
      { label: 'Training', value: '4 Years at PAF Academy' },
      { label: 'Gender', value: 'Male Only' },
    ],
    eligibility: [
      'Pakistani citizen',
      'Must be unmarried',
      'Age: 16–22 years',
      'FSc (Pre-Engineering, Pre-Medical, or Computer Science) minimum 60–65%',
      'A-Levels with Physics + Mathematics/Biology also accepted',
      'FSc with Physics plus two of: Mathematics, Statistics, Computer Science, or Biology',
      'Hope Certificate accepted on Part-I result',
      'Minimum height: 5\'4" (163 cm)',
      'Weight proportionate to height per PAF standards',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpaf.gov.pk during announced intake.' },
      { step: 2, title: 'Computer-Based Intelligence & Academic Tests', desc: 'Physics, Mathematics, English at PAF Selection Centers.' },
      { step: 3, title: 'Initial Medical Examination', desc: 'Height, weight, vision, and general health check.' },
      { step: 4, title: 'Initial Interview (Panel)', desc: 'Personality and communication assessment.' },
      { step: 5, title: 'Physical Fitness Test', desc: '1.6km run, push-ups, sit-ups, chin-ups.' },
      { step: 6, title: 'ISSB (5 Days)', desc: 'Full ISSB psychological, group, outdoor, and interview assessment.' },
      { step: 7, title: 'Final Medical Board (CMB)', desc: 'Comprehensive Central Medical Board examination.' },
      { step: 8, title: 'Final Selection (AHQ)', desc: 'AHQ merit list and joining instructions.' },
    ],
    training: '4 years at PAF Academy Asghar Khan, Risalpur',
    commission: 'Pilot Officer | Degree: BS Air Defence Management',
    officialUrl: 'https://www.joinpaf.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['air-defence'],
  },

  'admin': {
    title: 'Admin Branch',
    branch: 'Pakistan Air Force',
    branchSlug: 'paf',
    commissionType: 'Permanent / Short Service Commission',
    overview: 'The Admin & Special Duties (A&SD) Branch handles administrative, logistics, and human resource functions within the PAF. Available via Permanent Commission (FSc-based, 4-year training) and Short Service Commission (graduate-based, 6-month training).',
    quickFacts: [
      { label: 'Age', value: '16–22 (PC) | Up to 30 (SSC)' },
      { label: 'Education', value: 'FSc 65% (PC) | 16-yr Degree (SSC)' },
      { label: 'Training', value: '4 Yrs (PC) | 6 Months (SSC)' },
      { label: 'Gender', value: 'Male (PC) | Male/Female (SSC)' },
    ],
    eligibility: [
      'Pakistani citizen',
      'PC: Unmarried; Age 16–22; FSc (Pre-Eng/Pre-Med/CS) min. 65%',
      'SSC: Age up to 30 years; BA, BSc, BBA, BPA, BS (4-year), MA, MSc, MBA, MPA',
      'SSC Minimum: 2nd division or 2.5 CGPA from HEC-recognized university',
      'Minimum height: 5\'4" (163 cm) for males',
      'Weight proportionate per PAF standards',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpaf.gov.pk during announced intake.' },
      { step: 2, title: 'Intelligence & Academic Tests', desc: 'Reasoning and academic subjects at PAF Selection Centers.' },
      { step: 3, title: 'Initial Medical Examination', desc: 'Health and physical standards check.' },
      { step: 4, title: 'Initial Interview', desc: 'Panel interview assessing personality and motivation.' },
      { step: 5, title: 'Physical Fitness Test', desc: 'Run, push-ups, sit-ups, chin-ups.' },
      { step: 6, title: 'ISSB (PC only)', desc: '5-day ISSB assessment (may be waived for some SSC intakes — check advertisement).' },
      { step: 7, title: 'Final Medical Board (CMB)', desc: 'Comprehensive medical at Central Medical Board.' },
      { step: 8, title: 'Final Selection (AHQ)', desc: 'AHQ merit list and joining instructions.' },
    ],
    training: '4 years at PAF Academy (PC) | ~6 months basic military training (SSC)',
    commission: 'Pilot Officer (PC) | Flying Officer (SSC)',
    officialUrl: 'https://www.joinpaf.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['admin'],
  },

  'accounts': {
    title: 'Accounts Branch',
    branch: 'Pakistan Air Force',
    branchSlug: 'paf',
    commissionType: 'Short Service Commission',
    overview: 'The Accounts Branch manages PAF\'s financial, budgetary, and audit functions. Inducted through Short Service Commission specifically for finance and accounting professionals with relevant 16-year degrees.',
    quickFacts: [
      { label: 'Age', value: '20 – 30 years' },
      { label: 'Education', value: 'BBA/B.Com Finance (65%)' },
      { label: 'Training', value: '~6 Months at PAF Academy' },
      { label: 'Gender', value: 'Male (Female sometimes — check ad)' },
    ],
    eligibility: [
      'Pakistani citizen',
      'Age: 20–26 years (or 18–30 years — varies per advertisement)',
      'Finance/accounting 16-year degree: B.Com (4-year), BBA Finance, BS Commerce, BS Accounting, BS Finance, or equivalent',
      'Minimum 65% marks or 2.5–2.7 CGPA',
      'HEC-recognized university only',
      'Minimum height: 5\'4" (163 cm)',
      'Weight proportionate per PAF standards',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpaf.gov.pk during announced period.' },
      { step: 2, title: 'Intelligence & Academic Tests', desc: 'Finance/accounting subjects + reasoning tests.' },
      { step: 3, title: 'Initial Medical Examination', desc: 'General health and physical assessment.' },
      { step: 4, title: 'Interview', desc: 'Professional and personality interview.' },
      { step: 5, title: 'Physical Fitness Test', desc: 'Run, push-ups, sit-ups, chin-ups.' },
      { step: 6, title: 'ISSB (if applicable)', desc: 'Check individual advertisement — may apply to some SSC graduate intakes.' },
      { step: 7, title: 'Final Medical Board (CMB)', desc: 'Comprehensive Central Medical Board examination.' },
      { step: 8, title: 'Final Selection (AHQ)', desc: 'AHQ merit list and joining instructions.' },
    ],
    training: '~6 months basic military training at PAF Academy (SSC entry)',
    commission: 'Flying Officer',
    officialUrl: 'https://www.joinpaf.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['accounts'],
  },

  // ─── PAKISTAN NAVY ────────────────────────────────────────────────────────

  'pn-cadet': {
    title: 'PN Cadet',
    branch: 'Pakistan Navy',
    branchSlug: 'navy',
    commissionType: 'Permanent Commission',
    overview: 'The primary route to a Permanent Commission in the Pakistan Navy. Cadets train at Pakistan Naval Academy (PNS Rahbar), Manora Island, Karachi. Branches include Executive, Engineering, Education, Supply & Secretariat, and others.',
    quickFacts: [
      { label: 'Age', value: '16½ – 21 years' },
      { label: 'Education', value: 'FSc Phy+Math (60%)' },
      { label: 'Training', value: '~2 Years (PNA + Sea)' },
      { label: 'Gender', value: 'Male Only' },
    ],
    eligibility: [
      'Pakistani citizen',
      'Must be unmarried (civilians); married/unmarried allowed for service candidates',
      'Age: Civilians 16½ to 21 years | Service Candidates 17–23 years',
      'Must have passed both Matric and FSc with minimum 60% marks',
      'Compulsory FSc subjects: Physics + Mathematics + one of (Chemistry, Computer Science, or Statistics)',
      'A/O-Levels accepted with IBCC equivalence',
      'Hope Certificate accepted if FSc Part-I ≥ 65%',
      'Minimum height: 5\'4" (162.5 cm)',
      'Weight proportionate to height per BMI standards',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpaknavy.gov.pk during announced intake.' },
      { step: 2, title: 'Computer-Based Entrance Test', desc: 'Intelligence (verbal/non-verbal) + Academics: English, Physics, Mathematics, General Knowledge.' },
      { step: 3, title: 'Physical Efficiency Test (PET)', desc: 'Running, push-ups, sit-ups, chin-ups at PNR&SC.' },
      { step: 4, title: 'Preliminary Medical Examination', desc: 'Health check at Pakistan Navy Recruitment & Selection Centre.' },
      { step: 5, title: 'Initial Interview', desc: 'Personality and academic aptitude interview at PNR&SC.' },
      { step: 6, title: 'ISSB (4–5 Days)', desc: 'Comprehensive leadership, psychological, and physical assessment.' },
      { step: 7, title: 'Final Medical Examination', desc: 'Detailed medical at CMH/PN Hospitals.' },
      { step: 8, title: 'Final Selection (NHQ)', desc: 'Naval Headquarters merit list and joining instructions.' },
    ],
    training: '18 months at PNS Rahbar → passes out as Midshipman → 6 months sea training → commissioned as Sub-Lieutenant (~2 years total)',
    commission: 'Sub-Lieutenant',
    officialUrl: 'https://www.joinpaknavy.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['pn-cadet'],
  },

  'ssc': {
    title: 'SSC (Short Service Commission)',
    branch: 'Pakistan Navy',
    branchSlug: 'navy',
    commissionType: 'Short Service Commission',
    overview: 'A direct-entry commission for qualified graduates and professionals across multiple Navy branches — Operations, Engineering, Medical, Supply, Education, Marines, SSG(N), and more — for a fixed tenure.',
    quickFacts: [
      { label: 'Age', value: '21–42 years (branch-dependent)' },
      { label: 'Education', value: '16-yr Degree (2.5 CGPA / 60%)' },
      { label: 'Training', value: '~6 Months Basic Naval Training' },
      { label: 'Gender', value: 'Male & Female (branch-specific)' },
    ],
    eligibility: [
      'Pakistani citizen',
      'Marital status varies by branch (check advertisement)',
      'Operations/Marines/SSG(N): Up to 24–26 years; Engineering/Supply/Others: 21–28/30 years; Medical Specialists: Up to 42 years',
      'Minimum 16 years education (BS, BE, MS, MSc, MBBS, etc.) from HEC-recognized institution',
      'Minimum 2.5 CGPA or 60% marks',
      'Physical standards per individual branch requirements',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpaknavy.gov.pk during announced period.' },
      { step: 2, title: 'Computer-Based Test', desc: 'Intelligence (verbal/non-verbal) + academic/professional MCQs.' },
      { step: 3, title: 'Initial Medical & Interview', desc: 'Medical exam and personality interview at PNR&SC.' },
      { step: 4, title: 'ISSB / Personality Assessment', desc: 'Most branches require full ISSB; Medical branch may have alternative assessment.' },
      { step: 5, title: 'Final Medical Examination', desc: 'Detailed medical at CMH/PN Hospital.' },
      { step: 6, title: 'Final Selection (NHQ)', desc: 'Naval Headquarters merit list and joining instructions.' },
    ],
    training: '~6 months basic naval/military training; Medical specialists may have shorter orientation',
    commission: 'Sub-Lieutenant (or equivalent)',
    officialUrl: 'https://www.joinpaknavy.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['ssc'],
  },

  'marines': {
    title: 'Marines',
    branch: 'Pakistan Navy',
    branchSlug: 'navy',
    commissionType: 'Enlisted / Short Service Commission',
    overview: 'Pakistan Marines are an elite amphibious warfare force under the Pakistan Navy. Marine sailors face the toughest physical standards of any Navy enlisted entry, with strict vision and height requirements. Marine SSC officers are inducted through the Navy SSC route.',
    quickFacts: [
      { label: 'Age', value: '17 – 21 years' },
      { label: 'Education', value: 'Matric Science (60%)' },
      { label: 'Training', value: '17 Wks Basic + Commando Training' },
      { label: 'Gender', value: 'Male Only' },
    ],
    eligibility: [
      'Pakistani citizen',
      'Strictly unmarried',
      'Age: 17–21 years',
      'Matric (Science) with minimum 60% marks',
      'CRITICAL: Perfect vision 6/6 WITHOUT glasses (non-negotiable for Marines)',
      'Minimum height: 5\'6" (167.5 cm)',
      'Must meet rigorous physical fitness standards (higher than standard sailor)',
      'Excellent physical health with no chronic conditions',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpaknavy.gov.pk during announced intake.' },
      { step: 2, title: 'Entrance Test', desc: 'Intelligence (verbal/non-verbal) + academic subjects.' },
      { step: 3, title: 'Initial Medical Examination', desc: 'Health and physical check including strict vision test (6/6 unaided).' },
      { step: 4, title: 'Initial Interview', desc: 'Personality and motivation assessment.' },
      { step: 5, title: 'Personality / Further Assessment', desc: 'Additional assessment for Marines suitability.' },
      { step: 6, title: 'Detailed Medical at Naval Hospital', desc: 'Comprehensive medical at PN Hospital.' },
      { step: 7, title: 'Final Selection (NHQ)', desc: 'Naval Headquarters merit list and joining instructions.' },
    ],
    training: '17 weeks basic training at PNS Himalaya (Manora, Karachi) + specialized Marine commando training (several additional months)',
    commission: 'N/A for enlisted; SSC Marines officers via Navy SSC route',
    officialUrl: 'https://www.joinpaknavy.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['marines'],
  },

  'sailor': {
    title: 'Sailor',
    branch: 'Pakistan Navy',
    branchSlug: 'navy',
    commissionType: 'Enlisted (Non-Commissioned)',
    overview: 'Enlisted non-officer entry into the Pakistan Navy across Technical, Marine, Naval Police, PT, and other branches. Inducted twice yearly (approximately April and November). Sailors receive professional training at PNS Himalaya, Manora, Karachi.',
    quickFacts: [
      { label: 'Age', value: '16 – 21 years (per branch)' },
      { label: 'Education', value: 'Matric (60–65%)' },
      { label: 'Training', value: '17 Weeks at PNS Himalaya' },
      { label: 'Gender', value: 'Male Only' },
    ],
    eligibility: [
      'Pakistani citizen',
      'Must be unmarried (except Naib Khateeb)',
      'Technical Branch: Matric (Science) min. 65%, Age 16–20, Height min. 5\'4"',
      'Marine Branch: Matric (Science/Arts) min. 60–80%, Age 17–21, Height min. 5\'6"',
      'Naval Police Branch: Matric (Science/Arts) min. 60%, Age 16–20, Height min. 5\'7"',
      'PT Branch: Matric (Science/Arts) min. 60%, Age 16–20',
      'Weight proportionate to height',
      'Inducted twice yearly (approximately April and November)',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpaknavy.gov.pk during active recruitment window.' },
      { step: 2, title: 'Computerized Entrance Test', desc: 'Intelligence, English, Mathematics, Physics, Chemistry, General Knowledge.' },
      { step: 3, title: 'Physical / Medical Examination', desc: 'Health check and physical assessment at PNR&SC.' },
      { step: 4, title: 'Selection Board Interview', desc: 'Personality and academic aptitude interview.' },
      { step: 5, title: 'Final Selection (NHQ)', desc: 'Naval Headquarters merit list; selected sailors report to PNS Himalaya.' },
    ],
    training: '17 weeks basic training at PNS Himalaya (Manora, Karachi) + branch-specific technical training (total 4–6 months)',
    commission: 'N/A — Enlisted rank; begins as Ordinary Seaman/Recruit',
    officialUrl: 'https://www.joinpaknavy.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['sailor'],
  },

  'civilian': {
    title: 'Civilian Posts',
    branch: 'Pakistan Navy',
    branchSlug: 'navy',
    commissionType: 'Civilian Employment',
    overview: 'Non-uniformed civilian employment across Pakistan Navy\'s technical, administrative, support, and specialist roles. Open to both men and women from all provinces, with regional quotas applied. No military training or ISSB required.',
    quickFacts: [
      { label: 'Age', value: '15 – 33 years' },
      { label: 'Education', value: 'Middle to Bachelor\'s (role-dependent)' },
      { label: 'Training', value: 'On-the-Job Induction' },
      { label: 'Gender', value: 'Male & Female' },
    ],
    eligibility: [
      'Pakistani citizen (all provinces, AJK, GB, Ex-FATA eligible)',
      'Regional quotas apply per province',
      'Age: Generally 15–33 years; technical/apprentice roles 15–19 years',
      'Administrative/Clerical posts: Matric, Intermediate, or Bachelor\'s degree',
      'Technical/Industrial posts: Matric with Science, DAE, or relevant technical diploma',
      'No physical height/fitness standards (unlike uniformed posts)',
      'Must be medically fit — health examination for shortlisted candidates',
      'No ISSB required',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpaknavy.gov.pk during advertised period.' },
      { step: 2, title: 'Written Test', desc: 'Intelligence, academic, and professional/trade tests relevant to the applied post.' },
      { step: 3, title: 'Skill / Aptitude Assessment', desc: 'Practical trade test for technical roles.' },
      { step: 4, title: 'Interview by Board', desc: 'Professional and personality interview.' },
      { step: 5, title: 'Medical Examination', desc: 'Health fitness check for shortlisted candidates.' },
      { step: 6, title: 'Final Selection', desc: 'Selected by relevant Naval authority; joining letter issued.' },
    ],
    training: 'On-the-job induction and orientation (varies by post; no fixed military training)',
    commission: 'N/A — Civilian Grade (BPS) or equivalent',
    officialUrl: 'https://www.joinpaknavy.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['civilian'],
  },
  'm-cadet': {
    title: 'M Cadet (Medical)',
    branch: 'Pakistan Army',
    branchSlug: 'army',
    commissionType: 'Short Service Commission',
    overview: 'The M Cadet scheme is for 4th or final year MBBS/BDS students currently studying in PM&DC recognized medical colleges. After graduation, candidates are inducted as Captains in the Army Medical Corps.',
    quickFacts: [
      { label: 'Age', value: '20 - 26 Years' },
      { label: 'Education', value: '4th or Final Year MBBS/BDS' },
      { label: 'Training', value: '22 Weeks PMA Kakul' },
      { label: 'Gender', value: 'Male Only' }
    ],
    eligibility: [
      'Unmarried male citizens of Pakistan',
      'Age limit is generally 20 to 26 years',
      'Must be studying in 4th or final year of MBBS/BDS in recognized civilian medical college',
      'Minimum height 5 feet 4 inches (162.5 cm)',
      'Weight as per Body Mass Index (BMI)'
    ],
    selectionProcess: [
      { step: 1, title: 'Registration', desc: 'Online registration via joinpakarmy.gov.pk or at Army Selection Centers.' },
      { step: 2, title: 'Initial Written Test', desc: 'Basic Intelligence test and Academic assessment based on medical background.' },
      { step: 3, title: 'Physical Test', desc: 'Minimum physical fitness standards must be met (running, push-ups).' },
      { step: 4, title: 'Initial Medical Examination', desc: 'Preliminary health screening at AS&RC.' },
      { step: 5, title: 'GHQ Selection Board', desc: 'Comprehensive panel interview by GHQ Selection Board to assess personality and aptitude.' },
      { step: 6, title: 'Final Medical Board', desc: 'Detailed medical checkup at Combined Military Hospital (CMH).' },
      { step: 7, title: 'Final Selection', desc: 'Merit list compiled by GHQ. Selected candidates receive joining instructions for PMA.' }
    ],
    training: '22 weeks Basic Military Training at PMA Kakul upon completion of MBBS/BDS degree',
    commission: 'Captain',
    officialUrl: 'https://www.joinpakarmy.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['medical', 'm cadet', 'amc']
  },
  'amc': {
    title: 'AMC (Medical Cadet)',
    branch: 'Pakistan Army',
    branchSlug: 'army',
    commissionType: 'Permanent Commission',
    overview: 'Join Army Medical College as a Medical Cadet. Open for FSc Pre-Medical students to study MBBS or BDS on military scholarship. Cadets are commissioned as Captains after graduation.',
    quickFacts: [
      { label: 'Age', value: '17 - 21 Years' },
      { label: 'Education', value: 'FSc Pre-Medical (70%)' },
      { label: 'Training', value: '5 Years MBBS / 4 Years BDS + 22 Weeks PMA' },
      { label: 'Gender', value: 'Male Only' }
    ],
    eligibility: [
      'Age: 17 to 21 years (relaxable by 3 months both in upper/lower limits)',
      'FSc (Pre-Medical) with minimum 70% marks',
      'A-Level candidates must have equivalent certificate',
      'Must have appeared in NUMS Entry Test'
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply at joinpakarmy.gov.pk or visit nearest AS&RC.' },
      { step: 2, title: 'Initial Written Test', desc: 'Intelligence test followed by Academic Test (Physics, Chemistry, Biology, English).' },
      { step: 3, title: 'Physical Fitness Test', desc: 'Must pass physical standards: 1.6km run, pushups, situps, and pullups.' },
      { step: 4, title: 'Initial Medical Examination', desc: 'Preliminary medical check at the AS&RC.' },
      { step: 5, title: 'Personality Test', desc: 'Personality assessment at AS&RC by a panel.' },
      { step: 6, title: 'Final Medical Board', desc: 'Detailed medical examination by Central Medical Board (CMB) at CMH.' },
      { step: 7, title: 'Final Selection', desc: 'Merit list compiled by GHQ based on FSc, NUMS, and tests.' }
    ],
    training: '5 years MBBS or 4 years BDS at AMC, followed by 22 weeks military training at PMA',
    commission: 'Captain',
    officialUrl: 'https://www.joinpakarmy.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['amc', 'medical', 'biology']
  },
  'logistics': {
    title: 'Logistics Branch',
    branch: 'Pakistan Air Force',
    branchSlug: 'paf',
    commissionType: 'Permanent Commission',
    overview: 'The Logistics branch of the PAF is responsible for supply chain management, procurement, and equipment provisioning to keep the air fleet operational.',
    quickFacts: [
      { label: 'Age', value: '16 - 22 Years' },
      { label: 'Education', value: 'FSc Pre-Eng/ICS/Pre-Med (65%)' },
      { label: 'Training', value: '3 Years at PAF Academy' },
      { label: 'Gender', value: 'Male / Female' }
    ],
    eligibility: [
      'Unmarried Pakistani citizen',
      'Age: 16 to 22 years',
      'FSc Pre-Engineering/Pre-Medical/Computer Science with minimum 65% marks',
      'Vision: 6/6 (without glasses)'
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Candidates apply online via joinpaf.gov.pk.' },
      { step: 2, title: 'Initial Written Test', desc: 'Computerized intelligence test followed by Academic Test (Physics, Math, English).' },
      { step: 3, title: 'Initial Medical & Physical', desc: 'Basic medical screening and physical fitness evaluation at Selection Centre.' },
      { step: 4, title: 'ISSB Assessment', desc: '4-Day Inter Services Selection Board (ISSB) psychological, group, and interview tests.' },
      { step: 5, title: 'Central Medical Board (CMB)', desc: 'Detailed final medical examination at PAF Masroor.' },
      { step: 6, title: 'Flying Aptitude Test (If Applicable)', desc: 'General aptitude screening for specific operations.' },
      { step: 7, title: 'Final Merit List', desc: 'Final selection by Air Headquarters.' }
    ],
    training: '3 Years degree program followed by military training at PAF Academy Asghar Khan',
    commission: 'Flying Officer',
    officialUrl: 'https://joinpaf.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['logistics', 'paf', 'physics']
  },
  'it': {
    title: 'Information Technology (IT)',
    branch: 'Pakistan Air Force',
    branchSlug: 'paf',
    commissionType: 'Short Service Commission',
    overview: 'Induction as IT Officers in the Pakistan Air Force. This branch manages networking, software development, cybersecurity, and communication infrastructure.',
    quickFacts: [
      { label: 'Age', value: '18 - 30 Years' },
      { label: 'Education', value: 'BS/MS in CS/IT (2.5 CGPA)' },
      { label: 'Training', value: '24 Weeks' },
      { label: 'Gender', value: 'Male / Female' }
    ],
    eligibility: [
      'Married/Unmarried Pakistani citizens',
      'Age: 18 to 30 years',
      'BS/MS/MCS/BCS (4 years) in Computer Science, IT, Software Eng, Info Security',
      'Minimum CGPA 2.5 out of 4 or 62% marks'
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Register at joinpaf.gov.pk.' },
      { step: 2, title: 'E-Testing', desc: 'Computerized Intelligence test followed by IT Professional Academic Test.' },
      { step: 3, title: 'Initial Medical', desc: 'Preliminary Medical check and physical inspection at selection center.' },
      { step: 4, title: 'Psychological Test', desc: 'Short psychological evaluation.' },
      { step: 5, title: 'AHQ Interview', desc: 'Interview by Air Headquarters Special Selection Board (No ISSB required).' },
      { step: 6, title: 'Final Medical Board', desc: 'Central Medical Board (CMB) at PAF Hospital.' },
      { step: 7, title: 'Final Selection', desc: 'Merit list generated by AHQ based on overall performance.' }
    ],
    training: '24 weeks basic military training',
    commission: 'Flying Officer',
    officialUrl: 'https://joinpaf.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['it', 'computer', 'paf']
  },
  'education': {
    title: 'Education Branch',
    branch: 'Pakistan Air Force',
    branchSlug: 'paf',
    commissionType: 'Short Service Commission',
    overview: 'The Education Branch inducts qualified educators and instructors to teach subjects at various PAF academies, schools, and colleges.',
    quickFacts: [
      { label: 'Age', value: '21 - 30 Years' },
      { label: 'Education', value: 'Masters/BS (4 years)' },
      { label: 'Training', value: '24 Weeks' },
      { label: 'Gender', value: 'Male / Female' }
    ],
    eligibility: [
      'Age: 21 to 30 years',
      'MA/MSc/BS (4 Years) in Math, Physics, English, Islamic Studies, Pak Studies, etc.',
      'Minimum 2nd Division or 2.5 CGPA'
    ],
    selectionProcess: [
      { step: 1, title: 'Online Application', desc: 'Register online at joinpaf.gov.pk.' },
      { step: 2, title: 'E-Testing', desc: 'E-Testing of Intelligence followed by Professional/Subject related Academic Test.' },
      { step: 3, title: 'Initial Medical', desc: 'Medical fitness screening at the selection centre.' },
      { step: 4, title: 'Psychological Test', desc: 'Initial psychological evaluation and personality profiling.' },
      { step: 5, title: 'Interview by AHQ Special Board', desc: 'Detailed professional and personality interview by AHQ Board.' },
      { step: 6, title: 'Central Medical Board (CMB)', desc: 'Comprehensive medical assessment at PAF hospital.' },
      { step: 7, title: 'Final Selection', desc: 'Air Headquarters compiles the final merit list for induction.' }
    ],
    training: '24 Weeks Basic Military Training',
    commission: 'Flying Officer',
    officialUrl: 'https://joinpaf.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['education', 'paf']
  },
  'airmen': {
    title: 'Airmen (Aero Trades, PF&DI, Provost)',
    branch: 'Pakistan Air Force',
    branchSlug: 'paf',
    commissionType: 'Non-Commissioned',
    overview: 'Induction as Airmen in PAF. Includes trades like Aero Trades, PF&DI (Physical Fitness & Drill Instructor), Provost, and GC (Ground Combateer).',
    quickFacts: [
      { label: 'Age', value: '15.5 - 22 Years' },
      { label: 'Education', value: 'Matric Science (60%)' },
      { label: 'Training', value: 'Varies by trade' },
      { label: 'Gender', value: 'Male Only' }
    ],
    eligibility: [
      'Age varies by trade (e.g., Aero Trades 15.5-20 years, GC 17.5-22 years)',
      'Matric with Science (minimum 60% marks overall, 33% in English, Math, Physics)',
      'Height: 163 cm (175 cm for PF&DI/GC)'
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply online through the PAF official portal.' },
      { step: 2, title: 'E-Testing', desc: 'Computerized tests: Intelligence, English, Physics, and Mathematics.' },
      { step: 3, title: 'Physical Test', desc: 'Running and physical endurance test (especially for PF&DI and GC trades).' },
      { step: 4, title: 'Initial Medical', desc: 'Medical examination at the PAF selection centre.' },
      { step: 5, title: 'Personality Test & Interview', desc: 'Initial interview and psychological screening by selection officers.' },
      { step: 6, title: 'Final Medical Board', desc: 'Detailed medical check at Air Headquarters Medical Board.' },
      { step: 7, title: 'Final Merit List', desc: 'Final selection and issuance of call letters for training at PAF bases.' }
    ],
    training: 'Basic military and specialized trade training at PAF bases',
    commission: 'Aircraftman / Leading Aircraftman',
    officialUrl: 'https://joinpaf.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['airmen', 'physics', 'math', 'matric']
  },
  'm-cadet-navy': {
    title: 'M Cadet (Navy)',
    branch: 'Pakistan Navy',
    branchSlug: 'navy',
    commissionType: 'Short Service Commission',
    overview: 'The Navy M Cadet scheme is for medical students in their 4th or 5th year of MBBS at PM&DC recognized civilian colleges. Inducted officers serve as Medical Officers in Pakistan Navy.',
    quickFacts: [
      { label: 'Age', value: 'Up to 26 Years' },
      { label: 'Education', value: '4th/5th Year MBBS' },
      { label: 'Training', value: 'Basic Naval Training' },
      { label: 'Gender', value: 'Male / Female' }
    ],
    eligibility: [
      'Unmarried Pakistani citizens',
      'Age up to 26 years',
      'Must be studying in 4th or 5th year of MBBS in PM&DC recognized medical college',
      'Minimum height: 5 ft 4 inches (Male), 5 ft (Female)'
    ],
    selectionProcess: [
      { step: 1, title: 'Registration', desc: 'Apply online at joinpaknavy.gov.pk.' },
      { step: 2, title: 'Initial Written Test', desc: 'Computerized Intelligence and Academic (Medical) test.' },
      { step: 3, title: 'Initial Medical', desc: 'Preliminary health check at PN Recruitment and Selection Centre.' },
      { step: 4, title: 'Physical Fitness Test', desc: 'Basic physical standard evaluation.' },
      { step: 5, title: 'Personality Assessment', desc: 'Psychological tests and personality profiling.' },
      { step: 6, title: 'Final Selection Board', desc: 'Detailed panel interview by Naval Headquarters Board.' },
      { step: 7, title: 'Final Medical & Merit List', desc: 'Final CMB examination and merit list generation.' }
    ],
    training: 'Basic military and naval training upon completion of degree',
    commission: 'Acting Surgeon Lieutenant',
    officialUrl: 'https://www.joinpaknavy.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['medical', 'biology']
  },
  'pnec': {
    title: 'PNEC / Cadet Scheme',
    branch: 'Pakistan Navy',
    branchSlug: 'navy',
    commissionType: 'Permanent Commission',
    overview: 'Join the Pakistan Navy Engineering College (PNEC-NUST) as a Naval Cadet. This scheme provides an engineering degree (Mechanical/Electrical) followed by commissioning in the Navy.',
    quickFacts: [
      { label: 'Age', value: '16.5 - 21 Years' },
      { label: 'Education', value: 'FSc Pre-Engineering' },
      { label: 'Training', value: '4 Years BE + Naval Training' },
      { label: 'Gender', value: 'Male Only' }
    ],
    eligibility: [
      'Unmarried male citizens',
      'Age: 16.5 to 21 years',
      'FSc Pre-Engineering with minimum 60% marks or O/A levels equivalent',
      'Minimum height 5 ft 4 inches'
    ],
    selectionProcess: [
      { step: 1, title: 'Registration', desc: 'Register online at joinpaknavy.gov.pk.' },
      { step: 2, title: 'Entrance Test', desc: 'Computerized Intelligence and Academic Test (Math, Physics, English).' },
      { step: 3, title: 'Initial Medical & Physical', desc: 'Preliminary medical check and physical efficiency test.' },
      { step: 4, title: 'ISSB Assessment', desc: '4-day comprehensive psychological and leadership testing by Inter Services Selection Board.' },
      { step: 5, title: 'Final Medical Examination', desc: 'Detailed medical checkup by PN Medical Board (CMB).' },
      { step: 6, title: 'Naval Headquarters Interview', desc: 'Final interview for selected engineering cadets.' },
      { step: 7, title: 'Final Selection', desc: 'Naval Headquarters merit list compilation and induction.' }
    ],
    training: '4 years BE Degree at PNEC (NUST) Karachi, followed by professional sea training',
    commission: 'Midshipman / Sub Lieutenant',
    officialUrl: 'https://www.joinpaknavy.gov.pk',
    quizCategory: 'armed-forces',
    quizSearchTerms: ['pnec', 'engineering', 'math', 'physics']
  }
}


// Branch color maps
export const branchColors: Record<string, { primary: string; bg: string; badge: string; border: string }> = {
  army: { primary: '#15803d', bg: 'bg-green-50', badge: 'bg-green-100 text-green-800', border: 'border-green-200' },
  paf: { primary: '#1d4ed8', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-800', border: 'border-blue-200' },
  navy: { primary: '#0e7490', bg: 'bg-cyan-50', badge: 'bg-cyan-100 text-cyan-800', border: 'border-cyan-200' },
}

export const branchImages: Record<string, string> = {
  army: '/images/exam-army-bg.jpg',
  paf: '/images/exam-paf-bg.jpg',
  navy: '/images/exam-navy-bg.jpg',
}
