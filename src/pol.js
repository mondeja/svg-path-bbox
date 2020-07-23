'use strict';

const {angleBetween} = require('./util');

// Line algorithm:
// B(t) = p0 + (p1 - p0) * t
const lineXY = function (p0, p1, t) {
  return [(p0[0] + (p1[0] - p0[0])) * t, (p0[1] + (p1[1] - p0[1])) * t];
};

// Cubic bezier algorithm:
// B(t) = (1-t)**3 * p0 + 3*(1-t)**2 * t * p1 + 3*(1-t)**2 * p2 + t**3 * p3 , 0 <= t <= 1
const cubicBezierXY = function (p0, p1, p2, p3, t) {
  return [
    Math.pow(1 - t, 3) * p0[0] + 3 * t * Math.pow(1 - t, 2) * p1[0] +
      3 * t * t * (1 - t) * p2[0] + t * t * t * p3[0],
    Math.pow(1 - t, 3) * p0[1] + 3 * t * Math.pow(1 - t, 2) * p1[1] +
      3 * t * t * (1 - t) * p2[1] + t * t * t * p3[1]
  ];
};

// Quadratic Bezier algorithm
// B(t) = (1-t)**2 * p0 + 2*(1-t)*t *p1 + t**2 * p2
const quadraticBezierXY = function (p0, p1, p2, t) {
  return [
    Math.pow(1 - t, 2) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
    Math.pow(1 - t, 2) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]
  ];
};

// https://github.com/MadLittleMods/svg-curve-lib
const ellipticalArcXY = function (p0, rx, ry, xAxisRotation, largeArc, sweep, p1, t) {
  // In accordance to: http://www.w3.org/TR/SVG/implnote.html#ArcOutOfRangeParameters
  // This is not handled by `svg-path-parser`: https://github.com/hughsk/svg-path-parser/issues/13
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  xAxisRotation = (xAxisRotation % 360 + 360) % 360;
  const xAxisRotationRadians = xAxisRotation * Math.PI / 180;
  // If the endpoints are identical, then this is equivalent to omitting the elliptical arc segment entirely.
  if (p0[0] === p1[0] && p0[0] === p1[1]) {
    return p0;
  }

  // If rx = 0 or ry = 0 then this arc is treated as a straight line segment joining the endpoints.
  if (rx === 0 || ry === 0) {
    return lineXY(p0, p1, t);
  }

  // Following "Conversion from endpoint to center parameterization"
  // http://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter

  // Step #1: Compute transformedPoint
  const dx = (p0[0] - p1[0]) / 2;
  const dy = (p0[1] - p1[1]) / 2;
  const transformedPoint = [
    Math.cos(xAxisRotationRadians) * dx + Math.sin(xAxisRotationRadians) * dy,
    -Math.sin(xAxisRotationRadians) * dx + Math.cos(xAxisRotationRadians) * dy
  ];
  // Ensure radii are large enough
  const radiiCheck = Math.pow(transformedPoint[0], 2) / Math.pow(rx, 2) + Math.pow(transformedPoint[1], 2) / Math.pow(ry, 2);
  if (radiiCheck > 1) {
    rx = Math.sqrt(radiiCheck) * rx;
    ry = Math.sqrt(radiiCheck) * ry;
  }

  // Step #2: Compute transformedCenter
  const cSquareNumerator = Math.pow(rx, 2) * Math.pow(ry, 2) - Math.pow(rx, 2) * Math.pow(transformedPoint[1], 2) - Math.pow(ry, 2) * Math.pow(transformedPoint[0], 2);
  const cSquareRootDenom = Math.pow(rx, 2) * Math.pow(transformedPoint[1], 2) + Math.pow(ry, 2) * Math.pow(transformedPoint[0], 2);
  let cRadicand = cSquareNumerator / cSquareRootDenom;
  // Make sure this never drops below zero because of precision
  cRadicand = cRadicand < 0 ? 0 : cRadicand;
  const cCoef = (largeArc !== sweep ? 1 : -1) * Math.sqrt(cRadicand);
  const transformedCenter = [
    cCoef * ((rx * transformedPoint[1]) / ry),
    cCoef * (-(ry * transformedPoint[0]) / rx)
  ];

  // Step #3: Compute center
  const center = [
    Math.cos(xAxisRotationRadians) * transformedCenter[0] - Math.sin(xAxisRotationRadians) * transformedCenter[1] + ((p0[0] + p1[0]) / 2),
    Math.sin(xAxisRotationRadians) * transformedCenter[0] + Math.cos(xAxisRotationRadians) * transformedCenter[1] + ((p0[1] + p1[1]) / 2)
  ];

  // Step #4: Compute start/sweep angles
  // Start angle of the elliptical arc prior to the stretch and rotate operations.
  // Difference between the start and end angles
  const startVector = [
    (transformedPoint[0] - transformedCenter[0]) / rx,
    (transformedPoint[1] - transformedCenter[1]) / ry,
  ];
  const startAngle = angleBetween([1, 0], startVector);

  const endVector = [
    (-transformedPoint[0] - transformedCenter[0]) / rx,
    (-transformedPoint[1] - transformedCenter[1]) / ry,
  ];
  let sweepAngle = angleBetween(startVector, endVector);

  if (!sweep && sweepAngle > 0) {
    sweepAngle -= 2 * Math.PI;
  } else if (sweep && sweepAngle < 0) {
    sweepAngle += 2 * Math.PI;
  }
  // We use % instead of `mod(..)` because we want it to be
  //   -360deg to 360deg (but actually in radians)
  sweepAngle %= 2 * Math.PI;

  // From http://www.w3.org/TR/SVG/implnote.html#ArcParameterizationAlternatives
  const angle = startAngle + (sweepAngle * t);
  const ellipseComponentX = rx * Math.cos(angle);
  const ellipseComponentY = ry * Math.sin(angle);

  return [
    Math.cos(xAxisRotationRadians) * ellipseComponentX - Math.sin(xAxisRotationRadians) * ellipseComponentY + center[0],
    Math.sin(xAxisRotationRadians) * ellipseComponentX + Math.cos(xAxisRotationRadians) * ellipseComponentY + center[1],
  ];
};

module.exports = {
  lineXY,
  cubicBezierXY,
  quadraticBezierXY,
  ellipticalArcXY,
};
