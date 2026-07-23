const fs = require('fs');
let content = fs.readFileSync('lib/data/armedForcesData.ts', 'utf8');

let categories = [
    'admin', 'pma-long-course', 'pn-cadet', 'gd-pilot', 'lcc', 'ssc',
    'aeronautical-engineering', 'dssc', 'marines', 'air-defence', 'tcc',
    'sailor', 'accounts', 'afns', 'civilian', 'soldier'
];

for (let cat of categories) {
    let regex = new RegExp(`('${cat}'|"${cat}")\\s*:\\s*\\{([\\s\\S]*?)quizSearchTerms\\s*:\\s*\\[.*?\\]`, 'g');
    content = content.replace(regex, (match, p1, p2) => {
        return `${p1}: {${p2}quizSearchTerms: ['${cat}']`;
    });
}

fs.writeFileSync('lib/data/armedForcesData.ts', content);
console.log('Updated armedForcesData.ts');
