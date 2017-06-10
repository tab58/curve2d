'use strict';

const GeomUtils = require('../geomUtils.js');
const _Math = require('../../math/math.js');
const Vector2 = _Math.Vector2;
const Matrix3 = _Math.Matrix3;

const isZero = GeomUtils.NumericalCompare.isZero;
const selectDistinctVector2 = GeomUtils.NumericalCompare.selectDistinctVector2;

const helpers = {
  getMatrix3Representation: function getMatrix3Representation() {
    const Q = new Matrix3();
    const A = this.definition.A;
    const B = this.definition.B;
    const C = this.definition.C;
    const D = this.definition.D;
    const E = this.definition.E;
    const F = this.definition.F;

    Q.set(A, B / 2, D / 2,
          B / 2, C, E / 2,
          D / 2, E / 2, F);
    return Q;
  },
  splitConicOf2DistinctLines: function splitConicOf2DistinctLines(D) {
    const adjD = D.clone().adjugate();
    let i = 0;
    let maxElem = 0;
    for (i = 0; i < 3; ++i) {
      maxElem = adjD.elements[i * 3 + i];
      if (!GeomUtils.NumericalCompare.isZero(maxElem)) {
        break;
      }
    }
    const p = adjD.getColumn(i).multiplyScalar(1.0 / _Math.sqrt(_Math.abs(maxElem)));
    const C = (new Matrix3()).setSkewSymmetric(p).add(D);
    const Cij = C.findFirstNonvanishing();
    const g = C.getRow(Cij.row);
    const h = C.getColumn(Cij.column);
    return [g, h];
  },
  intersectWithInfiniteLine: function intersectWithInfiniteLine(Q, l) {
    // form the degenerate conic
    const L = (new Matrix3()).setSkewSymmetric(l);
    const LT = L.clone().transpose();
    const D = LT.clone().multiply(Q).multiply(L);
    const rankD = D.getRank();

    let P;
    if (rankD >= 2) {
      // decompose the conic into a rank 1 matrix
      const de = D.elements;
      const d11 = de[0];
      const d21 = de[1];
      const d12 = de[3];
      const d22 = de[4];
      const d32 = de[5];
      const d23 = de[7];
      const d33 = de[8];

      const l1 = l.x;
      const l3 = l.z;
      let A = 0;
      let B = 0;
      let C = 0;
      if (l.z !== 0) {
        A = l3 * l3;
        B = l3 * (d21 - d12);
        C = d11 * d22 - d12 * d21;
      } else {
        A = l1 * l1;
        B = l1 * (d32 - d23);
        C = d22 * d33 - d23 * d32;
      }
      const lambda = -B + _Math.sqrt(B * B - 4 * A * C) / (2 * A);
      P = D.clone().add(L, lambda);
    } else {
      // D is rank 1
      P = D;
    }

    const maxP = P.findLargestAbsElement();
    const TOL = GeomUtils.NumericalCompare.EPSILON;
    const pProj = P.getRow(maxP.row);
    const qProj = P.getColumn(maxP.column);

    // project the intersections back into 2D
    const intxs = [pProj, qProj];
    const filteredIntxs = intxs.filter(intx => GeomUtils.NumericalCompare.isZero(l.dot(intx)))
      .filter(intx => intx.z !== 0)
      .map(intx => new Vector2(intx.x / intx.z, intx.y / intx.z));
    return selectDistinctVector2(filteredIntxs);
  }
};

const publicAPI = {
  asMatrix3: function getMatrix3Rep () {
    return helpers.getMatrix3Representation.call(this);
  },
  isPointOnConic: function isPointOnConic (Q) {
    const x = Q.x;
    const y = Q.y;
    const A = this.definition.A;
    const B = this.definition.B;
    const C = this.definition.C;
    const D = this.definition.D;
    const E = this.definition.E;
    const F = this.definition.F;

    return isZero(A * x * x + B * x * y + C * y * y + D * x + E * y + F);
  },
  intersectWithInfiniteLine: function intersectWithInfiniteLine(line) {
    return helpers.intersectWithInfiniteLine(this.asMatrix3(), line.getTriple());
  },
  intersectWithGeneralizedConic: function intersectWithGeneralizedConic(conic) {
    const TOL = GeomUtils.NumericalCompare.EPSILON;
    const Q1 = helpers.getMatrix3Representation.call(this);
    const Q2 = helpers.getMatrix3Representation.call(conic);

      // solve for the pencil of conics
    const Q2inv = Q2.clone().multiplyScalar(-1).invert();
    const J = (new Matrix3()).multiplyMatrices(Q1, Q2inv);
    const lambdas = J.getEigenvalues();
    if (lambdas.length <= 0) {
      throw new Error('No eigenvalues! There should be at least 1.');
    }
    const Clambda = (new Matrix3()).addMatrices(Q1, Q2, _Math.max.apply(this, lambdas));

    // determine if further decomposition is required
    const rankClambda = Clambda.getRank();
    if (rankClambda > 2) {
      // a pencil of conics must be degenerate if it intersects.
      return [];
    } else if (rankClambda === 2) {
      // Get the intersection point of the degenerate lines
      const G = (new Matrix3()).getAdjugate(Clambda);
      const maxG = G.findLargestAbsElement();
      const p = G.getColumn(maxG.column).multiplyScalar(1.0 / _Math.sqrt(_Math.abs(maxG.value))).clampToZero(TOL);
      const P = (new Matrix3()).setSkewSymmetric(p);
      Clambda.add(P, 1.0);
    }

    // this will be the same for rank 1 matrix now
    const idxClambda = Clambda.findLargestAbsElement();
    const l = Clambda.getRow(idxClambda.row);
    const m = Clambda.getColumn(idxClambda.column);

    const lQ1 = helpers.intersectWithInfiniteLine(Q1, l);
    const mQ1 = helpers.intersectWithInfiniteLine(Q1, m);
    const lQ2 = helpers.intersectWithInfiniteLine(Q2, l);
    const mQ2 = helpers.intersectWithInfiniteLine(Q2, m);

    const intxs = lQ1.concat(mQ1).concat(lQ2).concat(mQ2);
    const that = this;
    const filteredIntxs = intxs.filter(intx => that.isPointOnConic(intx) && conic.isPointOnConic(intx));
    return selectDistinctVector2(filteredIntxs);
  },
  clone: function clone() {
    const A = this.definition.A;
    const B = this.definition.B;
    const C = this.definition.C;
    const D = this.definition.D;
    const E = this.definition.E;
    const F = this.definition.F;
    return GeneralizedConic.create(A, B, C, D, E, F);
  }
};

const GeneralizedConic = {
  create: function (A, B, C, D, E, F) {
    const conic = {
      definition: {
        A,
        B,
        C,
        D,
        E,
        F
      }
    };
    Object.assign(conic, publicAPI);
    return conic;
  },
  splitDegenerateConic: helpers.splitConicOf2DistinctLines
};

module.exports = GeneralizedConic;
