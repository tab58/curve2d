'use strict';

const _Math = require('../../math/math.js');
const Vector2 = _Math.Vector2;
const Vector3 = _Math.Vector3;

const GeomUtils = require('../geomUtils.js');
const GeneralizedConic = require('./generalizedConic.js');

const publicFunctions = {
  clone: function clone() {
    return Parabola2D.create(this.focus, this.directrix);
  },
  asGeneralizedConic: function asGeneralizedConic() {
    // a_1x+b_1y+c_1=0
    // u_1\ =\ a_1^2+b_1^2
    // (u_1-a_1^2)x^2+(-2a_1b_1)xy+(u_1-b_1^2)y^2+(-2u_1h-2a_1c_1)x+(-2u_1k-2b_1c_1)y+(u_1(h^2+k^2)-c_1^2)=0
    const l = this.directrix.getTriple();
    const p = this.focus;
    const a = l.x;
    const b = l.y;
    const c = l.z;
    const h = p.x;
    const k = p.y;

    const u = a * a + b * b;
    const A = u - a * a;
    const B = -2 * a * b;
    const C = u - b * b;
    const D = -2 * u * h - 2 * a * c;
    const E = -2 * u * k - 2 * b * c;
    const F = u * (h * h + k * k) - c * c;
    return GeneralizedConic.create(A, B, C, D, E, F);
  },
  isPointOnParabola: function isPointOnParabola(Q) {
    return GeomUtils.NumericalCompare.numbersAreEqual(this.focus.distanceTo(Q), this.directrix.distanceTo(Q));
  },
  intersectWithInfiniteLine: function intersectWithLine(line) {
    const pAsConic = publicFunctions.asGeneralizedConic.call(this);
    return pAsConic.intersectWithInfiniteLine(line);
  },
  intersectWithCircle: function intersectWithCircle(circle) {
    return circle.intersectWithGeneralizedConic(this.asGeneralizedConic());
  }
};

const Parabola2D = {
  create: function (focus, directrix) {
    const parabola = {};
    Object.assign(parabola, {
      focus: focus.clone(),
      directrix: directrix
    });
    Object.assign(parabola, publicFunctions);
    return parabola;
  }
};

module.exports = Parabola2D;
