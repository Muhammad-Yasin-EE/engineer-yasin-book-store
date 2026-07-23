const fs = require('fs');
const path = require('path');
const PDFParser = require("pdf2json");
const { createClient } = require('@supabase/supabase-js');

// Manual env parsing
const envStr = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envStr.split('\n')) {
    if (line.includes('=')) {
        const [k, ...v] = line.split('=');
        env[k.trim()] = v.join('=').trim().replace(/['"]/g, '');
    }
}

const supabase = createClient(
  env['NEXT_PUBLIC_SUPABASE_URL'],
  env['SUPABASE_SERVICE_ROLE_KEY']
);

async function parsePdf(filePath) {
    return new Promise((resolve, reject) => {
        let pdfParser = new PDFParser(this, 1);
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError) );
        pdfParser.on("pdfParser_dataReady", pdfData => {
            let lines = [];
            for (let page of pdfData.Pages) {
                let texts = page.Texts;
                // Sort texts by y, then by x
                texts.sort((a, b) => {
                    if (Math.abs(a.y - b.y) < 0.5) return a.x - b.x;
                    return a.y - b.y;
                });
                
                let currentY = -1;
                let currentLine = "";
                for (let text of texts) {
                    let str = text.R[0].T;
                    try {
                        str = decodeURIComponent(str);
                    } catch (e) {
                        try {
                            str = unescape(str);
                        } catch(e2) {}
                    }
                    if (Math.abs(text.y - currentY) > 0.5) {
                        if (currentLine) lines.push(currentLine.trim());
                        currentLine = str;
                        currentY = text.y;
                    } else {
                        currentLine += " " + str;
                    }
                }
                if (currentLine) lines.push(currentLine.trim());
            }
            resolve(lines);
        });
        pdfParser.loadPDF(filePath);
    });
}

// Ordered list of 16 categories
const categories = [
    { id: 'admin', name: 'Admin (PAF)' },
    { id: 'pma-long-course', name: 'PMA Long Course (Army)' },
    { id: 'pn-cadet', name: 'PN Cadet (Navy)' },
    { id: 'gd-pilot', name: 'GD Pilot (PAF)' },
    { id: 'lcc', name: 'LCC (Army)' },
    { id: 'ssc', name: 'SSC (Navy)' },
    { id: 'aeronautical-engineering', name: 'Aeronautical Engineering (PAF)' },
    { id: 'dssc', name: 'DSSC (Army)' },
    { id: 'marines', name: 'Marines (Navy)' },
    { id: 'air-defence', name: 'Air Defence (PAF)' },
    { id: 'tcc', name: 'TCC (Army)' },
    { id: 'sailor', name: 'Sailor (Navy)' },
    { id: 'accounts', name: 'Accounts (PAF)' },
    { id: 'afns', name: 'AFNS (Army)' },
    { id: 'civilian', name: 'Civilian (Navy)' },
    { id: 'soldier', name: 'Soldier (Army)' }
];

