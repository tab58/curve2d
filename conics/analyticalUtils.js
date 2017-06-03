'use strict';

const _Math = require('../math/math.js');

const EPSILON = 1e-10;

const GeomUtils = {
  DEBUG: false,
  NumericalCompare: {
    EPSILON: EPSILON,
    isZero: function isZero (x) {
      return _Math.Utils.isZero(x, EPSILON);
    },
    isGTZero: function isGTZero (x) {
      return _Math.Utils.isGTZero(x, EPSILON);
    },
    isLTZero: function isLTZero (x) {
      return _Math.Utils.isLTZero(x, EPSILON);
    },
    numbersAreEqual: function isEqual (x, y) {
      return GeomUtils.NumericalCompare.isZero(x - y);
    },
    vector2AreEqual: function (x, y) {
      return _Math.Utils.vector2AreEqual(x, y, EPSILON);
    },
    vector3AreEqual: function (x, y) {
      return _Math.Utils.vector3AreEqual(x, y, EPSILON);
    },
    selectDistinctVector2: function (args) {
      return _Math.Utils.selectDistinctVector2(args, EPSILON);
    }
  }
};

module.exports = GeomUtils;
