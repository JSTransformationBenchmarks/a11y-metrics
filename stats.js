// @flow

const fs = require('fs');
const cbStringify = require('csv-stringify');

const getAxeStats = require('./lib/axe-stats');
const getGithubStats = require('./lib/github-stats');
const getWebsites = require('./lib/websites');

const OUTPUT_CSV = 'stats.csv';

function stringify(input /*: Array<any> */) /*: Promise<string> */ {
  return new Promise((resolve, reject) => {
    cbStringify(input, (err, output) => {
      if (err) {
        return reject(err);
      }
      resolve(output);
    });
  });
}

async function main() {
  const rows = [[
    'Homepage',
    'GitHub Repository',
    'GitHub issues (open and closed) mentioning accessibility',
    'aXe violations on front page',
    'aXe passes on front page'
  ]];

  const websites = await getWebsites();

  for (let website of websites) {
    const github = await getGithubStats(website.repo);
    const axe = await getAxeStats(website.homepage);

    rows.push([
      website.homepage,
      website.repo,
      github.data.total_count,
      axe.violations.length,
      axe.passes.length
    ]);
  }

  fs.writeFileSync(OUTPUT_CSV, await stringify(rows));
  console.log(`Wrote ${OUTPUT_CSV}.`);
}

if (module.parent === null) {
  require('./lib/run-script')(main);
}
