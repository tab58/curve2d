'use strict';

/* global describe it before after */
const assert = require('chai').assert;
const _Math = require('../../math/math.js');
const Testing = require('../testAsserts.js');

const Geometry = require('../../geometry/geometry.js');
const InfiniteLine2D = Geometry.InfiniteLine2D;
const Circle2D = Geometry.Circle2D;

let oldEpsilon = 0;

describe('InfiniteLine2D', () => {
  before(() => {
    const GeomUtils = require('../../geometry/geomUtils.js');
    oldEpsilon = GeomUtils.NumericalCompare.EPSILON;
    GeomUtils.NumericalCompare.EPSILON = Testing.TEST_EPSILON;
  });
  after(() => {
    const GeomUtils = require('../../geometry/geomUtils.js');
    GeomUtils.NumericalCompare.EPSILON = oldEpsilon;
  });
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
