'use strict';

const GeomUtils = require('../geomUtils.js');
const _Math = require('../../math/math.js');
const Vector2 = _Math.Vector2;
const Vector3 = _Math.Vector3;
const Matrix3 = _Math.Matrix3;

const GeneralizedConic = require('./generalizedConic.js');

const helpers = {
  computeConicParameters: function computeConicParameters() {
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
    return [A, B, C, D, E, F];
  },
  convertToGeneralizedConic: function () {
    const paramArray = helpers.computeConicParameters.call(this);
    const A = paramArray[0];
    const B = paramArray[1];
    const C = paramArray[2];
    const D = paramArray[3];
    const E = paramArray[4];
    const F = paramArray[5];
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
    const C = this.center;
    const a = this.semimajor;
    const b = this.semiminor;
    // TODO: roation should be dependent on e0 and e1 need to be
    const e0 = _Math.max(a, b);
    const e1 = _Math.min(a, b);
    const alpha = this.rotation;
    const beta = (alpha + (a < b ? _Math.PI / 2 : 0)) % (2 * _Math.PI);

    // Translate point and ellipse so that ellipse is in "standard position"
    const Y = Q.clone().sub(C).rotate(-beta);
    const signY0 = _Math.sign(Y.x);
    const signY1 = _Math.sign(Y.y);
    const y0 = _Math.abs(Y.x);
    const y1 = _Math.abs(Y.y);

    let x0 = 0;
    let x1 = 0;
    if (y1 > 0) {
      if (y0 > 0) {
        // Use bisection method to get root
        const options = {
          maxIterations: 1074,
          rootTolerance: 1e-15,
          lowerBound: -e1 * e1 + e1 * y1,
          upperBound: -e1 * e1 + _Math.sqrt(e0 * e0 * y0 * y0 + e1 * e1 * y1 * y1),
          initialValue: -e1 * e1 + e1 * y1
        };
        const tbar = _Math.RootFinders.bisectionMethod(t => {
          const t1 = (e0 * y0) / (t + e0 * e0);
          const t2 = (e1 * y1) / (t + e1 * e1);
          return t1 * t1 + t2 * t2 - 1;
        }, options);
        x0 = (e0 * e0 * y0) / (tbar + e0 * e0);
        x1 = (e1 * e1 * y1) / (tbar + e1 * e1);
      } else { // y0 === 0
        x0 = 0;
        x1 = e1;
      }
    } else { // y1 === 0
      if (y0 < ((e0 * e0 - e1 * e1) / e0)) {
        x0 = e0 * e0 * y0 / (e0 * e0 - e1 * e1);
        x1 = e1 * _Math.sqrt(1 - (x0 / e0) * (x0 / e0));
      } else {
        x0 = e0;
        x1 = 0;
      }
    }
    // move the point back into the right quadrant and move back to "original" position
    const X = new _Math.Vector2(x0 * signY0, x1 * signY1);
    return X.rotate(beta).add(C);
  },
  getClosestPointToLine: function (line) {
    const conic = helpers.convertToGeneralizedConic.call(this);
    const Q = conic.asMatrix3();
    const l = line.getTriple();

    const adjQ = Q.clone().adjugate();
    // pInf is the point at which all lines parallel to `line` cross each other
    const pInf = (new Vector3(0, 0, 1)).cross(l);
    const MpInf = (new Matrix3()).setSkewSymmetric(pInf);
    const MpInfTranspose = MpInf.clone().transpose();

    // D is a dual conic with 2 distinct lines, which are tangents
    // decompose and multiply by inverse Q to get dual points from lines
    const D = MpInfTranspose.multiply(adjQ).multiply(MpInf);
    const gh = GeneralizedConic.splitDegenerateConic(D);
    const g = gh[0];
    const h = gh[1];
    const P1 = g.multiplyMatrix3(adjQ);
    const P2 = h.multiplyMatrix3(adjQ);
    const p1 = new Vector2(P1.x / P1.z, P1.y / P1.z);
    const p2 = new Vector2(P2.x / P2.z, P2.y / P2.z);
    const d1 = line.distanceTo(p1);
    const d2 = line.distanceTo(p2);
    return (d1 > d2 ? p2 : p1);
  },
  intersectWithEllipse: function intersectWithEllipse (ellipse) {
    const argAsConic = helpers.convertToGeneralizedConic.call(ellipse);
    return this.intersectWithGeneralizedConic(argAsConic);
  },
  intersectWithInfiniteLine: function intersectWithInfiniteLine (line) {
    const thisAsConic = helpers.convertToGeneralizedConic.call(this);
    return thisAsConic.intersectWithInfiniteLine(line);
  },
  intersectWithCircle: function intersectWithCircle (circle) {
    return circle.intersectWithEllipse(this);
  },
  intersectWithGeneralizedConic: function intersectWithGeneralizedConic (conic) {
    return helpers.intersectWithGeneralizedConic.call(this, conic);
  },
  isPointOnEllipse: function isPointOnEllipse (Q) {
    const x = Q.x;
    const y = Q.y;

    // using conic parameters to eliminate catastrophic cancellation
    const paramArray = helpers.computeConicParameters.call(this);
    const A = paramArray[0];
    const B = paramArray[1];
    const C = paramArray[2];
    const D = paramArray[3];
    const E = paramArray[4];
    const F = paramArray[5];
    return GeomUtils.NumericalCompare.isZero(A * x * x + B * x * y + C * y * y + D * x + E * y + F);
  },
  clone: function clone() {
    return Ellipse2D.create(this.center, this.semimajor, this.semiminor, this.rotation);
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
