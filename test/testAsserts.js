'use strict';

const assert = require('chai').assert;
const _Math = require('../math/math.js');

// Note: Machine epsilon for floating point 64-bit numbers is 1.11e-16.
const assertNumeric = {
  TEST_EPSILON: 1e-12,
  isZero: (x, msg) => assert(_Math.abs(x) < assertNumeric.TEST_EPSILON, msg),
  isGTZero: (x, msg) => assert(x > assertNumeric.TEST_EPSILON, msg),
  isLTZero: (x, msg) => assert(x < -assertNumeric.TEST_EPSILON, msg),
  numbersAreEqualish: (x, y, msg) => assertNumeric.isZero(_Math.abs(x - y), msg),
  vectorsAreEqualish: (x, y, msg) => assertNumeric.isZero(_Math.abs(x.length() - y.length()), msg)
};

module.exports = assertNumeric;
