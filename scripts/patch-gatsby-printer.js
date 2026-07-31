const fs = require('fs');
const path = require('path');

const file = path.join(
  __dirname,
  '..',
  'node_modules',
  'gatsby-plugin-printer',
  'run-screenshots.js'
);

if (!fs.existsSync(file)) {
  process.exit(0);
}

const source = fs.readFileSync(file, 'utf8');
const patched = source.replace(
  'const browser = await puppeteer.launch(puppeteerLaunchOptions);',
  `const browser = await puppeteer.launch({
    ...puppeteerLaunchOptions,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      ...((puppeteerLaunchOptions && puppeteerLaunchOptions.args) || [])
    ]
  });`
);

if (patched !== source) {
  fs.writeFileSync(file, patched);
}
