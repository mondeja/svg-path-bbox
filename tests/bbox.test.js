'use strict';

const {
  svgPathBbox,
  cubicBezierCurveBbox,
} = require('./../src/bbox');


const svgPathBbboxLinealCases = [
  // Mz
  ['M5 3z', [5, 3, 5, 3]],
  // Mz negative
  ['M-5 -3z', [-5, -3, -5, -3]],

  // Mlz
  ['M5 3l5 0z', [5, 3, 10, 3]],
  // Mlz negative
  ['M-5 -3l10 0z', [-5, -3, 5, -3]],
  // MLz
  ['M5 1L6 2z', [5, 1, 6, 2]],
  // MLz negative
  ['M-5 -1L3 2', [-5, -1, 3, 2]],

  // Mmz
  ['M5 3m5 0z', [5, 3, 10, 3]],
  // Mmz negative
  ['M-5 -3m10 0z', [-5, -3, 5, -3]],
  // MMz
  ['M5 3M10 8z', [5, 3, 10, 8]],
  // MMz negative
  ['M-5 -3M-10 -8z', [-10, -8, -5, -3]],

  // Mvz
  ['M1 5v3z', [1, 5, 1, 8]],
  // Mvz negative
  ['M-5 -5v3z', [-5, -5, -5, -2]],
  // MVz
  ['M1 1V5z', [1, 1, 1, 5]],
  // MVz negative
  ['M-1 -1V-5z', [-1, -5, -1, -1]],

  // Mhz
  ['M1 5h3z', [1, 5, 4, 5]],
  // Mhz negative
  ['M-1 -5h-3z', [-4, -5, -1, -5]],
  // MHz
  ['M1 5H3z', [1, 5, 3, 5]],
  // MHz negative
  ['M-1 -5H-2z', [-2, -5, -1, -5]],
];

describe('svgPathBbox(d) [Lineal examples]', () => {
  test.each(svgPathBbboxLinealCases)(
    'svgPathBbox(%p, %p, %p) ⇢ %p',
    (d, bbox) => {
      expect(svgPathBbox(d)).toEqual(bbox);
    }
  );
});


const svgPathBbboxCurveCases = [
  [
    // Mcz
    'M1 1c1 0 1 1 0 1z', [1, 1, 1.75, 2],
    // Absolute points with accuracy 1
    () => cubicBezierCurveBbox([1, 1], [2, 1], [2, 2], [1, 2], 1),
  ],
  [
    // MCZ
    'M1 1C2 1 2 2 1 2z', [1, 1, 1.75, 2],
    // Absolute points with accuracy 5
    () => cubicBezierCurveBbox([1, 1], [2, 1], [2, 2], [1, 2], 5),
  ],

  [
    // Mqz
    'M1 1q1 1 0 2z', [1, 1, 1.5, 3],
    () => cubicBezierCurveBbox(
      [1, 1],
      [1.6666666666666665, 1.6666666666666665],
      [1.6666666666666665, 2.3333333333333335],
      [1, 3]),
  ],
  [
    // MQZ
    'M1 1Q2 2 1 3z', [1, 1, 1.5, 3],
    () => cubicBezierCurveBbox(
      [1, 1],
      [1.6666666666666665, 1.6666666666666665],
      [1.6666666666666665, 2.3333333333333335],
      [1, 3]),
  ]
];

describe('svgPathBbox(d) [Curve examples]', () => {
  test.each(svgPathBbboxCurveCases)(
    'svgPathBbox(%p, %p, %p) ⇢ %p',
    (d, bbox, curveTest) => {
      expect(svgPathBbox(d)).toEqual(bbox);
      expect(curveTest()).toEqual(bbox);
    }
  );
});
