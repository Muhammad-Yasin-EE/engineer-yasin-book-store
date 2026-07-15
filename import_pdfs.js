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
            resolve(pdfParser.getRawTextContent());
        });
        pdfParser.loadPDF(filePath);
    });
}

async function processPdfs() {
    const pdfDir = 'C:\\Users\\Yasin Jr\\.gemini\\antigravity\\brain\\639c1b7c-c095-4314-ad61-516b9e0616ec\\';
    const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
    
    let allQuestions = [];
    
    for (const file of files) {
        console.log(`Reading ${file}...`);
        const filePath = path.join(pdfDir, file);
        let text = await parsePdf(filePath);
        
        let lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        let currentQuestion = null;
        let currentAnswer = null;
        
        const isQuestionStart = (line) => /^\d+\.\s/.test(line);
        const isAnswerStart = (line) => /^Ans:|Answer:|Ans\s+/i.test(line);
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].replace(/\r/g, '');
            
            if (isQuestionStart(line)) {
                if (currentQuestion && currentAnswer) {
                    allQuestions.push({ q: currentQuestion, a: currentAnswer });
                }
                currentQuestion = line.replace(/^\d+\.\s*/, '').trim();
                currentAnswer = null;
            } else if (isAnswerStart(line) && currentQuestion && currentAnswer === null) {
                currentAnswer = line.replace(/^(Ans:|Answer:|Ans\s+)\s*/i, '').trim();
                if (currentAnswer === '' && i + 1 < lines.length && !isQuestionStart(lines[i+1])) {
                    currentAnswer = lines[i+1].replace(/\r/g, '');
                    i++;
                }
            } else if (currentQuestion && currentAnswer === null && !line.startsWith('Explanation:') && !line.startsWith('●') && !line.startsWith('Compiled by') && !line.startsWith('Pro Genius') && !line.startsWith('Website:') && !line.match(/^[-_]+Page/)) {
                currentQuestion += ' ' + line;
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
        if (qa.q.length > 300 || qa.a.length > 200) continue; 
        let normalizedQ = qa.q.toLowerCase().trim();
        if (!seen.has(normalizedQ)) {
            seen.add(normalizedQ);
            uniqueQuestions.push(qa);
        }
    }
    console.log(`Unique good questions: ${uniqueQuestions.length}`);
    
    const { data: existingQuizzes } = await supabase.from('quizzes').select('id').like('title', 'PMA 159 Academic Test %');
    if (existingQuizzes && existingQuizzes.length > 0) {
        const ids = existingQuizzes.map(q => q.id);
        await supabase.from('quizzes').delete().in('id', ids);
        console.log(`Deleted ${ids.length} existing PMA 159 quizzes to re-insert fresh.`);
    }

    const chunkSize = 30;
    let quizCount = 1;
    let answersPool = uniqueQuestions.map(q => q.a).filter(a => a.length > 0 && a.length < 50);
    
    for (let i = 0; i < uniqueQuestions.length; i += chunkSize) {
        let chunk = uniqueQuestions.slice(i, i + chunkSize);
        let quizTitle = `PMA 159 Academic Test ${quizCount}`;
        
        const { data: quizData, error: qErr } = await supabase.from('quizzes').insert({
            title: quizTitle,
            category: 'PMA LC',
            description: 'Preparation for PMA Long Course Initial Test'
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
            console.log(`Created Quiz: ${quizTitle} with ${questionsToInsert.length} questions.`);
        }
        
        quizCount++;
    }
    
    console.log("Done!");
}

processPdfs().catch(console.error);
