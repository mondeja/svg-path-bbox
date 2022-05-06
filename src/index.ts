"use strict";

import svgPath from "svgpath";
import type { BBox } from "./BBox";

type minMax = [min: number, max: number];

// Precision for consider cubic polynom as quadratic one
const CBEZIER_MINMAX_EPSILON = 0.00000001;

// https://github.com/kpym/SVGPathy/blob/acd1a50c626b36d81969f6e98e8602e128ba4302/lib/box.js#L89
function minmaxQ(A: [number, number, number]): minMax {
  const min = Math.min(A[0], A[2]),
    max = Math.max(A[0], A[2]);

  if (A[1] > A[0] ? A[2] >= A[1] : A[2] <= A[1]) {
    // if no extremum in ]0,1[
    return [min, max];
  }

  // check if the extremum E is min or max
  const E = (A[0] * A[2] - A[1] * A[1]) / (A[0] - 2 * A[1] + A[2]);
  return E < min ? [E, max] : [min, E];
}

// https://github.com/kpym/SVGPathy/blob/acd1a50c626b36d81969f6e98e8602e128ba4302/lib/box.js#L127
function minmaxC(A: [number, number, number, number]): minMax {
  // if the polynomial is (almost) quadratic and not cubic
  const K = A[0] - 3 * A[1] + 3 * A[2] - A[3];

  if (K === 0 && A[0] === A[1] && A[0] === A[3]) {
    // no curve, point targeting same location
    return [A[0], A[3]];
  }
  if (Math.abs(K) < CBEZIER_MINMAX_EPSILON) {
    return minmaxQ([
      A[0],
      -0.5 * A[0] + 1.5 * A[1],
      A[0] - 3 * A[1] + 3 * A[2],
    ]);
  }

  // the reduced discriminant of the derivative
  const T =
    -A[0] * A[2] +
    A[0] * A[3] -
    A[1] * A[2] -
    A[1] * A[3] +
    A[1] * A[1] +
    A[2] * A[2];

  // if the polynomial is monotone in [0,1]
  if (T <= 0) {
    return [Math.min(A[0], A[3]), Math.max(A[0], A[3])];
  }
  const S = Math.sqrt(T);

  // potential extrema
  let min = Math.min(A[0], A[3]),
    max = Math.max(A[0], A[3]);

  const L = A[0] - 2 * A[1] + A[2];
  // check local extrema
  for (let R = (L + S) / K, i = 1; i <= 2; R = (L - S) / K, i++) {
    if (R > 0 && R < 1) {
      // if the extrema is for R in [0,1]
      const Q =
        A[0] * (1 - R) * (1 - R) * (1 - R) +
        A[1] * 3 * (1 - R) * (1 - R) * R +
        A[2] * 3 * (1 - R) * R * R +
        A[3] * R * R * R;
      if (Q < min) {
        min = Q;
      }
      if (Q > max) {
        max = Q;
      }
    }
  }

  return [min, max];
}

/**
 * Compute bounding boxes of SVG paths.
 * @param {String} d SVG path for which their bounding box will be computed.
 * @returns {BBox}
 */
export = function svgPathBbox(d: string): BBox {
  const min = [Infinity, Infinity],
    max = [-Infinity, -Infinity];
  svgPath(d)
    .abs()
    .unarc()
    .unshort()
    .iterate((seg, _, x, y) => {
      switch (seg[0]) {
        case "M":
        case "L": {
          if (min[0] > seg[1]) {
            min[0] = seg[1];
          }
          if (min[1] > seg[2]) {
            min[1] = seg[2];
          }
          if (max[0] < seg[1]) {
            max[0] = seg[1];
          }
          if (max[1] < seg[2]) {
            max[1] = seg[2];
          }
          break;
        }
        case "V": {
          if (min[1] > seg[1]) {
            min[1] = seg[1];
          }
          if (max[1] < seg[1]) {
            max[1] = seg[1];
          }
          break;
        }
        case "H": {
          if (min[0] > seg[1]) {
            min[0] = seg[1];
          }
          if (max[0] < seg[1]) {
            max[0] = seg[1];
          }
          break;
        }
        case "C": {
          const cxMinMax = minmaxC([x, seg[1], seg[3], seg[5]]);
          if (min[0] > cxMinMax[0]) {
            min[0] = cxMinMax[0];
          }
          if (max[0] < cxMinMax[1]) {
            max[0] = cxMinMax[1];
          }

          const cyMinMax = minmaxC([y, seg[2], seg[4], seg[6]]);
          if (min[1] > cyMinMax[0]) {
            min[1] = cyMinMax[0];
          }
          if (max[1] < cyMinMax[1]) {
            max[1] = cyMinMax[1];
          }
          break;
        }
        case "Q": {
          const qxMinMax = minmaxQ([x, seg[1], seg[3]]);
          if (min[0] > qxMinMax[0]) {
            min[0] = qxMinMax[0];
          }
          if (max[0] < qxMinMax[1]) {
            max[0] = qxMinMax[1];
          }

          const qyMinMax = minmaxQ([y, seg[2], seg[4]]);
          if (min[1] > qyMinMax[0]) {
            min[1] = qyMinMax[0];
          }
          if (max[1] < qyMinMax[1]) {
            max[1] = qyMinMax[1];
          }
          break;
        }
      }
    }, true);
  return [min[0], min[1], max[0], max[1]];
};
