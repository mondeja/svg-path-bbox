'use strict';

const {
  pathNumbers,
  maxFloatingNumbers,
} = require('./../src/util.js');

const pathNumbersCases = [
  // Simple positive
  ['M5 6', [5, 6]],
  ['M5 6z', [5, 6]],
  ['m5,6z', [5, 6]],

  // Positive with commas and floating point numbers
  ['m5.6,7', [5.6, 7]],
  ['m5.6.7', [5.6, .7]],
  ['4.5.6.3.7.2', [4.5, .6, .3, .7, .2]],

  // Positive with multiples commas, spaces and floating point numbers
  ['3,5.3,.5', [3, 5.3, .5]],
  ['3,5.3,m.2', [3, 5.3, .2]],
  ['M   4.5.2,,,, 9.3 .1z', [4.5, .2, 9.3, .1]],

  // Simple negative
  ['M5 -6', [5, -6]],
  ['M5-6z', [5, -6]],
  ['m-5,-6z', [-5, -6]],

  // Negative with commas and floating point numbers
  ['m-5.6,-7', [-5.6, -7]],
  ['m-5.6-.7', [-5.6, -.7]],
  ['4.5-.6.3-.7-.2', [4.5, -.6, .3, -.7, -.2]],

  // Negative with multiples commas, spaces and floating point numbers
  ['-3,-5-.3,-.5', [-3, -5, -.3, -.5]],
  ['3,5.3,m-.2', [3, 5.3, -.2]],
  ['M   -4.5-.2,,,, -9.3 -.1z', [-4.5, -.2, -9.3, -.1]],
];

describe('pathNumbers(d)', () => {
  test.each(pathNumbersCases)(
    'pathNumbers(%p) ⇢  %p',
    (d, result) => {
      expect(pathNumbers(d)).toEqual(result);
    }
  );
});

const maxFloatingNumberCases = [
  // Simple
  [[5, -.6, .7, 1], null, null, 1],
  [[5, .6, -.754, 1.32], null, null, 3],
  [[-5, .01010101], null, null, 8],

  // Maximum limit
  [[5, -.01010101], null, 5, 5],
  [[5, -.01010101], null, 10, 8],
  //   (0 is the minimum maximum limit)
  [[5, .01010101], null, -5, 0],

  // Minimum limit
  [[5, .01010101], 5, null, 8],
  [[-5, .01010101], -5, null, 8],
  [[-5, .01010101], 10, null, 10],
];

describe('maxFloatingNumbers(d)', () => {
  test.each(maxFloatingNumberCases)(
    'maxFloatingNumbers(%p, %p, %p) ⇢  %p',
    (d, min, max, result) => {
      expect(maxFloatingNumbers(d, min, max)).toEqual(result);
    }
  );
});
