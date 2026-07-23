const fs = require('fs');

const rawTextPath = 'scratch/raw_pdf_text.txt';

async function parse() {
  console.log("Reading raw PDF text...");
  const rawText = fs.readFileSync(rawTextPath, 'utf8');
  
  // Split by page breaks
  const pages = rawText.split(/----------------Page \(\d+\) Break----------------/);
  console.log(`Found ${pages.length} pages in raw text.`);

  const orderedLines = [];

  for (let i = 0; i < pages.length; i++) {
    const pageText = pages[i];
    // Split into lines, reverse them to fix the bottom-up extraction layout
    const lines = pageText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    lines.reverse();
    orderedLines.push(...lines);
  }

  console.log(`Reconstructed total lines: ${orderedLines.length}`);
  fs.writeFileSync('scratch/ordered_lines.txt', orderedLines.join('\n'));

  // Now, parse the ordered lines
  const questions = [];
  let currentQuestion = null;

  for (let i = 0; i < orderedLines.length; i++) {
    const line = orderedLines[i].trim();
    if (!line) continue;

    // A question starts with a number like "1." or "100."
    // Be careful to match question numbering like "1. " but not lines that are just numbers or series
    const qMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (qMatch) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        number: parseInt(qMatch[1]),
        text: qMatch[2].trim(),
        optionsLines: [],
        correctAnswer: null
      };
      continue;
    }

    if (currentQuestion) {
      // Check if it's the answer line
      const ansMatch = line.match(/^[\uf0fc\u2714\u2713\u221A✔✓\s]*([a-eA-E])(?:\+[a-eA-E])?$/i) || line.match(/^✔\s*([a-eA-E])/i);
      if (ansMatch) {
        currentQuestion.correctAnswer = ansMatch[1].toUpperCase();
        continue;
      }

      // Check if it has options (a), (b), etc.
      if (line.match(/\([a-e]\)/i)) {
        currentQuestion.optionsLines.push(line);
      } else {
        // If it's not an option line and not an answer line, and we haven't reached options yet, it's part of the question text
        if (currentQuestion.optionsLines.length === 0 && !currentQuestion.correctAnswer) {
          currentQuestion.text += " " + line;
        }
      }
    }
  }

  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  console.log(`Initially parsed ${questions.length} questions.`);

  // Post-process the options and answers
  const processed = questions.map(q => {
    const optionsText = q.optionsLines.join(' ');
    const optRegex = /\(([a-e])\)\s*([^()]+)/gi;
    let match;
    const optionsMap = {};
    while ((match = optRegex.exec(optionsText)) !== null) {
      const label = match[1].toLowerCase();
      const content = match[2].trim();
      optionsMap[label] = content;
    }

    const options = [];
    const labels = ['a', 'b', 'c', 'd', 'e'];
    for (const label of labels) {
      if (optionsMap[label] !== undefined) {
        options.push(optionsMap[label]);
      }
    }

    let correctOptionIndex = -1;
    if (q.correctAnswer) {
      correctOptionIndex = labels.indexOf(q.correctAnswer.toLowerCase());
    }

    return {
      number: q.number,
      question_text: q.text,
      options: options,
      correct_option_index: correctOptionIndex,
      correct_letter: q.correctAnswer
    };
  });

  // Filter out duplicates and report errors
  console.log(`Total processed: ${processed.length}`);
  const emptyOptions = processed.filter(q => q.options.length === 0);
  const noAnswer = processed.filter(q => q.correct_option_index === -1);
  console.log(`Empty options: ${emptyOptions.length}`);
  console.log(`No correct answer: ${noAnswer.length}`);

  if (noAnswer.length > 0) {
    console.log("No answer samples:", noAnswer.slice(0, 5));
  }
  if (emptyOptions.length > 0) {
    console.log("Empty options samples:", emptyOptions.slice(0, 5));
  }

  fs.writeFileSync('scratch/parsed_verbal_questions_v2.json', JSON.stringify(processed, null, 2));
}

parse().catch(err => console.error(err));
