'use strict';

const svgPath = require('svgpath');

const ellipticalArcXY = require('polf/src/elliptical-arc').default;

const TWO_THIRDS = 2.0 / 3.0;

// https://github.com/adobe-webplatform/Snap.svg/blob/b242f49e6798ac297a3dad0dfb03c0893e394464/src/path.js#L856
function cubicBezierCurveBbox(p0, p1, p2, p3) {
  const tvalues = [], bounds = [[], []];
  let a, b, c, t, t1, t2, b2ac, sqrtb2ac;
  for (let i = 0; i < 2; ++i) {
    if (i === 0) {
      b = 6 * p0[0] - 12 * p1[0] + 6 * p2[0];
      a = -3 * p0[0] + 9 * p1[0] - 9 * p2[0] + 3 * p3[0];
      c = 3 * p1[0] - 3 * p0[0];
    } else {
      b = 6 * p0[1] - 12 * p1[1] + 6 * p2[1];
      a = -3 * p0[1] + 9 * p1[1] - 9 * p2[1] + 3 * p3[1];
      c = 3 * p1[1] - 3 * p0[1];
    }
    if (Math.abs(a) < 1e-12) {
      if (Math.abs(b) < 1e-12) {
        continue;
      }
      t = -c / b;
      if (t > 0 && t < 1) {
        tvalues.push(t);
      }
      continue;
    }
    b2ac = b * b - 4 * c * a;
    sqrtb2ac = Math.sqrt(b2ac);
    if (b2ac < 0) {
      continue;
    }
    t1 = (-b + sqrtb2ac) / (2 * a);
    if (t1 > 0 && t1 < 1) {
      tvalues.push(t1);
    }
    t2 = (-b - sqrtb2ac) / (2 * a);
    if (t2 > 0 && t2 < 1) {
      tvalues.push(t2);
    }
  }

  let j = tvalues.length, mt;
  const jlen = j;
  while (j--) {
    t = tvalues[j];
    mt = 1 - t;
    bounds[0][j] = mt * mt * mt * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t * t * t * p3[0];
    bounds[1][j] = mt * mt * mt * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t * t * t * p3[1];
  }

  bounds[0][jlen] = p0[0];
  bounds[1][jlen] = p0[1];
  bounds[0][jlen + 1] = p3[0];
  bounds[1][jlen + 1] = p3[1];
  bounds[0].length = bounds[1].length = jlen + 2;

  return [
    Math.min.apply(0, bounds[0]),
    Math.min.apply(0, bounds[1]),
    Math.max.apply(0, bounds[0]),
    Math.max.apply(0, bounds[1])
  ];
}

const ellipticalArcBbox = function (p0, rx, ry, xAxisRotation, largeArc, sweep, p1, accuracy) {
  const min = [Infinity, Infinity], max = [-Infinity, -Infinity];
  let xy;

  for (let t = 0; t <= 1; t += 1 / Math.pow(10, accuracy)) {
    xy = ellipticalArcXY(p0, rx, ry, xAxisRotation, largeArc, sweep, p1, t);
    min[0] = Math.min(min[0], xy[0]);
    min[1] = Math.min(min[1], xy[1]);
    max[0] = Math.max(max[0], xy[0]);
    max[1] = Math.max(max[1], xy[1]);
  }
  return [min[0], min[1], max[0], max[1]];
};

const svgPathBbox = function (d) {
  const min = [Infinity, Infinity], max = [-Infinity, -Infinity];
  let cBbox;

  svgPath(d).abs().unarc().unshort().iterate((seg, dc, x, y) => {
    switch (seg[0]) {
    case 'M':
    case 'L':
      min[0] = Math.min(min[0], seg[1]);
      min[1] = Math.min(min[1], seg[2]);
      max[0] = Math.max(max[0], seg[1]);
      max[1] = Math.max(max[1], seg[2]);
      break;
    case 'V':
      min[1] = Math.min(min[1], seg[1]);
      max[1] = Math.max(max[1], seg[1]);
      break;
    case 'H':
      min[0] = Math.min(min[0], seg[1]);
      max[0] = Math.max(max[0], seg[1]);
      break;
    case 'C':
      cBbox = cubicBezierCurveBbox(
        [x, y],
        [seg[1], seg[2]],
        [seg[3], seg[4]],
        [seg[5], seg[6]]);

      min[0] = Math.min(cBbox[0], min[0]);
      min[1] = Math.min(cBbox[1], min[1]);
      max[0] = Math.max(cBbox[2], max[0]);
      max[1] = Math.max(cBbox[3], max[1]);
      break;
    case 'Q':
      // Quadratic to cubic
      cBbox = cubicBezierCurveBbox(
        [x, y],
        [x + TWO_THIRDS * (seg[1] - x), y + TWO_THIRDS * (seg[2] - y)],
        [seg[3] + TWO_THIRDS * (seg[1] - seg[3]), seg[4] + TWO_THIRDS * (seg[1] - seg[4])],
        [seg[3], seg[4]]);

      min[0] = Math.min(cBbox[0], min[0]);
      min[1] = Math.min(cBbox[1], min[1]);
      max[0] = Math.max(cBbox[2], max[0]);
      max[1] = Math.max(cBbox[3], max[1]);
      break;
    }
  }, true);

  return [min[0], min[1], max[0], max[1]];
};

module.exports = {
  svgPathBbox,
  cubicBezierCurveBbox,
  ellipticalArcBbox,
};
