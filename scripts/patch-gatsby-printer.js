const fs = require('fs');
const path = require('path');

const file = path.join(
  __dirname,
  '..',
  'node_modules',
  'gatsby-plugin-printer',
  'run-screenshots.js'
);
const gatsbyNodeFile = path.join(
  __dirname,
  '..',
  'node_modules',
  'gatsby-plugin-printer',
  'gatsby-node.js'
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

if (fs.existsSync(gatsbyNodeFile)) {
  const gatsbyNodeSource = fs.readFileSync(gatsbyNodeFile, 'utf8');
  const gatsbyNodePatched = gatsbyNodeSource.replace(
    'exports.onPostBuild = async ({ graphql, cache }, pluginOptions) => {',
    `exports.onPostBuild = async ({ graphql, cache }, pluginOptions) => {
  if (process.env.GATSBY_SKIP_PRINTER === 'true') {
    return;
  }`
  );

  if (gatsbyNodePatched !== gatsbyNodeSource) {
    fs.writeFileSync(gatsbyNodeFile, gatsbyNodePatched);
  }
}
