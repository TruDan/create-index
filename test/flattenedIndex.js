/* eslint-disable no-restricted-syntax */

import fs from 'fs';
import path from 'path';
import {
  expect,
} from 'chai';
import writeIndex from '../src/utilities/writeIndex';
import codeExample from './codeExample';

const readFile = (filePath) => {
  return fs.readFileSync(filePath, 'utf8');
};

const fixturesPath = path.resolve(__dirname, 'fixtures/flattened-index');

describe('flattenedIndex()', () => {
  it('creates flattened index in target directory', () => {
    const indexFilePath = path.resolve(fixturesPath, 'with-config/index.js');

    writeIndex([path.resolve(fixturesPath, 'with-config')]);
    const indexCode = readFile(indexFilePath);

    expect(indexCode).to.equal(codeExample(`
// @create-index {"flatten":true}

export * from './bar';
export * from './foo';
export * from './misc.js';
`));
  });
});
