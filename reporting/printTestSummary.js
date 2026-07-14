const fs = require('fs');

const resultsPath = process.argv[2] || 'results.json';
const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

const { expected = 0, unexpected = 0, flaky = 0, skipped = 0 } = data.stats ?? {};
const total = expected + unexpected + flaky + skipped;

const lines = [
  '## Playwright Test Summary',
  '',
  '| Total | Passed | Failed | Flaky | Skipped |',
  '|-------|--------|--------|-------|---------|',
  `| ${total} | ${expected} | ${unexpected} | ${flaky} | ${skipped} |`,
];

const summary = lines.join('\n') + '\n';

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
} else {
  console.log(summary);
}
