const fs = require('fs');
const path = require('path');
const PDFParser = require("pdf2json");

const pdfPath = 'C:\\Users\\Yasin Jr\\.gemini\\antigravity\\brain\\7d503b83-a671-4c1a-8199-b2e49997f94f\\media__1784605260218.pdf';

async function parsePdfText(filePath) {
  return new Promise((resolve, reject) => {
    let pdfParser = new PDFParser(this, 1);
    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
      resolve(pdfParser.getRawTextContent());
    });
    pdfParser.loadPDF(filePath);
  });
}

async function parsePdf() {
  console.log("Reading and parsing PDF file using pdf2json...");
  const text = await parsePdfText(pdfPath);
  
  console.log("PDF parsed successfully. Total characters:", text.length);
  
  // Write raw text for debugging
  fs.writeFileSync('scratch/raw_pdf_text.txt', text);
  
  const lines = text.split('\n');
  const questions = [];
  let currentQuestion = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\r/g, '').trim();
    if (!line) continue;

    // Check if line starts a new question (e.g. "1. " or "100. ")
    const qMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (qMatch) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        number: parseInt(qMatch[1]),
        text: qMatch[2].trim(),
        options: [],
        correctAnswer: null,
        rawOptionsLines: []
      };
      continue;
    }

    if (currentQuestion) {
      // Check if it's an answer indicator
      // Checkmark characters: \uf0fc (), \u2714 (✔), \u2713 (✓)
      const ansMatch = line.match(/^[\uf0fc\u2714\u2713\u221A✔✓\s]*([a-eA-E])(?:\+[a-eA-E])?$/i) || line.match(/^✔\s*([a-eA-E])/i);
      if (ansMatch) {
        currentQuestion.correctAnswer = ansMatch[1].toUpperCase();
        continue;
      }

      // Check if it has options like (a) May (b) July
      if (line.match(/\([a-e]\)/i)) {
        currentQuestion.rawOptionsLines.push(line);
      } else {
        // If it doesn't match an option or answer, and we are still building the question, append to question text
        if (currentQuestion.options.length === 0 && currentQuestion.rawOptionsLines.length === 0 && !currentQuestion.correctAnswer) {
          currentQuestion.text += " " + line;
        }
      }
    }
  }

  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  console.log(`Parsed ${questions.length} raw questions.`);

  // Post-process raw options lines into an options array
  const processedQuestions = questions.map(q => {
    const optionsText = q.rawOptionsLines.join(' ');
    // Extract matches for (a) text, (b) text, etc.
    const optRegex = /\(([a-e])\)\s*([^()]+)/gi;
    let match;
    const optionsMap = {};
    while ((match = optRegex.exec(optionsText)) !== null) {
      const label = match[1].toLowerCase();
      const content = match[2].trim();
      optionsMap[label] = content;
    }

    // Convert map to array in order a, b, c, d, e
    const options = [];
    const labels = ['a', 'b', 'c', 'd', 'e'];
    for (const label of labels) {
      if (optionsMap[label] !== undefined) {
        options.push(optionsMap[label]);
      }
    }

    // Map correct answer letter to index
    let correctOptionIndex = -1;
    if (q.correctAnswer) {
      const correctLetter = q.correctAnswer.toLowerCase();
      correctOptionIndex = labels.indexOf(correctLetter);
    }

    return {
      number: q.number,
      question_text: q.question_text,
      options: options,
      correct_option_index: correctOptionIndex,
      correct_letter: q.correctAnswer
    };
  });

  fs.writeFileSync('scratch/parsed_verbal_questions.json', JSON.stringify(processedQuestions, null, 2));
  console.log("Saved parsed questions to scratch/parsed_verbal_questions.json");
}

parsePdf().catch(err => console.error("Error parsing PDF:", err));
