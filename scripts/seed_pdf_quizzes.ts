import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const rawText = `
1. If Ali's present age is 5 years and Sidra is twice of Ali's age. Calculate age of Sidra when Ali is 11 years old.
Ans: 16

2. A Boy is 3 years old, his sister is 3 times older than him. What will be the age of his sister when the boy will be 11 years old?
Ans: 17

3. If my age is 10 years and brother is 2 times my age. What will be our ratio after 10 years?
Ans 2:3

4. Ali is 5 years old, his sister is 3 times older than him. What will be the age of his sister when Ali will be 10 years old?
Ans: 20

5. Salman is 4 years old. Ali's age is twice of Salman. When Salman is 12 years old what will be the age of Ali?
Ans: 16

6. Adil is 5 years old and his sister is 3 times his age. What will be the age of his sister when Adil will be 15 years old?
Ans: 25

7. A man walked towards north then he turned left. After some time he turned right, then the present direction will be
Ans: North.

8. Ali moves toward the north side after some time he turns left then again turns left, his present direction is
Ans: South.

9. A man walks towards north and then turn left then turn right, His present direction is
Ans: North

10. If Ahmad walks towards north and then turns left. What is his present direction?
Ans: West

11. Adnan walks 10 meters towards north, then towards south. After this he turns back and then moves towards left. What is his present direction?
Ans: West

12. Frank is taller than John & Ralph is taller than Frank. Who is shortest?
Ans: John

13. Azhar born in 2000 and Javed born in 2005, Aslam is older than Javed but younger than Azhar. Who is the oldest among them?
Ans: Azhar

14. Ali is younger than Ahmad and Yaqoob is older than Ahmad. Who is the youngest?
Ans: Ali

15. 90% of 90 is
Ans: 81

16. 80 % of 90 is
Ans: 72

17. 80% of 80 is
Ans: 64

18. 90% of 70 is
Ans: 63

19. 60% of 9 is
Ans: 5.4

20. 80% of 10 is
Ans: 8

21. One third of 10% of 90 is
Ans: 3

22. One third of 10% of 120 is
Ans: 4

23. 20% of one tenth of 90 is
Ans: 1.8

24. Out of 500 students, 360 are boys. The percentage of girls will be?
Ans: 28%

25. There are 30 passengers in a bus. 2/3 of them are men then the percentage of women is?
Ans: 33.33%.

26. In a class of 500, 340 are boys, find % of boys.
Ans: 68%

27. In a class of 1500 students, 1200 are present then the percentage of absent students will be
Ans: 20 %.

28. In a classroom out of 1500 students,1200 are present, find % of present students.
Ans: 80%

29. Out of 500 students 340 are present, percentage of absent will be
Ans: 32%

30. Which word shown in mirror same in Mirror (TITITIT)
Ans: TITITIT

31. 115 55 170 65 235 ?
Ans: 75

32. 66 63 57 45 ?
Ans: 24

33. 2,6,14,30,62 ?
Ans: 126

34. What will Come next 3, 7, 14, 18, 36, 40, ?
Ans 80

35. Quarter of one tenth of 120 is
Ans: 3

36. Quarter of 120 is
Ans: 30

37. One tenth of 90 is
Ans: 9

38. One tenth of 120 is
Ans: 12

39. One third of 120 is
Ans: 40

40. Half of 9/90 is
Ans: 0.05

41. 120*7=
Ans: 840

42. 1+2/2
Ans: 2

43. 2(2+2)=
Ans: 8

44. Half of quarter
Ans: 1/8

45. B,E,J,Q ?
Ans: Z

46. A,C,F,J,O ?
Ans: U

47. L,M,N ?
Ans: O

48. if z=2 and x=5 then
Ans: u=9

49. z=3 ,x=5 ,v=7 ,t=9 find next?
Ans: r=11

50. What will be the next A,E,K,?
Ans: S

51. AB/A. BC/B. CD/C. ?
Ans: DE/D

52. H, F, D, ?
Ans: B

53. J.H.F.D....=
Ans: B

54. A.E.K..
Ans: R

55. How many months have 31 days?
Ans: 7 months

56. Leap year comes after how many years?
Ans: 4 years

57. If yesterday was Sunday then the day after tomorrow will be?
Ans: Wednesday

58. If yesterday was Friday, tomorrow will be
Ans: Sunday.

59. If 28th day of a month is Sunday then the 2nd day will be
Ans: Tuesday.

60. If the 4th day of the month is Tuesday then the 26th day of the month will be
Ans: Wednesday.

61. If 4th day of month is Sunday the 19th day will be
Ans: Monday.

62. If 14th day of month is Sunday the 4th day of month will be
Ans: Thursday.

63. If 1st day of month is Monday, then the 12th day of month will be
Ans: Saturday.

64. If Second day of a month is Monday then the 12th day will be
Ans: Thursday

65. If 2nd day of month is Sunday the 23rd day will be
Ans: Sunday.

66. If 15th day of month is Monday the 4th day of month is
Ans: Thursday.

67. If 2nd day of a month is Friday, then 23rd day will be
Ans: Friday.

68. If 4th day of month is Sunday the 14th day is
Ans: Wednesday

69. If one dozen pencils is 27, then the price of 4 pencils is
Ans: 9

70. If 1 dozen pencils are of RS 60, the amount of 5 pencils will be
Ans: 25.

71. If one dozen eggs price is Rs:24. Then the price of 7 eggs?
Ans: 14

72. One dozen pencil's price is 15 then the price of 72 pencils?
Ans: 90

73. If my brother's sister is your mother, who am I to you?
Ans: Uncle

74. Sister of my brother's son is my
Ans: Niece.

75. My sister is your mother, what is the relation between you and me?
Ans: Nephew or Niece

76. A is Father of B but B is not A's Son then what is Relationship between B and A?
Ans: Daughter

77. A train speed is twice as that of a car. If a car covers 60 km in one hour then how much distance will the train cover in 30 minutes.
Ans: 60 km

78. Train speed is double that of a car and the car travels 30 km in 1 hour. How much distance the train will cover in 30 minutes.
Ans: 30 km

79. Train is moving at a speed of 90 Km/h. How much distance will it cover in 12 minutes?
Ans: 18Km

80. If a helicopter needs 50 gallons to move 320 km then how many gallons does a helicopter need to move 400 km?
Ans: 62.5

81. A man walks 20 km in 1 hour 40 minutes, how much time will it take to cover 1 km?
Ans: 5 minutes

82. If a bus moving with a speed of 60km/h and a train moving with a speed of twice then how much distance covered by train in 30 minutes?
Ans: 60 km

83. Ali bought a pen for Rs 30 and sold it for Rs 40. Profit will be
Ans: 33.33%

84. A person purchased a book for Rs. 500 and sold it for Rs. 700. Calculate the profit percentage.
Ans: 40%

85. Bat cannot Sea and Snake cannot
Ans: Hear.

86. Angle, Rectangle, Square, Hexagon
Ans: Angle

87. Cricket, Football, Tennis, Baseball
Ans: Football

88. Wheat, Hay, Rice, Maize
Ans: Hay

89. Monkey, Ape, Chimpanzee, Panda,
Ans: Panda

90. America, Africa, Asia, Euro
Ans: Euro

91. Sound of Eagle is
Ans: Scream.

92. Airplane flies due to
Ans: lift

93. Vehicle is to the wheels as Sound is to
Ans: waves

94. Dog is to bitch as horse is to
Ans: Mare

95. Parents give education to their children
Ans: to Groom them

96. We boil milk
Ans: to kill germs

97. Why do people read newspapers?
Ans: to get knowledge

98. Why do people use cars?
Ans: to travel

99. Why girls wear glasses
Ans: for eyesight

100. Why women go to bazaar
Ans: For Shopping

101. Last letter of UTYEAB after arranging it will be
Ans: Y

102. What will be the 3rd letter in word Management when it is alphabetically arranged?
Ans: G

103. Second letter when Augmented is arranged alphabetically will be
Ans: E.

104. After arranging Rapis, it is the name of a country, city, ocean and state.
Ans: City

105. Cold is to Ice Hot is to
Ans: Steam
`

