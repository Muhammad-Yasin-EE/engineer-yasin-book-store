import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const rawText = `
1) Which statement is true for the word FLOWER?
a) R comes after W b) L comes before O
c) E comes after W d) None of these

2) Pen is to Ink, Pencil is to?
A) Write B) Draw C) Lead D) Sketch

3) Select the odd one out:
A) Horse B) Donkey C) Goat D) Kangaroo

4) Which number doesn't belong to the following series:
79 70 60 58 49 37
A) 58 B) 49 C) 79 D) 60

5) Which number is next in the series :
19/69 17/54 13/20
A) 96/11 B) 13/54 C) 11/0 D) 17/69

6) Which is the middle alphabet, if you rearrange the word
"CONSTITUTION" in descending alphabetical order.
A) U B) O C) I D) S

7) If B is taller than A, B and C are the same, then :
A) A is taller than C B) A is equal to C
C) C is shorter than A D) C is taller than A

8) If rearranged "amgreyn" is a:
A) Country B) Ocean
C) Planet D) None of these

9) If SOLID is to 37541 and RIVER is to 64896, then SOLDIER is to:
A) 3758964 B) 3756986 C) 3751496 D) 3759143

10) Next in the following series:
0.32 0.66 0.36 0.18
A) 0.40 B) 0.88 C) 0.63 D) 0.23

ANSWRES:
1. B 2. C 3. D 4. A 5. C 6. B 7. D 8. A 9. C 10. B

Directions:
In each of the following question, a number series is given with
one term missing. Choose the correct alternative that will
continue the same pattern and replace the question mark in
the given series

11. 1 ,9 ,25, 49, ?, 121
(a) 64 (b) 81 (c) 91 (d) 100 (e) None of these

12. 4, 7, 12, 19, 28, ?
(a) 30 (b) 36 (c) 39 (d) 49 (e) None of these

13. 11, 13, 17, 19, 23, 25, ?
(a) 26 (b) 27 (c) 29 (d) 37 (e) None of these

14. 6, 12, 21, ?, 48
(a) 33 (b) 38 (c) 40 (d) 45 (e) None of these

15. 2, 5, 9, ?, 20, 27
(a) 14 (b) 16 (c) 18 (d) 24 (e) None of these

16. 6, 11, 21, 36, 56, ?
(a) 42 (b) 51 (c) 81 (d) 91 (e) None of these

17. 10, 18, 28, 40, 54, 70, ?
(a) 85 (b) 86 (c) 87 (d) 88 (e) None of these

18. 120, 99, 80, 63, 48, ?
(a) 35 (b) 38 (c) 39 (d) 40 (e) Non

19. 22 ,24 ,28, ?, 52, 84
(a) 36 (b) 38 (c) 42 (d) 46 (e) None of these

20. 4832, 5840, 6848, ?
(a) 7815 (b) 7846 (c) 7856 (d) 7887 (e) None of these

21. 10, 100, 200, 310, ?
(a) 400 (b) 410 (c) 420 (d) 430 (e) None of these

22. 0, 2, 8, 14, ?, 39
(a) 20 (b) 23 (c) 24 (d) 25 (e) None of these

23. 28, 33, 31, 36, ?, 39
(a) 32 (b) 34 (c) 38 (d) 40 (e) None of these

24. 125, 80, 45, 20, ?
(a) 5 (b) 8 (c) 10 (d) 12 (e) None of these

25. 2, 15, 41, 80, ?
(a) 51 (b) 57 (c) 61 (d) 63 (e) None of these

26. 2, 15, 41, 80, ?
(a) 83 (b) 120 (c) 121 (d) 132 (e) Non

27. 6,17,39, 72, ?
(a) 83 (b) 94 (c) 116 (d) 127 (e) None of these

28. 325, 259, 204, 160, 127, 105, ?
(a) 94 (b) 96 (c) 98 (d) 100 (e) None of these

29. 1, 4, 10, 22, 46, ?
(a) 64 (b) 86 (c) 94 (d) 122 (e) None of these

30. 0.5, 0.55, 0.65, 0.8, ?
(a) 0.9 (b) 0.82 (c) 1 (d) 0.95 (e) None of these

31. 5, 6, 9, 15, ?, 40
(a) 21 (b) 25 (c) 27 (d) 33 (e) None of these

32. 2, 3, 5, 7, 11, 17, ?
(a) 12 (b) 13 (c) 14 (d) 15 (e) None of these

33. 4, 9, 25, ?, 121, 169, 289, 361
(a) 49 (b) 64 (c) 81 (d) 87 (e) None of these

34. 1, 9, 25, 49, 81, ?
(a) 100 (b) 112 (c) 121 (d) 144 (e) None of these

35. 1 ,1,4, 8, 9, 27, 16, ?
(a) 32 (b) 64 (c) 81 (d) 256 (e) None of these

36. 4, 12, 36, 108, ?
(a) 144 (b) 216 (c) 304 (d) 324 (e) None of these

37. 1, 1, 6, 24, ?, 270
(a) 100 (b) 104 (c) 108 (d) 120 (e) None of these

38. 240, ?, 120, 40, 10,2
(a) 180 (b) 240 (c) 420 (d) 480 (e) None of these

39. 4, 6, 9, 13.5
(a) 17.5 (b) 19 (c) 20.25 (d) 22.75 (e) None of these

40. 5760, 960, ?, 48, 16, 8
(a) 120 (b) 160 (c) 192 (d) 240 (e) None of these

41. 1, 2, 6, 7, 21, 22, 66, 67, ?
(a) 70 (b) 134 (c) 201 (d) 301 (e) None of these

42. 48, 24, 96, 48, 192, ?
(a) 76 (b) 90 (c) 201 (d) 301 (e) None of these

43. 1, 2, 3, 6, 9, 18, ?, 54
(a) 18 (b) 27 (c) 36 (d) 81 (e) None of these

44. 165, 195, 255, 285, 345; ?
(a) 375 (b) 390 (c) 420 (d) 435 (e) None of these

45. 9, 27, 31, 155, 161, 1127, ?
(a) 316 (b) 1135 (c) 1288 (d) 2254 (e) None of these

46. 2, 3, 3, 5, 10, 13, ?, 43, 172, 177
(a) 23 (b) 38 (c) 39 (d) 40 (e) None of these

47. 3, 15, ?, 63, 99, 143
(a) 27 (b) 35 (c) 45 (d) 56 (e) None of these

48. 7, 26, 63, 124, 215, 342, ?
(a) 391 (b) 421 (c) 481 (d) 511 (e) None of these

49. 3, 7, 15, ?, 63, 127,
(a) 30 (b) 31 (c) 47 (d) 52 (e) None of these

50. 4, 10, ?, 82, 244, 730, ?
(a) 24 (b) 28 (c) 77 (d) 218 (e) None of these

Answers
11. (b) 12. (c) 13. (b) 14. (a) 15. (c) 16. (c) 17. (d) 18. (a) 19. (a) 20. (c)
21. (d) 22. (c) 23. (b) 24. (a) 25. (c) 26. (b) 27. (e) 28. (a) 29. (c) 30. (d)
31. (b) 32. (b) 33. (a) 34. (c) 35. (b) 36. (d) 37. (d) 38. (b) 39. (c) 40. (c)
41. (c) 42. (c) 43. (b) 44. (c) 45. (d) 46. (c) 47. (b) 48. (d) 49. (b) 50. (b)
`;

