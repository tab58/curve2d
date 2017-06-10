'use strict';

const _Math = require('../math/math.js');

const GeomUtils = {
  NumericalCompare: {
    EPSILON: 1e-12, // default value, can be changed programatically to arbitrary value at runtime
    isZero: function isZero (x) {
      return _Math.Utils.isZero(x, GeomUtils.NumericalCompare.EPSILON);
    },
    isGTZero: function isGTZero (x) {
      return _Math.Utils.isGTZero(x, GeomUtils.NumericalCompare.EPSILON);
    },
    isLTZero: function isLTZero (x) {
      return _Math.Utils.isLTZero(x, GeomUtils.NumericalCompare.EPSILON);
    },
    numbersAreEqual: function isEqual (x, y) {
      return GeomUtils.NumericalCompare.isZero(x - y);
    },
    vector2AreEqual: function (x, y) {
      return _Math.Utils.vector2AreEqual(x, y, GeomUtils.NumericalCompare.EPSILON);
    },
    vector3AreEqual: function (x, y) {
      return _Math.Utils.vector3AreEqual(x, y, GeomUtils.NumericalCompare.EPSILON);
    },
    selectDistinctVector2: function (args) {
      return _Math.Utils.selectDistinctVector2(args, GeomUtils.NumericalCompare.EPSILON);
    }
  }
};

module.exports = GeomUtils;