async function processPdfs() {
    const pdfDir = 'C:\\\\Users\\\\Yasin Jr\\\\.gemini\\\\antigravity\\\\brain\\\\d3b805d4-4bdd-4230-b555-82da6e5b8fbb\\\\';
    const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
    
    let allQuestions = [];
    
    for (const file of files) {
        console.log(`Reading ${file}...`);
        const filePath = path.join(pdfDir, file);
        let lines = await parsePdf(filePath);
        
        const isAnswerStart = (line) => /^Ans:|Answer:|Ans\s+|^\s*[✓✔]/i.test(line) || /correct/i.test(line);
        const isQuestionStart = (line) => /^(?:Q\s*)?\d+\.\s/i.test(line);
        
        let currentQuestion = null;
        let currentAnswer = null;
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].replace(/\r/g, '');
            
            // e.g. "1. What is..." or "Q1. What is..."
            if (isQuestionStart(line)) {
                if (currentQuestion && currentAnswer) {
                    allQuestions.push({ q: currentQuestion, a: currentAnswer });
                }
                currentQuestion = line.replace(/^(?:Q\s*)?\d+\.\s*/i, '').trim();
                currentAnswer = null;
            } 
            // e.g. "Ans: A", "Answer: A", or "correct", or ends with "correct"
            else if (isAnswerStart(line) && currentQuestion && currentAnswer === null) {
                // if line is "     Ear correct" -> extract "Ear"
                let ans = line.replace(/^(Ans:|Answer:|Ans\s+|[✓✔]\s*|correct answer\s*)/i, '').replace(/correct/ig, '').replace(/^[•*]\s*/, '').trim();
                if (ans.length > 0) {
                    currentAnswer = ans;
                } else if (i + 1 < lines.length && !/^(?:Q\s*)?\d+\.\s/i.test(lines[i+1])) {
                    currentAnswer = lines[i+1].replace(/^[•*]\s*/, '').trim();
                    i++;
                }
            } else if (currentQuestion && currentAnswer === null) {
                // Add to question or ignore if it's an option without "correct"
                // Actually, the PDFs have options like:
                //      Ear correct
                //      Hand
                // If it doesn't have "correct", it's an option. We don't strictly need to parse all options because we generate random ones later from the pool.
                if (!/^[•*]\s*/.test(line) && !line.startsWith('Explanation:') && !line.match(/^[-_]+Page/)) {
                    currentQuestion += ' ' + line;
                }
            }
        }
        if (currentQuestion && currentAnswer) {
            allQuestions.push({ q: currentQuestion, a: currentAnswer });
        }
    }
    
    console.log(`Extracted total ${allQuestions.length} raw questions.`);
    
    let uniqueQuestions = [];
    let seen = new Set();
    for (let qa of allQuestions) {
        if (qa.q.length > 300 || qa.a.length > 200 || qa.q.length < 5 || qa.a.length === 0) continue; 
        let normalizedQ = qa.q.toLowerCase().trim();
        if (!seen.has(normalizedQ)) {
            seen.add(normalizedQ);
            uniqueQuestions.push(qa);
        }
    }
    console.log(`Unique good questions: ${uniqueQuestions.length}`);
    
    const chunkSize = 84;
    let quizCount = 0;
    let answersPool = uniqueQuestions.map(q => q.a).filter(a => a.length > 0 && a.length < 50);
    
    for (let i = 0; i < uniqueQuestions.length; i += chunkSize) {
        let chunk = uniqueQuestions.slice(i, i + chunkSize);
        
        if (chunk.length < chunkSize) {
            console.log(`Skipping last chunk of ${chunk.length} questions as it's not complete 84.`);
            break;
        }
        
        let categoryInfo = categories[quizCount % categories.length];
        let quizTitle = `${categoryInfo.id} Verbal Intelligence Test`;
        
        const { data: quizData, error: qErr } = await supabase.from('quizzes').insert({
            title: quizTitle,
            category: 'armed-forces', 
            description: `Mock Test of 84 Verbal Intelligence Questions for ${categoryInfo.name}`
        }).select().single();
        
        if (qErr) {
            console.error(`Quiz create error for ${quizTitle}:`, qErr);
            continue;
        }
        
        let questionsToInsert = [];
        for (let qa of chunk) {
            let correctAns = qa.a;
            let options = new Set([correctAns]);
            while (options.size < 4 && answersPool.length > 4) {
                let randomA = answersPool[Math.floor(Math.random() * answersPool.length)];
                options.add(randomA);
            }
            let optionsArr = Array.from(options);
            optionsArr = optionsArr.sort(() => 0.5 - Math.random());
            let correctIdx = optionsArr.indexOf(correctAns);
            
            questionsToInsert.push({
                quiz_id: quizData.id,
                question_text: qa.q,
                options: optionsArr,
                correct_option_index: correctIdx
            });
        }
        
        const { error: insErr } = await supabase.from('quiz_questions').insert(questionsToInsert);
        if (insErr) {
            console.error(`Questions insert error for ${quizTitle}:`, insErr);
        } else {
            console.log(`Created Quiz: ${quizTitle} with ${questionsToInsert.length} questions for ${categoryInfo.name}.`);
        }
        
        quizCount++;
    }
    
    console.log("Database insertion done!");
}

processPdfs().catch(console.error);
