const fs_mkdirPromise = require('util').promisify(require('fs').mkdir);

const fs_existsPromise = require('util').promisify(require('fs').exists);

// @flow
const fs = require('fs');

const path = require('path');

module.exports = function (p: string): void {
  const partsSoFar = [];

  if (/^win/.test(process.platform)) {
    throw new Error('this function is not currently compatible with Windows');
  }

  for (const [arrayIteratorIndex, part] of p.split(path.sep).entries()) {
    partsSoFar.push(part);
    const dirname = '/' + path.join(...partsSoFar);

    if (!(await fs_existsPromise(dirname))) {
      await fs_mkdirPromise(dirname);
    }
  }
};