function generateOptions(correctAnswer: string): string[] {
  const isNumber = !isNaN(parseFloat(correctAnswer.replace(/[^0-9.-]+/g,"")));
  const options = new Set<string>();
  options.add(correctAnswer);

  if (isNumber) {
    const num = parseFloat(correctAnswer.replace(/[^0-9.-]+/g,""));
    const isPercentage = correctAnswer.includes('%');
    const isKm = correctAnswer.toLowerCase().includes('km');
    const isMinutes = correctAnswer.toLowerCase().includes('minutes');
    
    while (options.size < 4) {
      const variation = (Math.random() - 0.5) * 2 * (num * 0.5 || 5);
      let newNum = Math.abs(Math.round((num + variation) * 100) / 100);
      if (newNum === num) newNum += 1;
      
      let newAns = newNum.toString();
      if (isPercentage) newAns += '%';
      if (isKm) newAns += ' km';
      if (isMinutes) newAns += ' minutes';
      if (correctAnswer.includes(':')) {
         const parts = correctAnswer.split(':');
         newAns = (parseInt(parts[0]) + Math.floor(Math.random() * 3)) + ':' + (parseInt(parts[1]) + Math.floor(Math.random() * 3));
      }
      options.add(newAns);
    }
  } else {
    // String options
    const possibleStrings = [
      "East", "West", "South", "North", 
      "Mother", "Father", "Brother", "Sister", "Uncle", "Niece", "Nephew", "Daughter",
      "Dog", "Cat", "Cow", "Horse", "Lion", "Tiger", "Panda", "Ape",
      "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
      "U", "V", "W", "X", "Y", "Z", "A", "B", "C", "D", "E",
      "to sleep", "to eat", "to travel", "to read", "to write", "for shopping", "for sightseeing",
      "City", "Country", "Ocean", "River"
    ];
    
    // Pick 3 random strings that are not the answer
    while (options.size < 4) {
      const randomStr = possibleStrings[Math.floor(Math.random() * possibleStrings.length)];
      if (randomStr.toLowerCase() !== correctAnswer.toLowerCase()) {
        options.add(randomStr);
      }
    }
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
}

async function run() {
  const blocks = rawText.trim().split(/\n\s*\n/);
  const questionsList = [];

  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length >= 2) {
      let qText = lines[0].replace(/^\d+\.\s*/, '').trim();
      let aText = lines[1].replace(/^Ans:\s*/i, '').trim();
      
      const options = generateOptions(aText);
      const correctIndex = options.indexOf(aText);

      questionsList.push({
        question_text: qText,
        options: options,
        correct_option_index: correctIndex
      });
    }
  }

  console.log(`Parsed ${questionsList.length} questions.`);

  const QUIZ_SIZE = 30;
  const numQuizzes = Math.ceil(questionsList.length / QUIZ_SIZE);

  for (let i = 0; i < numQuizzes; i++) {
    const slice = questionsList.slice(i * QUIZ_SIZE, (i + 1) * QUIZ_SIZE);
    
    // Create Quiz
    const { data: quiz, error: quizError } = await supabase.from('quizzes').insert({
      title: `PMA Initial Verbal Intelligence Test ${i + 1}`,
      description: `Attempt this PMA Initial Verbal Intelligence quiz. It contains ${slice.length} questions and evaluates your analytical and verbal skills.`,
      category: 'armed-forces'
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
