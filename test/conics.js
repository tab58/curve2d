'use strict';

/* global describe it */
const assert = require('chai').assert;
const _Math = require('../math/math.js');
const Testing = require('./testAsserts.js');

const Geometry = require('../geometry/geometry.js');
const InfiniteLine2D = Geometry.InfiniteLine2D;
const Circle2D = Geometry.Circle2D;
const Ellipse2D = Geometry.Ellipse2D;
const Parabola2D = Geometry.Parabola2D;

describe('Analytical Curve Tests, EPS: ' + Testing.TEST_EPSILON, () => {
  describe('InfiniteLine2D', () => {
    it('#distanceTo()', () => {
      const Q = new _Math.Vector2(1, 0);
      const P = new _Math.Vector2(0, 0);
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      const dist = L.distanceTo(Q);
      Testing.numbersAreEqualish(dist, halfSqrt2, 'Distance is ' + dist);
    });
    it('#signedDistanceTo()', () => {
      const Q = new _Math.Vector2(1, 0);
      const P = new _Math.Vector2(0, 0);
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      const dist = L.signedDistanceTo(Q);
      Testing.numbersAreEqualish(dist, -halfSqrt2, 'Signed distance is ' + dist);
    });
    it('#getPointOnLine()', () => {
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const P = new _Math.Vector2(1, 1);
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      const p = L.getPointOnLine();
      Testing.numbersAreEqualish(L.distanceTo(p), 0, 'Point is not on line.');
    });
    it('#isPointOnLine()', () => {
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const P = new _Math.Vector2(1, 1);
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      assert(L.isPointOnLine(new _Math.Vector2(halfSqrt2, halfSqrt2)), 'Point is not on line.');
    });
    it('#getClosestPointToPoint()', () => {
      const Q = new _Math.Vector2(1, 0);
      const P = new _Math.Vector2(0, 0);
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      const p = L.getClosestPointToPoint(Q);
      Testing.vectorsAreEqualish(p, new _Math.Vector2(0.5, 0.5), 'Point is not closest to line.');
    });
    it('#intersectWithInfiniteLine()', () => {
      const halfSqrt2 = _Math.sqrt(2) / 2;

      const P0 = new _Math.Vector2(0, 0);
      const d0 = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L0 = InfiniteLine2D.create(P0, d0.normalize());

      const P1 = new _Math.Vector2(1, 0);
      const d1 = new _Math.Vector2(-halfSqrt2, halfSqrt2);
      const L1 = InfiniteLine2D.create(P1, d1.normalize());

      const p = L0.intersectWithInfiniteLine(L1);
      assert(L0.isPointOnLine(p), 'Intersections not on line 1.');
      assert(L1.isPointOnLine(p), 'Intersections not on line 2.');
      Testing.vectorsAreEqualish(p, new _Math.Vector2(0.5, 0.5), 'Point is not at intersection.');
    });
    it('#intersectWithCircle()', () => {
      const P = new _Math.Vector2(0, 0);
      const d = new _Math.Vector2(1, 1);
      const L = InfiniteLine2D.create(P, d.normalize());

      const c = new _Math.Vector2(0, 0);
      const r = 1;
      const C = Circle2D.createFromCenter(c, r);

      const I = L.intersectWithCircle(C);
      assert(I.length === 2, 'Circle should have 2 intersections.');
      assert(I.map(i => C.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle.');
      assert(I.map(i => L.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on line.');

      // TODO: do 1 intersection and 0 intersections
      // do we need this since they're being tested in Circle2D?
    });
    it('#intersectWithGeneralizedConic()', () => {
      const P = new _Math.Vector2(0, 0);
      const d = new _Math.Vector2(1, 1);
      const L = InfiniteLine2D.create(P, d.normalize());

      const c = new _Math.Vector2(0, 0);
      const r = 1;
      const C = Circle2D.createFromCenter(c, r);

      const circleAsConic = C.asGeneralizedConic();
      const I = circleAsConic.intersectWithInfiniteLine(L);
      assert(I.length === 2, 'Circle should have 2 intersections.');
      assert(I.map(i => C.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle.');
      assert(I.map(i => L.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on line.');

      // TODO: do 1 intersection and 0 intersections
      // do we need this since they're being tested in Circle2D?
    });
  });
  describe('Circle2D', () => {
    it('#getClosestPointToPoint()', () => {
      const P = new _Math.Vector2(0, 0);
      const r = 1;
      const C = Circle2D.createFromCenter(P, r);

      const halfSqrt2 = _Math.sqrt(2) / 2;
      const P1c = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const Q = P1c.clone().multiplyScalar(1 / 5);
      const P1 = C.getClosestPointToPoint(Q);

      Testing.vectorsAreEqualish(P1, P1c, 'Closest point is not correct.');
    });
    it('#isPointOnCircle()', () => {
      const P = new _Math.Vector2(0, 0);
      const r = 1;
      const C = Circle2D.createFromCenter(P, r);

      // point is on circle
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const Q = new _Math.Vector2(halfSqrt2, halfSqrt2);
      assert(C.isPointOnCircle(Q), 'Point is not on circle.');

      // point is not on circle
      const Q1 = new _Math.Vector2(halfSqrt2 + Testing.TEST_EPSILON, halfSqrt2 + Testing.TEST_EPSILON);
      assert(!C.isPointOnCircle(Q1), 'Point is on circle.');
    });
    it('#intersectWithInfiniteLine()', () => {
      const c = new _Math.Vector2(0, 0);
      const r = 1;
      const C = Circle2D.createFromCenter(c, r);

      // 2 intersections
      const P2 = new _Math.Vector2(0, 0);
      const d2 = new _Math.Vector2(1, 1);
      const L2 = InfiniteLine2D.create(P2, d2.normalize());
      const I2 = C.intersectWithInfiniteLine(L2);
      assert(I2.length === 2, 'Circle should have 2 intersections.');
      assert(I2.map(i => C.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle.');
      assert(I2.map(i => L2.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on L2.');

      // 1 intersection
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const P1 = new _Math.Vector2(halfSqrt2, -halfSqrt2);
      const d1 = new _Math.Vector2(1, 1);
      const L1 = InfiniteLine2D.create(P1, d1.normalize());
      const I1 = C.intersectWithInfiniteLine(L1);
      assert(I1.length === 1, 'Circle should have 1 intersection.');
      assert(I1.map(i => C.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle.');
      assert(I1.map(i => L1.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on L1.');

      // 0 intersections
      const P0 = new _Math.Vector2(halfSqrt2 + Testing.TEST_EPSILON, -halfSqrt2 - Testing.TEST_EPSILON);
      const d0 = new _Math.Vector2(1, 1);
      const L0 = InfiniteLine2D.create(P0, d0.normalize());
      const I0 = C.intersectWithInfiniteLine(L0);
      assert(I0.length === 0, 'Circle should have 0 intersections.');
    });
    it('#intersectWithCircle()', () => {
      // 2 intersection case
      const c0 = new _Math.Vector2(0, 0);
      const r0 = 1;
      const C0 = Circle2D.createFromCenter(c0, r0);
      const c1 = new _Math.Vector2(1, 0);
      const r1 = 1;
      const C1 = Circle2D.createFromCenter(c1, r1);
      const I2 = C0.intersectWithCircle(C1);
      assert(I2.length === 2, 'Circle should have 2 intersections.');
      assert(I2.map(i => C0.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle 0.');
      assert(I2.map(i => C1.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle 1.');

      const Pl = new _Math.Vector2(0.5, 0);
      const dl = new _Math.Vector2(0, 1);
      const L = InfiniteLine2D.create(Pl, dl);
      assert(I2.map(i => L.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on line.');

      // 1 intersection (tangent) case
      const c2 = new _Math.Vector2(2, 0);
      const r2 = 1;
      const C2 = Circle2D.createFromCenter(c2, r2);
      const I1 = C0.intersectWithCircle(C2);
      assert(I1.length === 1, 'Circles should have 1 intersection.');
      assert(I1.map(i => C0.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle 0.');
      assert(I1.map(i => C2.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle 2.');
      const Pl1 = new _Math.Vector2(1, 0);
      const dl1 = new _Math.Vector2(0, 1);
      const L1 = InfiniteLine2D.create(Pl1, dl1);
      assert(I1.map(i => L1.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on line.');

      // 0 intersection case
      const c3 = new _Math.Vector2(2 + Testing.TEST_EPSILON, 0);
      const r3 = 1;
      const C3 = Circle2D.createFromCenter(c3, r3);
      const I3 = C0.intersectWithCircle(C3);
      assert(I3.length === 0, 'Circles should have no intersections.');
    });
    it('#intersectWithGeneralizedConic()', () => {
      // 2 intersection case
      const c0 = new _Math.Vector2(0, 0);
      const r0 = 1;
      const C0 = Circle2D.createFromCenter(c0, r0);
      const c1 = new _Math.Vector2(1, 0);
      const r1 = 1;
      const C1 = Circle2D.createFromCenter(c1, r1);
      const C1asConic = C1.asGeneralizedConic();
      const I2 = C0.intersectWithGeneralizedConic(C1asConic);
      assert(I2.length === 2, 'Circle should have 2 intersections.');
      assert(I2.map(i => C0.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle 0.');
      assert(I2.map(i => C1.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle 1.');

      const Pl = new _Math.Vector2(0.5, 0);
      const dl = new _Math.Vector2(0, 1);
      const L = InfiniteLine2D.create(Pl, dl);
      assert(I2.map(i => L.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on line.');

      // 1 intersection (tangent) case
      const c2 = new _Math.Vector2(2, 0);
      const r2 = 1;
      const C2 = Circle2D.createFromCenter(c2, r2);
      const C2asConic = C2.asGeneralizedConic();
      const I1 = C0.intersectWithGeneralizedConic(C2asConic);
      assert(I1.length === 1, 'Circles should have 1 intersection.');
      assert(I1.map(i => C0.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle 0.');
      assert(I1.map(i => C2.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle 2.');
      const Pl1 = new _Math.Vector2(1, 0);
      const dl1 = new _Math.Vector2(0, 1);
      const L1 = InfiniteLine2D.create(Pl1, dl1);
      const LC1 = L1.intersectWithCircle(C0);
      assert(LC1.map(i => L1.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on line.');

      // 0 intersection case
      const c3 = new _Math.Vector2(2 + Testing.TEST_EPSILON, 0);
      const r3 = 1;
      const C3 = Circle2D.createFromCenter(c3, r3);
      const C3asConic = C3.asGeneralizedConic();
      const I3 = C0.intersectWithGeneralizedConic(C3asConic);
      assert(I3.length === 0, 'Circles should have no intersections.');
    });
    it('#intersectWithEllipse()', () => {
      const h = 0;
      const k = 0;
      const a = 3;
      const b = 0.75;
      const r = 1;

      const center = new _Math.Vector2(h, k);
      const C = Circle2D.createFromCenter(center, r);

      // 4 intersections
      const A1 = _Math.PI / 2;
      const E1 = Ellipse2D.create(center, a, b, A1);
      const I4 = C.intersectWithEllipse(E1);
      assert(I4.length === 4, 'Ellipses should have 4 intersections.');
      assert(I4.map(i => C.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on C.');
      assert(I4.map(i => E1.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on E1.');

      // 3 intersections
      const q3 = 2;
      const e5Center = new _Math.Vector2(h, k + q3);
      const E5 = Ellipse2D.create(e5Center, a, b, A1);
      const I3 = C.intersectWithEllipse(E5);
      assert(I3.length === 3, 'Ellipses should have 3 intersections.');
      assert(I3.map(i => C.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on C.');
      assert(I3.map(i => E5.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on E5.');

      // 2 intersections
      const q2 = 3;
      const e2Center = new _Math.Vector2(h, k + q2);
      const E2 = Ellipse2D.create(e2Center, a, b, A1);
      const I2 = C.intersectWithEllipse(E2);
      assert(I2.length === 2, 'Ellipses should have 2 intersections.');
      assert(I2.map(i => C.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on C.');
      assert(I2.map(i => E2.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on E2.');

      // 1 intersection
      const q1 = 4;
      const e3Center = new _Math.Vector2(h, k + q1);
      const E3 = Ellipse2D.create(e3Center, a, b, A1);
      const I1 = C.intersectWithEllipse(E3);
      assert(I1.length === 1, 'Ellipses should have 1 intersection.');
      assert(I1.map(i => C.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on C.');
      assert(I1.map(i => E3.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on E3.');

      // 0 intersections
      const q0 = 4 + Testing.TEST_EPSILON;
      const e4Center = new _Math.Vector2(h, k + q0);
      const E4 = Ellipse2D.create(e4Center, a, b, A1);
      const I0 = C.intersectWithEllipse(E4);
      assert(I0.length === 0, 'Ellipses should have 0 intersections.');
    });
  });
  describe('Ellipse2D', () => {
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
      const Q3 = E1.getClosestPointToPoint(P3);
      const Qt3 = new _Math.Vector2(qt2x, qt2y);
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
  describe('Parabola2D', () => {
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

      const P0 = new _Math.Vector2(2, -Testing.TEST_EPSILON);
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
      const C2 = Circle2D.createFromCenter(new _Math.Vector2(2.3, 2.3), 2);
      const I2 = P.intersectWithCircle(C2);

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
});
