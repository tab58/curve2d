'use strict';

const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

const testDir = 'test/conics';
const testFiles = fs.readdirSync(testDir);

// Instantiate a Mocha instance.
const mocha = new Mocha();
const args = process.argv;

if (args.length > 2) {
  // node is 1st, this file is 2nd
  const specificTests = args[2];
  const isFileInTestDir = testFiles.reduce((acc, file) => acc || file , false);

} else {
  runAllTests();
}

function runAllTests() {
  // Add each .js file to the mocha instance
  // Only keep the .js files
  testFiles.filter(file => file.substr(-3) === '.js')
    .forEach(file => mocha.addFile(path.join(testDir, file)));

  // Run the tests.
  mocha.run(failures => {
    process.on('exit', () => {
      process.exit(failures);  // exit with non-zero status if there were failures
    });
  });
}