import fs from 'fs';
import readline from 'readline';
import path from 'path';

const logPath = 'C:\\Users\\Yasin Jr\\.gemini\\antigravity\\brain\\639c1b7c-c095-4314-ad61-516b9e0616ec\\.system_generated\\logs\\transcript_full.jsonl';
const outDir = path.join(__dirname, '..', 'scratch', 'pdfs');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function extract() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let inPdf = false;
  let pdfContent = [];
  let pdfCount = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    
    try {
      const obj = JSON.parse(line);
      if (obj.content && obj.content.includes('==Start of PDF==')) {
        const contentLines = obj.content.replace(/\\r/g, '').split('\n');
        for (const cl of contentLines) {
          const tcl = cl.trim();
          if (tcl === '==Start of PDF==') {
            inPdf = true;
            pdfContent = [];
          } else if (tcl === '==End of PDF==') {
            if (inPdf) {
              pdfCount++;
              fs.writeFileSync(path.join(outDir, `pdf_${pdfCount}.txt`), pdfContent.join('\n'));
              console.log(`Saved pdf_${pdfCount}.txt`);
            }
            inPdf = false;
          } else if (inPdf) {
            pdfContent.push(cl);
          }
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  console.log(`Done. Found ${pdfCount} PDFs.`);
}

extract();
