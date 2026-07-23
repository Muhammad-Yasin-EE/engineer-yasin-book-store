const { armedForcesData } = require('./lib/data/armedForcesData');

console.log("Exam Keys and search configs:");
for (const [key, info] of Object.entries(armedForcesData)) {
  console.log(`- Key: ${key} | Title: ${info.title} | Branch: ${info.branch} | Category: ${info.quizCategory} | SearchTerms: ${JSON.stringify(info.quizSearchTerms)}`);
}
