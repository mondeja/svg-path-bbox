'use strict';

const {
  pathNumbers,
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
