// parse_easy_mcqs.ts
// This script extracts MCQs from the EasyMCQs PDF and saves them as JSON per subject.

import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { readFileSync } from 'fs';

// Supabase client (used later for verification, not required here)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Path to the EasyMCQs PDF (adjust if placed elsewhere)
const PDF_PATH = path.resolve('assets', 'EasyMCQs.pdf');

// Helpers to detect subject headings
const SUBJECTS = ['Biology', 'Computer Science', 'Physics'];
const subjectMap: Record<string, string[]> = {
  Biology: [],
  'Computer Science': [],
  Physics: [],
};

// Regex patterns for question detection
const QUESTION_REGEX = /^(\d+)[)\.\s]+(.+)/; // e.g., "1) Question text" or "1. Question"
const OPTION_REGEX = /^[A-E][)\.\s]+(.+)/i; // e.g., "A) option"
const ANSWER_LINE_REGEX = /^Answers?:/i; // lines that start answer list

interface MCQ {
  id: number;
  q: string;
  opts: string[];
  ans: number; // zero‑based index
}

async function extractQuestionsFromText(text: string): Promise<Record<string, MCQ[]>> {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const result: Record<string, MCQ[]> = { Biology: [], 'Computer Science': [], Physics: [] };
  let currentSubject = '';
  let currentQ: MCQ | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect subject headings – assume they appear in ALL CAPS or start with the subject name
    const subjectMatch = SUBJECTS.find(s => line.toLowerCase().startsWith(s.toLowerCase()));
    if (subjectMatch) {
      currentSubject = subjectMatch;
      continue;
    }

    const qMatch = line.match(QUESTION_REGEX);
    if (qMatch) {
      // finish previous question
      if (currentQ && currentSubject) {
        result[currentSubject].push(currentQ);
      }
      currentQ = { id: parseInt(qMatch[1]), q: qMatch[2].trim(), opts: [], ans: -1 };
      continue;
    }

    const optMatch = line.match(OPTION_REGEX);
    if (optMatch && currentQ) {
      currentQ.opts.push(optMatch[1].trim());
      continue;
    }
  }

  // Push the last pending question
  if (currentQ && currentSubject) {
    result[currentSubject].push(currentQ);
  }

  // Post‑process answers – look for lines like "1. A" or "1) B"
  const answerLines = lines.filter(l => ANSWER_LINE_REGEX.test(l));
  const answerMap: Record<number, number> = {};
  for (const ansLine of answerLines) {
    const parts = ansLine.split(/\s+/);
    for (const part of parts) {
      const m = part.match(/^(\d+)[)\.\s]*([A-E])/i);
      if (m) {
        const qId = parseInt(m[1]);
        const optIdx = m[2].toUpperCase().charCodeAt(0) - 65; // A->0
        answerMap[qId] = optIdx;
      }
    }
  }

  // Apply answers to each subject list
  for (const subj of Object.keys(result)) {
    for (const q of result[subj]) {
      if (answerMap[q.id] !== undefined) {
        q.ans = answerMap[q.id];
      } else {
        q.ans = 0; // fallback if not found
      }
    }
  }

  return result;
}

async function main() {
  if (!fs.existsSync(PDF_PATH)) {
    console.error('PDF not found at', PDF_PATH);
    return;
  }
  const dataBuffer = readFileSync(PDF_PATH);
  const data = await pdf(dataBuffer);
  const extracted = await extractQuestionsFromText(data.text);

  // Write each subject to its own JSON file for seeding scripts
  const outDir = path.resolve('output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  for (const subj of Object.keys(extracted)) {
    const filePath = path.join(outDir, `${subj.toLowerCase().replace(/\s+/g, '_')}.json`);
    fs.writeFileSync(filePath, JSON.stringify(extracted[subj], null, 2), 'utf-8');
    console.log(`Saved ${extracted[subj].length} questions for ${subj} → ${filePath}`);
  }
}

main();
