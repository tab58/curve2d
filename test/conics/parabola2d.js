'use strict';

/* global describe it before after */
const assert = require('chai').assert;
const _Math = require('../../math/math.js');
const Testing = require('../testAsserts.js');

const Geometry = require('../../geometry/geometry.js');
const InfiniteLine2D = Geometry.InfiniteLine2D;
const Circle2D = Geometry.Circle2D;
const Ellipse2D = Geometry.Ellipse2D;
const Parabola2D = Geometry.Parabola2D;

let oldEpsilon = 0;

describe('Parabola2D', () => {
  before(() => {
    const GeomUtils = require('../../geometry/geomUtils.js');
    oldEpsilon = GeomUtils.NumericalCompare.EPSILON;
    GeomUtils.NumericalCompare.EPSILON = Testing.TEST_EPSILON;
  });
  after(() => {
    const GeomUtils = require('../../geometry/geomUtils.js');
    GeomUtils.NumericalCompare.EPSILON = oldEpsilon;
  });
  it('#asGeneralizedConic()', () => {
    const F1 = new _Math.Vector2(1, 1);
    const D1 = InfiniteLine2D.create(new _Math.Vector2(0, 0), new _Math.Vector2(-1, 1));
    const P1 = Parabola2D.create(F1, D1);

    const p1Conic = P1.asGeneralizedConic();
    const def = p1Conic.definition;
    const errorMsg = 'Conic terms are wrong: ';
    Testing.numbersAreEqualish(def.A, 0.5, errorMsg + 'A');
    Testing.numbersAreEqualish(def.B, -1, errorMsg + 'B');
    Testing.numbersAreEqualish(def.C, 0.5, errorMsg + 'C');
    Testing.numbersAreEqualish(def.D, -2, errorMsg + 'D');
    Testing.numbersAreEqualish(def.E, -2, errorMsg + 'E');
    Testing.numbersAreEqualish(def.F, 2, errorMsg + 'F');
  });
  it('#isPointOnParabola()', () => {
    const F1 = new _Math.Vector2(1, 1);
    const D1 = InfiniteLine2D.create(new _Math.Vector2(0, 0), new _Math.Vector2(-1, 1));
    const P1 = Parabola2D.create(F1, D1);
    const Q = new _Math.Vector2(2, 0);

    assert(P1.isPointOnParabola(Q), 'Point is not on parabola.');
  });
  it('#intersectWithInfiniteLine()', () => {
    const F = new _Math.Vector2(1, 1);
    const D = InfiniteLine2D.create(new _Math.Vector2(0, 0), new _Math.Vector2(-1, 1));
    const P = Parabola2D.create(F, D);

    const P2 = new _Math.Vector2(1, 1);
    const D2 = new _Math.Vector2(-1, 1);
    const L2 = InfiniteLine2D.create(P2, D2);

    const I2 = P.intersectWithInfiniteLine(L2);
    assert(I2.length === 2, 'There should be 2 intersections.');
    assert(I2.map(i => P.isPointOnParabola(i)).reduce((acc, b) => b && acc, true), 'Intersections not on parabola.');
    assert(I2.map(i => L2.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on line.');

    const P1 = new _Math.Vector2(2, 0);
    const D1 = new _Math.Vector2(1, 0);
    const L1 = InfiniteLine2D.create(P1, D1);

    const I1 = P.intersectWithInfiniteLine(L1);
    assert(I1.length === 1, 'There should be 1 intersection.');
    assert(I1.map(i => P.isPointOnParabola(i)).reduce((acc, b) => b && acc, true), 'Intersections not on parabola.');
    assert(I1.map(i => L1.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on line.');

    const P0 = new _Math.Vector2(2, -10 * Testing.TEST_EPSILON);
    const D0 = new _Math.Vector2(1, 0);
    const L0 = InfiniteLine2D.create(P0, D0);

    const I0 = P.intersectWithInfiniteLine(L0);
    assert(I0.length === 0, 'There should be 0 intersections.');
  });
  it('#intersectWithCircle()', () => {
    const F = new _Math.Vector2(1, 1);
    const D = InfiniteLine2D.create(new _Math.Vector2(0, 0), new _Math.Vector2(-1, 1));
    const P = Parabola2D.create(F, D);

    // 4 intersections
    // const C4 = Circle2D.createFromCenter(new _Math.Vector2(2.3, 2.3), 2);
    // const I4 = P.intersectWithCircle(C4);

    // 2 intersections
    const C2 = Circle2D.createFromCenter(new _Math.Vector2(2, 2), 2);
    const I2 = P.intersectWithCircle(C2);
    assert(I2.length === 2, 'There should be 2 intersections.');
    assert(I2.map(i => P.isPointOnParabola(i)).reduce((acc, b) => b && acc, true), 'Intersections not on parabola.');
    assert(I2.map(i => C2.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle.');

    // 1 intersection
    const C1 = Circle2D.createFromCenter(new _Math.Vector2(2, -2), 2);
    const I1 = P.intersectWithCircle(C1);
    assert(I1.length === 1, 'There should be 1 intersection.');
    assert(I1.map(i => P.isPointOnParabola(i)).reduce((acc, b) => b && acc, true), 'Intersections not on parabola.');
    assert(I1.map(i => C1.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle.');

    // 0 intersections
    const C0 = Circle2D.createFromCenter(new _Math.Vector2(2, -2 - Testing.TEST_EPSILON), 2);
    const I0 = P.intersectWithCircle(C0);
    assert(I0.length === 0, 'There should be 0 intersections.');
  });
  // it('#intersectWithEllipse()', () => {
  //   const F = new _Math.Vector2(1, 1);
  //   const D = InfiniteLine2D.create(new _Math.Vector2(0, 0), new _Math.Vector2(-1, 1));
  //   const P = Parabola2D.create(F, D);
  // });
});