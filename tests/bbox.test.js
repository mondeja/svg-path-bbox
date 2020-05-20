'use strict';

const {
  svgPathBbox,
  cubicBezierCurveBbox,
} = require('./../src/bbox.js');

const svgPathBbboxLinealCases = [
  // Mz
  ['M5 3z', null, null, [5, 3, 5, 3]],
  // Mz negative
  ['M-5 -3z', null, null, [-5, -3, -5, -3]],

  // Mlz
  ['M5 3l5 0z', null, null, [5, 3, 10, 3]],
  // Mlz negative
  ['M-5 -3l10 0z', null, null, [-5, -3, 5, -3]],
  // MLz
  ['M5 1L6 2z', null, null, [5, 1, 6, 2]],
  // MLz negative
  ['M-5 -1L3 2', null, null, [-5, -1, 3, 2]],

  // Mmz
  ['M5 3m5 0z', null, null, [5, 3, 10, 3]],
  // Mmz negative
  ['M-5 -3m10 0z', null, null, [-5, -3, 5, -3]],
  // MMz
  ['M5 3M10 8z', null, null, [5, 3, 10, 8]],
  // MMz negative
  ['M-5 -3M-10 -8z', null, null, [-10, -8, -5, -3]],

  // Mvz
  ['M1 5v3z', null, null, [1, 5, 1, 8]],
  // Mvz negative
  ['M-5 -5v3z', null, null, [-5, -5, -5, -2]],
  // MVz
  ['M1 1V5z', null, null, [1, 1, 1, 5]],
  // MVz negative
  ['M-1 -1V-5z', null, null, [-1, -5, -1, -1]],

  // Mhz
  ['M1 5h3z', null, null, [1, 5, 4, 5]],
  // Mhz negative
  ['M-1 -5h-3z', null, null, [-4, -5, -1, -5]],
  // MHz
  ['M1 5H3z', null, null, [1, 5, 3, 5]],
  // MHz negative
  ['M-1 -5H-2z', null, null, [-2, -5, -1, -5]],
];

describe('svgPathBbox(d, minAccuracy, maxAccuracy) [Lineal examples]', () => {
  test.each(svgPathBbboxLinealCases)(
    'svgPathBbox(%p, %p, %p)  ⇢  %p',
    (d, minAccuracy, maxAccuracy, bbox) => {
      expect(svgPathBbox(d, minAccuracy, maxAccuracy)).toEqual(bbox);
    }
  );
});

const svgPathBbboxCurveCases = [
  // Mcz
  [
    // Relative path
    'M1 1c1 0 1 1 0 1z', null, null, [1, 1, 1.75, 2],
    // Absolute points with accuracy 1
    () => { return cubicBezierCurveBbox([1, 1], [2, 1], [2, 2], [1, 2], 1); },
  ],
  [
    // Absolute path
    'M1 1C2 1 2 2 1 2z', null, null, [1, 1, 1.75, 2],
    // Absolute points with accuracy 5
    () => { return cubicBezierCurveBbox([1, 1], [2, 1], [2, 2], [1, 2], 5); },
  ],
];

describe('svgPathBbox(d, minAccuracy, maxAccuracy) [Curve examples]', () => {
  test.each(svgPathBbboxCurveCases)(
    'svgPathBbox(%p, %p, %p)  ⇢  %p',
    (d, minAccuracy, maxAccuracy, bbox, curveTest) => {
      expect(svgPathBbox(d, minAccuracy, maxAccuracy)).toEqual(bbox);
      expect(curveTest()).toEqual(bbox);
    }
  );
});
