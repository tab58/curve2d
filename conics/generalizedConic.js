'use strict';

const GeomUtils = require('./analyticalUtils.js');
const _Math = require('../math/math.js');
const Vector2 = _Math.Vector2;
// const Vector3 = _Math.Vector3;
const Matrix3 = _Math.Matrix3;
// const InfiniteLine2D = require('./infiniteLine2d.js');

const isZero = GeomUtils.NumericalCompare.isZero;
const selectDistinctVector2 = GeomUtils.NumericalCompare.selectDistinctVector2;
const PRINT_DEBUG = false;

const helpers = {
  getMatrix3Representation: function () {
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
  intersectWithInfiniteLine: function (Q, l) {
    // form the degenerate conic
    const L = (new Matrix3()).setSkewSymmetric(l);
    const LT = L.clone().transpose();
    const D = LT.clone().multiply(Q).multiply(L);
    const de = D.elements;
    const d11 = de[0];
    const d21 = de[1];
    const d12 = de[3];
    const d22 = de[4];
    const d32 = de[5];
    const d23 = de[7];
    const d33 = de[8];

    // decompose the conic and get the 2 points of intersection
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
    const P = D.clone().add(L, lambda);
    const maxP = P.findLargestAbsElement();
    const pProj = P.getRow(maxP.row);
    const qProj = P.getColumn(maxP.column);

    // project the intersections back into 2D
    const intxs = [];
    if (pProj.z !== 0) {
      const x = pProj.x / pProj.z;
      const y = pProj.y / pProj.z;
      intxs.push(new Vector2(x, y));
    }
    if (qProj.z !== 0) {
      const x = qProj.x / qProj.z;
      const y = qProj.y / qProj.z;
      intxs.push(new Vector2(x, y));
    }
    return selectDistinctVector2(intxs);
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
  intersectWithInfiniteLine: function (line) {
    return helpers.intersectWithInfiniteLine(this.asMatrix3(), line.getTriple());
  },
  intersectWithGeneralizedConic: function (conic) {
    const Q1 = helpers.getMatrix3Representation.call(this);
    const Q2 = helpers.getMatrix3Representation.call(conic);
    if (PRINT_DEBUG) {
      console.log('Q1 (', Q1.determinant(), '):', Q1.prettyPrint());
      console.log('Q2 (', Q2.determinant(), '):', Q2.prettyPrint());
    }
      // solve for the pencil of conics
    const Q2inv = Q2.clone().multiplyScalar(-1).invert();
    const J = (new Matrix3()).multiplyMatrices(Q1, Q2inv);
    if (PRINT_DEBUG) {
      console.log('J (', J.determinant(), '):', J.prettyPrint());
    }
    const lambdas = J.getEigenvalues();
    if (lambdas.length <= 0) {
      throw new Error('No eigenvalues! There should be at least 1.');
    }
    const Clambda = (new Matrix3()).addMatrices(Q1, Q2, _Math.max.apply(this, lambdas));
    if (PRINT_DEBUG) {
      console.log('Eigenvalues of J:', lambdas);
      console.log('Clambda (', Clambda.determinant(), '):', Clambda.prettyPrint());
    }

    // determine if further decomposition is required
    const rankClambda = Clambda.getRank();
    if (rankClambda > 2) {
      // a pencil of conics must be degenerate.
      throw new Error('Pencil of conics is not degenerate; matrix has full rank (' + rankClambda + ').');
    } else if (rankClambda === 2) {
      // Get the intersection point of the degenerate lines
      const G = (new Matrix3()).getAdjugate(Clambda);
      const maxG = G.findLargestAbsElement();
      const p = G.getColumn(maxG.column).multiplyScalar(1.0 / _Math.sqrt(_Math.abs(maxG.value)));
      const P = (new Matrix3()).setSkewSymmetric(p);
      Clambda.add(P, 1.0);
    }

    // this will be the same for rank 1 matrix now
    const idxClambda = Clambda.findLargestAbsElement();
    const l = Clambda.getRow(idxClambda.row);
    const m = Clambda.getColumn(idxClambda.column);
    const lineArray = [ l ];
    if (!GeomUtils.NumericalCompare.vector3AreEqual(l, m)) {
      lineArray.push(m);
    }

    // get the intersections with the lines but check if the lines are at infinity
    let intxs = [];
    lineArray.forEach((l, i) => {
      if (!(isZero(l.x) && isZero(l.y))) {
        const lQ1 = helpers.intersectWithInfiniteLine(Q1, l);
        const lQ2 = helpers.intersectWithInfiniteLine(Q2, l);
        intxs = intxs.concat(lQ1).concat(lQ2);
      }
    });

    const that = this;
    return selectDistinctVector2(intxs.filter(intx => that.isPointOnConic(intx) && conic.isPointOnConic(intx)));
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
  }
};

module.exports = GeneralizedConic;
