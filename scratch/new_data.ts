// Appended to the end of lib/data/armedForcesData.ts

// ─── MDCAT / ENTRY TESTS ───────────────────────────────────────────────────

  'nums': {
    title: 'NUMS MDCAT',
    branch: 'Medical Entry Test',
    branchSlug: 'nums',
    commissionType: 'University Admission',
    overview: 'The National University of Medical Sciences (NUMS) conducts its own entry test for admissions into Army Medical College (AMC) and NUMS-affiliated medical/dental colleges across Pakistan.',
    quickFacts: [
      { label: 'Requirement', value: 'FSc Pre-Medical (Minimum 60%)' },
      { label: 'Syllabus', value: 'Biology, Chemistry, Physics, English' },
      { label: 'Validity', value: '1 Year' },
      { label: 'Negative Marking', value: 'No' },
    ],
    eligibility: [
      'Pakistani/Foreign nationals and Overseas Pakistanis',
      'Minimum 60% marks in FSc Pre-Medical or equivalent O/A level',
      'Must have passed SSC and HSSC with Science subjects',
    ],
    selectionProcess: [
      { step: 1, title: 'Online Registration', desc: 'Apply online through the NUMS official portal.' },
      { step: 2, title: 'Fee Submission', desc: 'Generate challan and deposit fee at designated bank branches.' },
      { step: 3, title: 'Admit Card', desc: 'Download admit card containing test center details.' },
      { step: 4, title: 'Written Test (MDCAT)', desc: '150 MCQs (Biology, Chemistry, Physics, English) in 150 minutes.' },
      { step: 5, title: 'Psychological Test', desc: '100 MCQs in 30 minutes (mandatory but non-scoring for merit).' },
      { step: 6, title: 'Merit List', desc: 'Final merit calculated based on MDCAT, FSc, and Matric scores.' }
    ],
    training: '5 Years MBBS or 4 Years BDS Program',
    commission: 'Civilian Medical Student',
    officialUrl: 'https://numspak.edu.pk',
    quizCategory: 'entry-tests',
    quizSearchTerms: ['nums', 'mdcat', 'medical', 'biology']
  },

  'mdcat': {
    title: 'National MDCAT (PMDC)',
    branch: 'Medical Entry Test',
    branchSlug: 'mdcat',
    commissionType: 'University Admission',
    overview: 'The centralized Medical and Dental College Admission Test (MDCAT) conducted under the Pakistan Medical & Dental Council (PMDC) for admissions to all public and private medical colleges in Pakistan.',
    quickFacts: [
      { label: 'Requirement', value: 'FSc Pre-Medical' },
      { label: 'MCQs', value: '200' },
      { label: 'Time', value: '3.5 Hours' },
      { label: 'Pass Marks', value: '55% (MBBS), 50% (BDS)' },
    ],
    eligibility: [
      'Candidates who have passed FSc Pre-Medical or equivalent',
      'Awaiting result candidates can also apply',
      'Minimum 60% marks required for public college admission'
    ],
    selectionProcess: [
      { step: 1, title: 'PMDC Registration', desc: 'Register on the PMDC portal and select your admitting university (UHS, DUHS, KMU, SZABMU, BUMHS).' },
      { step: 2, title: 'Test Day', desc: 'Appear for the 200 MCQ paper. Bring original CNIC/B-Form and admit card.' },
      { step: 3, title: 'Answer Key', desc: 'Carbon copy and official answer key provided same day for self-scoring.' },
      { step: 4, title: 'Official Result', desc: 'Final PMDC result announced online.' },
      { step: 5, title: 'College Admissions', desc: 'Apply separately to respective provincial admitting universities based on MDCAT score.' }
    ],
    training: '5 Years MBBS / 4 Years BDS',
    commission: 'Medical Student',
    officialUrl: 'https://pmdc.pk',
    quizCategory: 'entry-tests',
    quizSearchTerms: ['mdcat', 'pmdc', 'biology', 'chemistry']
  },

  // ─── PUBLIC SERVICE (FPSC) ────────────────────────────────────────────────

  'css': {
    title: 'CSS (Central Superior Services)',
    branch: 'Federal Government',
    branchSlug: 'css',
    commissionType: 'BS-17 Civil Servant',
    overview: 'The Central Superior Services (CSS) exam is the most prestigious competitive exam in Pakistan, recruiting bureaucrats for top federal government groups like PAS, PSP, and FSP.',
    quickFacts: [
      { label: 'Age', value: '21 – 30 Years' },
      { label: 'Education', value: 'Bachelors (14 Years) 2nd Div' },
      { label: 'Exam Type', value: 'MPT + Written + Interview' },
      { label: 'Attempts', value: 'Max 3' },
    ],
    eligibility: [
      'Must be a citizen of Pakistan',
      'Age limit: 21 to 30 years (relaxation up to 32 years for certain categories)',
      'Minimum 2nd Division in Bachelor’s degree from HEC recognized university',
      'Must pass the MPT (MCQ Based Preliminary Test) to sit in written exams'
    ],
    selectionProcess: [
      { step: 1, title: 'MPT (Preliminary Test)', desc: 'Screening test of 200 MCQs. Must score at least 33% (66 marks) to qualify.' },
      { step: 2, title: 'Written Exam Registration', desc: 'Qualifiers apply online and submit hardcopy documents to FPSC.' },
      { step: 3, title: 'Written Examinations', desc: '1200 marks total (600 Compulsory + 600 Optional subjects).' },
      { step: 4, title: 'Medical Examination', desc: 'Central Medical Board for physical fitness.' },
      { step: 5, title: 'Psychological Assessment', desc: '2-day psychological evaluation.' },
      { step: 6, title: 'Viva Voce (Interview)', desc: 'Final panel interview worth 300 marks.' },
      { step: 7, title: 'Final Allocation', desc: 'Merit list and group allocation based on final score.' }
    ],
    training: 'CTP at Civil Services Academy, Lahore',
    commission: 'Civil Servant (BS-17)',
    officialUrl: 'https://fpsc.gov.pk',
    quizCategory: 'public-service',
    quizSearchTerms: ['css', 'mpt', 'general knowledge', 'fpsc']
  },

  'fia': {
    title: 'FIA Jobs (Inspector/AD)',
    branch: 'Federal Government',
    branchSlug: 'fia',
    commissionType: 'BS-16/17 Officer',
    overview: 'Federal Investigation Agency (FIA) recruitment through FPSC for various posts including Assistant Director (AD) and Inspector Investigation.',
    quickFacts: [
      { label: 'Age', value: '20 – 28 Years (+5 yrs general relaxation)' },
      { label: 'Education', value: 'Bachelors / Masters' },
      { label: 'Height (Male)', value: '5 ft 6 inches' },
      { label: 'Height (Female)', value: '5 ft 2 inches' },
    ],
    eligibility: [
      'Second Class or Grade C Bachelor’s/Master’s Degree',
      'Physical fitness standards apply for uniformed posts (Inspector)',
      'Valid domicile for regional quota'
    ],
    selectionProcess: [
      { step: 1, title: 'Online Application', desc: 'Apply through FPSC portal when advertisement is published.' },
      { step: 2, title: 'Screening Test', desc: '100 marks MCQ test (English, General Intelligence, Everyday Science, Current Affairs).' },
      { step: 3, title: 'Descriptive Test', desc: 'For BS-17 posts, a subjective written test follows the screening test.' },
      { step: 4, title: 'Psychological Test', desc: 'For select executive posts.' },
      { step: 5, title: 'Interview', desc: 'FPSC panel interview.' },
      { step: 6, title: 'Final Merit List', desc: 'Selection and offer letters issued.' }
    ],
    training: 'FIA Academy Islamabad',
    commission: 'Federal Officer',
    officialUrl: 'https://fpsc.gov.pk',
    quizCategory: 'public-service',
    quizSearchTerms: ['fia', 'inspector', 'fpsc', 'general knowledge']
  }
