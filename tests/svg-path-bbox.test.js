'use strict';

const {svgPathBbox} = require('./../src/bbox.js');

const svgPathBbboxCases = [
  // Mlz
  ['M5 3l5 0z', null, null, [5, 3, 10, 3]],
  // Mlz negative
  ['M-5 -3l10 0z', null, null, [-5, -3, 5, -3]],

  // Mmz
  ['M5 3m5 0z', null, null, [5, 3, 10, 3]],
  // Mmz negative
  ['M-5 -3m10 0z', null, null, [-5, -3, 5, -3]],
];

describe('svgPathBbox(d, minAccuracy, maxAccuracy)', () => {
  test.each(svgPathBbboxCases)(
    'svgPathBbox(%p, %p, %p) => %p',
    (d, minAccuracy, maxAccuracy, bbox) => {
      expect(svgPathBbox(d, minAccuracy, maxAccuracy)).toEqual(bbox);
    }
  );
});
