'use strict';

/* global describe it before after */
const assert = require('chai').assert;
const _Math = require('../../math/math.js');
const Testing = require('../testAsserts.js');

const Geometry = require('../../geometry/geometry.js');
const InfiniteLine2D = Geometry.InfiniteLine2D;
const Ellipse2D = Geometry.Ellipse2D;

let oldEpsilon = 0;

describe('Ellipse2D', () => {
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
    const A = 0;
    const h = 1;
    const k = 1;
    const a = 3;
    const b = 1.5;

    const e0Center = new _Math.Vector2(h, k);
    const E0 = Ellipse2D.create(e0Center, a, b, A);
    const E0asConic = E0.asGeneralizedConic();

    const def = E0asConic.definition;
    const errorMsg = 'Conic terms are wrong: ';
    Testing.numbersAreEqualish(def.A, 2.25, errorMsg + 'A');
    Testing.numbersAreEqualish(def.B, 0, errorMsg + 'B');
    Testing.numbersAreEqualish(def.C, 9, errorMsg + 'C');
    Testing.numbersAreEqualish(def.D, -4.5, errorMsg + 'D');
    Testing.numbersAreEqualish(def.E, -18, errorMsg + 'E');
    Testing.numbersAreEqualish(def.F, -9, errorMsg + 'F');
  });
  it('#intersectWithEllipse()', () => {
    const h = 0;
    const k = 0;
    const a = 3;
    const b = 1.5;

    const center = new _Math.Vector2(h, k);
    const E0 = Ellipse2D.create(center, a, b, 0);

    // 4 intersections
    const A1 = _Math.PI / 2;
    const E1 = Ellipse2D.create(center, a, b, A1);
    const I4 = E0.intersectWithEllipse(E1);
    assert(I4.length === 4, 'Ellipses should have 4 intersections.');
    assert(I4.map(i => E0.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on E0.');
    assert(I4.map(i => E1.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on E1.');

    // 3 intersections
    const q3 = 1.5;
    const e5Center = new _Math.Vector2(h, k + q3);
    const E5 = Ellipse2D.create(e5Center, a, b, A1);
    const I3 = E0.intersectWithEllipse(E5);
    assert(I3.length === 3, 'Ellipses should have 3 intersections.');
    assert(I3.map(i => E0.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on E0.');
    assert(I3.map(i => E5.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on E5.');

    // 2 intersections
    const q2 = 3;
    const e2Center = new _Math.Vector2(h, k + q2);
    const E2 = Ellipse2D.create(e2Center, a, b, A1);
    const I2 = E0.intersectWithEllipse(E2);
    assert(I2.length === 2, 'Ellipses should have 2 intersections.');
    assert(I2.map(i => E0.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on E0.');
    assert(I2.map(i => E2.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on E2.');

    // 1 intersection
    const q1 = 4.5;
    const e3Center = new _Math.Vector2(h, k + q1);
    const E3 = Ellipse2D.create(e3Center, a, b, A1);
    const I1 = E0.intersectWithEllipse(E3);
    assert(I1.length === 1, 'Ellipses should have 1 intersection.');
    assert(I1.map(i => E0.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on E0.');
    assert(I1.map(i => E3.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on E3.');

    // 0 intersections
    const q0 = 4.5 + Testing.TEST_EPSILON;
    const e4Center = new _Math.Vector2(h, k + q0);
    const E4 = Ellipse2D.create(e4Center, a, b, A1);
    const I0 = E0.intersectWithEllipse(E4);
    assert(I0.length === 0, 'Ellipses should have 0 intersections.');
  });
  it('#intersectWithInfiniteLine()', () => {
    const h = 0;
    const k = 0;
    const a = 3;
    const b = 1.5;
    const center = new _Math.Vector2(h, k);
    const E = Ellipse2D.create(center, a, b, 0);

    // 2 intersection case
    const P2 = new _Math.Vector2(0, 0);
    const D2 = new _Math.Vector2(1, 1);
    const L2 = InfiniteLine2D.create(P2, D2);
    const I2 = E.intersectWithInfiniteLine(L2);
    assert(I2.length === 2, 'Circle should have 2 intersections.');
    assert(I2.map(i => E.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on ellipse.');
    assert(I2.map(i => L2.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on L2.');

    // 1 intersection case
    const P1 = new _Math.Vector2(3, 0);
    const D1 = new _Math.Vector2(0, 1);
    const L1 = InfiniteLine2D.create(P1, D1);
    const I1 = E.intersectWithInfiniteLine(L1);
    assert(I1.length === 1, 'Circle should have 1 intersection, not ' + I1.length + '.');
    assert(I1.map(i => E.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on ellipse.');
    assert(I1.map(i => L1.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on L1.');

    // 0 intersection case
    const P0 = new _Math.Vector2(3 + Testing.TEST_EPSILON, 0);2
    const D0 = new _Math.Vector2(1, 0);
    const L0 = InfiniteLine2D.create(P0, D0);
    const I0 = E.intersectWithInfiniteLine(L0);
    assert(I0.length === 0, 'Circle should have 0 intersections.');
  });
  it('#getClosestPointToLine()', () => {
    const h = 0;
    const k = 0;
    const a = 3;
    const b = 1;
    const A = _Math.PI / 4;
    const center = new _Math.Vector2(h, k);
    const E = Ellipse2D.create(center, a, b, A);

    // line at x = 3
    const P = new _Math.Vector2(3, 0);
    const D = new _Math.Vector2(0, 1);
    const L = InfiniteLine2D.create(P, D);

    const Q = E.getClosestPointToLine(L);
    const Q1 = new _Math.Vector2(2.23606797749979, 1.7888543819998315);
    assert(E.isPointOnEllipse(Q), 'Point is not on ellipse.');
    Testing.vectorsAreEqualish(Q, Q1, 'Closest point is not correct.');
  });
  it('#getClosestPointToPoint()', () => {
    const h = 0;
    const k = 0;
    const a = 3;
    const b = 1.5;
    const A = _Math.PI / 4;
    const center = new _Math.Vector2(h, k);
    const E1 = Ellipse2D.create(center, a, b, A);

    // simple test in all quadrants
    const p1x = 3;
    const p1y = 4;
    const P1 = new _Math.Vector2(p1x, p1y);
    const Q1 = E1.getClosestPointToPoint(P1);
    const qt1x = 1.9668151749244724;
    const qt1y = 2.240394892602555;
    const Qt1 = new _Math.Vector2(qt1x, qt1y);
    assert(E1.isPointOnEllipse(Q1), 'Point is not on ellipse.');
    Testing.vectorsAreEqualish(Q1, Qt1, 'Closest point in 1st quadrant is not correct.');

    const P2 = new _Math.Vector2(-p1x, -p1y);
    const Q2 = E1.getClosestPointToPoint(P2);
    const Qt2 = new _Math.Vector2(-qt1x, qt1y);
    assert(E1.isPointOnEllipse(Q2), 'Point is not on ellipse.');
    Testing.vectorsAreEqualish(Q2, Qt2, 'Closest point in 3rd quadrant is not correct.');

    const qt2x = -0.7332472847294296;
    const qt2y = 1.364463718580848;
    const P3 = new _Math.Vector2(-p1x, p1y);
    const Qt3 = new _Math.Vector2(qt2x, qt2y);
    const Q3 = E1.getClosestPointToPoint(P3);
    assert(E1.isPointOnEllipse(Q3), 'Point is not on ellipse.');
    Testing.vectorsAreEqualish(Q3, Qt3, 'Closest point in 2nd quadrant is not correct.');

    const P4 = new _Math.Vector2(p1x, -p1y);
    const Q4 = E1.getClosestPointToPoint(P3);
    const Qt4 = new _Math.Vector2(-qt2x, -qt2y);
    assert(E1.isPointOnEllipse(Q4), 'Point is not on ellipse.');
    Testing.vectorsAreEqualish(Q4, Qt4, 'Closest point in 4th quadrant is not correct.');

    // test where semimajor is less than semiminor
    const E2 = Ellipse2D.create(center, b, a, A);
    const QX = E2.getClosestPointToPoint(P1);
    const QtX = new _Math.Vector2(-qt2x, qt2y);
    assert(E2.isPointOnEllipse(QX), 'Point is not on ellipse.');
    Testing.vectorsAreEqualish(QX, QtX, 'Closest point is not correct.');
  });
  it('#isPointOnEllipse', () => {
    const A = 0;
    const h = 1;
    const k = 1;
    const a = 3;
    const b = 1.5;

    const eCenter = new _Math.Vector2(h, k);
    const E0 = Ellipse2D.create(eCenter, a, b, A);

    const Q1 = new _Math.Vector2(h + a, k);
    assert(E0.isPointOnEllipse(Q1), 'Point 1 should be on ellipse.');
    const Q2 = new _Math.Vector2(h, k + b);
    assert(E0.isPointOnEllipse(Q2), 'Point 2 should be on ellipse.');

    const Q3 = new _Math.Vector2(h + a + Testing.TEST_EPSILON, k);
    assert(!E0.isPointOnEllipse(Q3), 'Point 3 should not be on ellipse.');
    const Q4 = new _Math.Vector2(h, k + b + Testing.TEST_EPSILON);
    assert(!E0.isPointOnEllipse(Q4), 'Point 4 should not be on ellipse.');
  });
});
