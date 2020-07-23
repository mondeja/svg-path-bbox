'use strict';

const {
  lineXY,
} = require('./../src/pol');

const pointOnLineCases = [
  [[0, 0], [2, 0], .5, [1, 0]],
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
