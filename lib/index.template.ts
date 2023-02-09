"use strict";

import * as svgPath from "svgpath";

type minMax = [min: number, max: number];
export type BBox = [minX: number, minY: number, maxX: number, maxY: number];

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
  const K = A[0] - 3 * A[1] + 3 * A[2] - A[3];

  // if the polynomial is (almost) quadratic and not cubic
  if (Math.abs(K) < CBEZIER_MINMAX_EPSILON) {
    if (A[0] === A[3] && A[0] === A[1]) {
      // no curve, point targeting same location
      return [A[0], A[3]];
    }

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
export default function svgPathBbox(d: string): BBox {
  const min = [Infinity, Infinity],
    max = [-Infinity, -Infinity];
  svgPath(d)
    .abs()
    .unarc()
    .unshort()
    .iterate((seg, _, x, y) => {
      switch (seg[0]) {
        /*cases*/
      }
    }, true);
  return [min[0], min[1], max[0], max[1]];
}
