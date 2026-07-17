import fs from 'fs';
import readline from 'readline';

const logPath = 'C:\\Users\\Yasin Jr\\.gemini\\antigravity\\brain\\639c1b7c-c095-4314-ad61-516b9e0616ec\\.system_generated\\logs\\transcript_full.jsonl';

async function test() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let count = 0;
  for await (const line of rl) {
    if (line.includes('==Start of PDF==')) {
      console.log('Found in line', count);
      try {
        const obj = JSON.parse(line);
        console.log('Type:', obj.type);
        console.log('Source:', obj.source);
        if (obj.content && obj.content.includes('==Start of PDF==')) console.log('Found in CONTENT');
        if (obj.thinking && obj.thinking.includes('==Start of PDF==')) console.log('Found in THINKING');
      } catch(e) {}
    }
    count++;
  }
}

test();
