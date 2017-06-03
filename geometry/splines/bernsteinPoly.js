'use strict';

const _Math = require('../math/math.js');

const helpers = {
};

const bPolyFunctions = {
  evaluate: function evaluate (t) {

  }
};

module.exports = {
  /*
   *  An explicit Bezier takes the form B(t) = c_i * B_i(t), where B_i(t) is the ith Bernstein basis polynomial
   */
  create: function create () {
    const bPoly = {
      coefficients: new Float64Array([])
    };
    Object.assign(bPoly, bPolyFunctions);
    return bPoly;
  }
};
