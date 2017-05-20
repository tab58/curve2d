'use strict';

const GeomUtils = require('./analyticalUtils.js');
const _Math = require('../math/math.js');
// const Vector2 = _Math.Vector2;

const GeneralizedConic = require('./generalizedConic.js');
const InfiniteLine2D = require('./infiniteLine2d.js');

const helpers = {
  convertToGeneralizedConic: function () {
    const h = this.center.x;
    const k = this.center.y;
    const a = this.semimajor;
    const b = this.semiminor;
    const alpha = this.rotation;

    const ca = _Math.cos(alpha);
    const sa = _Math.sin(alpha);
    const s2a = _Math.sin(2 * alpha);

    const bCos = b * ca;
    const bSin = b * sa;
    const aCos = a * ca;
    const aSin = a * sa;

    const A = aSin * aSin + bCos * bCos;
    const B = (b * b - a * a) * s2a;
    const C = aCos * aCos + bSin * bSin;
    const D = (a * a - b * b) * k * s2a - 2 * h * (aSin * aSin + bCos * bCos);
    const E = (a * a - b * b) * h * s2a - 2 * k * (aCos * aCos + bSin * bSin);
    const F = (a * a * h * h + b * b * k * k) * sa * sa + (a * a * k * k + b * b * h * h) * ca * ca +
      h * k * (b * b - a * a) * s2a - a * a * b * b;
    return GeneralizedConic.create(A, B, C, D, E, F);
  },
  intersectWithGeneralizedConic: function (conic) {
    const thisAsConic = this.asGeneralizedConic();
    return thisAsConic.intersectWithGeneralizedConic(conic);
  }
};

const ellipse2dFunctions = {
  asGeneralizedConic: function asGeneralizedConic () {
    return helpers.convertToGeneralizedConic.call(this);
  },
  getClosestPointToPoint: function (Q) {
    // const C = this.center;
    // const D = Q.clone().sub(C).normalize();
    // const L = InfiniteLine2D.create(C, D);
    // const I = ellipse2dFunctions.intersectWithInfiniteLine.call(this, L);
    // if (I.length === 0) {
    //   throw new Error('Could not get closest point to ellipse.');
    // }
    // let minDistance = I[0].distanceTo(Q);
    // let minIntx = I[0];
    // for (let i = 1; i < I.length; ++i) {
    //   const dist = I[i].distanceTo(Q);
    //   if (dist < minDistance) {
    //     minDistance = dist;
    //     minIntx = I[i];
    //   }
    // }
    // return minIntx;
  },
  intersectWithEllipse: function intersectWithEllipse (ellipse) {
    const argAsConic = helpers.convertToGeneralizedConic.call(ellipse);
    return this.intersectWithGeneralizedConic(argAsConic);
  },
  intersectWithInfiniteLine: function intersectWithInfiniteLine (line) {
    const thisAsConic = helpers.convertToGeneralizedConic.call(this);
    return thisAsConic.intersectWithInfiniteLine(line);
  },
  intersectWithGeneralizedConic: function intersectWithGeneralizedConic (conic) {
    return helpers.intersectWithGeneralizedConic.call(this, conic);
  },
  isPointOnEllipse: function isPointOnEllipse (Q) {
    const x = Q.x;
    const y = Q.y;
    const h = this.center.x;
    const k = this.center.y;
    const a = this.semimajor;
    const b = this.semiminor;
    const A = this.rotation;
    const cA = _Math.cos(A);
    const sA = _Math.sin(A);

    const numA = +(x - h) * cA + (y - k) * sA;
    const numB = -(x - h) * sA + (y - k) * cA;

    return GeomUtils.NumericalCompare.isZero((numA * numA) / (a * a) + (numB * numB) / (b * b) - 1);
  }
};

const Ellipse2D = {
  create: function create (center, semimajor, semiminor, rotation) {
    const ellipse = {
      center,     // (h, k)
      semimajor,  // a
      semiminor,  // b
      rotation: rotation % _Math.PI // angle between semimajor and x-axis
    };
    Object.assign(ellipse, ellipse2dFunctions);
    return ellipse;
  }
};

module.exports = Ellipse2D;