function extractQuestions() {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const questionsList = [];
  
  let currentQ = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(\d+)[\)\.]\s*(.+)/);
    
    if (match) {
      if (currentQ) {
         questionsList.push(currentQ);
      }
      currentQ = { id: parseInt(match[1]), q: match[2], opts: [] };
    } else if (currentQ) {
      if (line.match(/^[a-eA-E][\)\.]/)) {
        // Options line
        let optsLine = line;
        let optMatches = [...optsLine.matchAll(/([a-eA-E][\)\.])\s*(.+?)(?=[a-eA-E][\)\.]|$)/g)];
        if (optMatches.length > 0) {
           for (const m of optMatches) {
             currentQ.opts.push(m[2].trim());
           }
        }
      }
    }
  }
  
  if (currentQ) questionsList.push(currentQ);

  // Extract answers
  const answers: any = {};
  for (const line of lines) {
    if (line.match(/^\d+\./) && line.includes('(')) {
       const parts = line.split(/(?=\d+\.)/g);
       for (const p of parts) {
         const m = p.trim().match(/^(\d+)\.\s*\(([a-e])\)/i);
         if (m) {
           answers[parseInt(m[1])] = m[2].toLowerCase().charCodeAt(0) - 97;
         }
       }
    } else if (line.match(/^\d+\.\s*[A-E]/)) {
       const parts = line.split(/(?=\d+\.)/g);
       for (const p of parts) {
         const m = p.trim().match(/^(\d+)\.\s*([A-E])/i);
         if (m) {
           answers[parseInt(m[1])] = m[2].toLowerCase().charCodeAt(0) - 97;
         }
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
  const questionsList = extractQuestions();
  console.log(`Extracted ${questionsList.length} questions.`);
  
  const QUIZ_SIZE = 25;
  const numQuizzes = Math.ceil(questionsList.length / QUIZ_SIZE);

  for (let i = 0; i < numQuizzes; i++) {
    const slice = questionsList.slice(i * QUIZ_SIZE, (i + 1) * QUIZ_SIZE);
    
    // Create Quiz
    const { data: quiz, error: quizError } = await supabase.from('quizzes').insert({
      title: `PMA Verbal Intelligence Test (Advanced) ${i + 1}`,
      description: `Attempt this advanced PMA Verbal Intelligence Practice Test. It contains ${slice.length} questions to evaluate your analytical and reasoning skills.`,
      category: 'armed-forces'
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
