'use strict';

const {
  lineXY,
  cubicBezierXY,
  quadraticBezierXY,
} = require('./../src/pol');


const pointOnLineCases = [
  [[0, 0], [2, 0], .5, [1, 0]],
  [[0, 0], [2, 0], 0, [0, 0]],
  [[0, 0], [2, 0], 1, [2, 0]],

  [[0, 0], [10, 10], .5, [5, 5]],
  [[0, 0], [10, 10], .1, [1, 1]],
  [[0, 0], [10, 10], .7, [7, 7]],
];

describe('lineXY(p0, p1, t)', () => {
  test.each(pointOnLineCases)(
    'lineXY(%p, %p, %p) ⇢ %p',
    (p0, p1, t, result) => {
      expect(lineXY(p0, p1, t)).toEqual(result);
    }
  );
});


const pointOnCubicBezierCases = [
  [[0, 0], [0, 10], [10, 10], [10, 0], .5, [5, 7.5]],
  [[0, 0], [0, 10], [10, 10], [10, 0], .25, [1.5625, 5.625]],
  [[0, 0], [0, -9], [-9, -9], [-9, 0], .5, [-4.5, -6.75]],
];

describe('cubicBezierXY(p0, p1, p2, p3, t)', () => {
  test.each(pointOnCubicBezierCases)(
    'cubicBezierXY(%p, %p, %p, %p, %p) ⇢ %p',
    (p0, p1, p2, p3, t, result) => {
      expect(cubicBezierXY(p0, p1, p2, p3, t)).toEqual(result);
    }
  );
});


const pointOnQuadraticBezierCases = [
  [[0, 0], [0, 10], [10, 10], .5, [2.5, 7.5]],
  [[0, 0], [0, 10], [10, 10], .25, [0.625, 4.375]],

  [[0, 0], [10, 0], [10, 10], .5, [7.5, 2.5]],
  [[0, 0], [-10, 0], [-10, -10], .25, [-4.375, -0.625]],
];

describe('quadraticBezierXY(p0, p1, p2, t)', () => {
  test.each(pointOnQuadraticBezierCases)(
    'quadraticBezierXY(%p, %p, %p, %p) ⇢ %p',
    (p0, p1, p2, t, result) => {
      expect(quadraticBezierXY(p0, p1, p2, t)).toEqual(result);
    }
  );
});
