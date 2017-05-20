'use strict';

/* global describe it */
const assert = require('chai').assert;
const _Math = require('../math/math.js');
const TestAsserts = require('./testAsserts.js');

const Geometry = require('../geometry/geometry.js');
const InfiniteLine2D = Geometry.InfiniteLine2D;
const Circle2D = Geometry.Circle2D;
const Ellipse2D = Geometry.Ellipse2D;
// const GeneralizedConic = Geometry.GeneralizedConic;

describe('Analytical Operations', () => {
  describe('InfiniteLine2D', () => {
    it('#distanceTo()', () => {
      const Q = new _Math.Vector2(1, 0);
      const P = new _Math.Vector2(0, 0);
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      const dist = L.distanceTo(Q);
      TestAsserts.numbersAreEqualish(dist, halfSqrt2, 'Distance is ' + dist);
    });
    it('#signedDistanceTo()', () => {
      const Q = new _Math.Vector2(1, 0);
      const P = new _Math.Vector2(0, 0);
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      const dist = L.signedDistanceTo(Q);
      TestAsserts.numbersAreEqualish(dist, -halfSqrt2, 'Signed distance is ' + dist);
    });
    it('#getPointOnLine()', () => {
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const P = new _Math.Vector2(1, 1);
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      const p = L.getPointOnLine();
      TestAsserts.numbersAreEqualish(L.distanceTo(p), 0, 'Point is not on line.');
    });
    it('#isPointOnLine()', () => {
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const P = new _Math.Vector2(1, 1);
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      assert(L.isPointOnLine(new _Math.Vector2(halfSqrt2, halfSqrt2)), 'Point is not on line.');
    });
    it('#getClosestPointTo()', () => {
      const Q = new _Math.Vector2(1, 0);
      const P = new _Math.Vector2(0, 0);
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      const p = L.getClosestPointToPoint(Q);
      TestAsserts.vectorsAreEqualish(p, new _Math.Vector2(0.5, 0.5), 'Point is not closest to line.');
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
      TestAsserts.vectorsAreEqualish(p, new _Math.Vector2(0.5, 0.5), 'Point is not at intersection.');
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
    it('#getClosestPointTo()', () => {
      const P = new _Math.Vector2(0, 0);
      const r = 1;
      const C = Circle2D.createFromCenter(P, r);

      const halfSqrt2 = _Math.sqrt(2) / 2;
      const P1c = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const Q = P1c.clone().multiplyScalar(1 / 5);
      const P1 = C.getClosestPointToPoint(Q);

      TestAsserts.vectorsAreEqualish(P1, P1c, 'Closest point is not correct.');
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
      const Q1 = new _Math.Vector2(halfSqrt2 + TestAsserts.TEST_EPSILON, halfSqrt2 + TestAsserts.TEST_EPSILON);
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
      const P0 = new _Math.Vector2(halfSqrt2 + TestAsserts.TEST_EPSILON, -halfSqrt2 - TestAsserts.TEST_EPSILON);
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
      const c3 = new _Math.Vector2(2 + TestAsserts.TEST_EPSILON, 0);
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
      const c3 = new _Math.Vector2(2 + TestAsserts.TEST_EPSILON, 0);
      const r3 = 1;
      const C3 = Circle2D.createFromCenter(c3, r3);
      const C3asConic = C3.asGeneralizedConic();
      const I3 = C0.intersectWithGeneralizedConic(C3asConic);
      assert(I3.length === 0, 'Circles should have no intersections.');
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
      TestAsserts.numbersAreEqualish(def.A, 2.25, errorMsg + 'A');
      TestAsserts.numbersAreEqualish(def.B, 0, errorMsg + 'B');
      TestAsserts.numbersAreEqualish(def.C, 9, errorMsg + 'C');
      TestAsserts.numbersAreEqualish(def.D, -4.5, errorMsg + 'D');
      TestAsserts.numbersAreEqualish(def.E, -18, errorMsg + 'E');
      TestAsserts.numbersAreEqualish(def.F, -9, errorMsg + 'F');
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
      const q0 = 4.5 + TestAsserts.TEST_EPSILON;
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
      // console.log('', E.getClosestPointToLine(L1));
      assert(I1.length === 1, 'Circle should have 1 intersection, not ' + I1.length + '.');
      assert(I1.map(i => E.isPointOnEllipse(i)).reduce((acc, b) => b && acc, true), 'Intersections not on ellipse.');
      assert(I1.map(i => L1.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on L1.');

      // 0 intersection case
      const P0 = new _Math.Vector2(3 + TestAsserts.TEST_EPSILON, 0);
      const D0 = new _Math.Vector2(1, 0);
      const L0 = InfiniteLine2D.create(P0, D0);
      const I0 = E.intersectWithInfiniteLine(L0);
      assert(I0.length === 0, 'Circle should have 0 intersections.');
    });
  });
});
