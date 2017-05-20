'use strict';

const path = require('path');

module.exports = {
  context: __dirname,
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: './index.js'
  }
};
