const fs = require('fs');

const logPath = 'C:\\Users\\Yasin Jr\\.gemini\\antigravity\\brain\\639c1b7c-c095-4314-ad61-516b9e0616ec\\.system_generated\\logs\\transcript_full.jsonl';
const data = fs.readFileSync(logPath, 'utf8');
const lines = data.split('\n');
let lastUserInput = '';
for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i]) continue;
    try {
        const obj = JSON.parse(lines[i]);
        if (obj.type === 'USER_INPUT' && obj.content && obj.content.includes('PMA 159 Academic Test')) {
            lastUserInput = obj.content;
            console.log("Found user input of length:", lastUserInput.length);
            break;
        }
    } catch(e) {}
}

const ocrBlocks = [];
const regex = /==Start of OCR for page \d+==\n([\s\S]*?)\n==End of OCR for page \d+==/g;
let match;
while ((match = regex.exec(lastUserInput)) !== null) {
    ocrBlocks.push(match[1]);
}
console.log("Found OCR blocks:", ocrBlocks.length);

let fullText = ocrBlocks.join('\n');
console.log("Full text length:", fullText.length);
