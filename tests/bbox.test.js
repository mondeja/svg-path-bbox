'use strict';

const {svgPathBbox} = require('./../src/bbox.js');

const svgPathBbboxCases = [
  // Mz
  ['M5 3z', null, null, [5, 3, 5, 3]],
  // Mz negative
  ['M-5 -3z', null, null, [-5, -3, -5, -3]],

  // Mlz
  ['M5 3l5 0z', null, null, [5, 3, 10, 3]],
  // Mlz negative
  ['M-5 -3l10 0z', null, null, [-5, -3, 5, -3]],

  // Mmz
  ['M5 3m5 0z', null, null, [5, 3, 10, 3]],
  // Mmz negative
  ['M-5 -3m10 0z', null, null, [-5, -3, 5, -3]],

  // MMz
  ['M5 3M10 8z', null, null, [5, 3, 10, 8]],
  // MMz negative
  ['M-5 -3M-10 -8z', null, null, [-10, -8, -5, -3]],

  // Mvz
  ['M0 5V3z', null, null, [0, 3, 0, 5]],
  // Mvz negative
  ['M-5 -5V3z', null, null, [-5, -5, -5, 3]],

  // MVz
  ['M1 1V5z', null, null, [1, 1, 1, 5]],
  // MVz negative
  ['M-1 -1V-5z', null, null, [-1, -5, -1, -1]]
];

describe('svgPathBbox(d, minAccuracy, maxAccuracy)', () => {
  test.each(svgPathBbboxCases)(
    'svgPathBbox(%p, %p, %p) => %p',
    (d, minAccuracy, maxAccuracy, bbox) => {
      expect(svgPathBbox(d, minAccuracy, maxAccuracy)).toEqual(bbox);
    }
  );
});
