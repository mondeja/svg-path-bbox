'use strict';

const {parseSVG, makeAbsolute} = require('svg-path-parser');

const {cubicBezierXY, quadraticBezierXY, ellipticalArcXY} = require('./pol');
const {maxFloatingNumbers} = require('./util');

const cubicBezierCurveBbox = function (p0, p1, p2, p3, accuracy) {
  const min = [Infinity, Infinity], max = [-Infinity, -Infinity];
  let xy;

  for (let t = 0; t <= 1; t += 1 / Math.pow(10, accuracy)) {
    xy = cubicBezierXY(p0, p1, p2, p3, t);
    min[0] = Math.min(min[0], xy[0]);
    min[1] = Math.min(min[1], xy[1]);
    max[0] = Math.max(max[0], xy[0]);
    max[1] = Math.max(max[1], xy[1]);
  }

  return [min[0], min[1], max[0], max[1]];
};

const quadraticBezierCurveBbox = function (p0, p1, p2, accuracy) {
  const min = [Infinity, Infinity], max = [-Infinity, -Infinity];
  let xy;

  for (let t = 0; t <= 1; t += 1 / Math.pow(10, accuracy)) {
    xy = quadraticBezierXY(p0, p1, p2, t);
    min[0] = Math.min(min[0], xy[0]);
    min[1] = Math.min(min[1], xy[1]);
    max[0] = Math.max(max[0], xy[0]);
    max[1] = Math.max(max[1], xy[1]);
  }

  return [min[0], min[1], max[0], max[1]];
};

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

const svgPathBbox = function (d, minAccuracy, maxAccuracy) {
  minAccuracy = Math.max(1, minAccuracy);

  const min = [Infinity, Infinity], max = [-Infinity, -Infinity];
  let cBbox, p1;

  const dCommands = makeAbsolute(parseSVG(d));

  // Previous reflection absolute coordinate
  let _lastReflectionAbsCoord;

  for (let dc = 0; dc < dCommands.length; dc++) {
    // Command letter
    const cmd = dCommands[dc];

    if (['z', 'Z'].indexOf(cmd.code) > -1) {
      continue;
    }

    // Extent bounding box
    switch (cmd.code) {
    case 'M':
    case 'L':
      min[0] = Math.min(min[0], cmd.x);
      min[1] = Math.min(min[1], cmd.y);
      max[0] = Math.max(max[0], cmd.x);
      max[1] = Math.max(max[1], cmd.y);

      _lastReflectionAbsCoord = [cmd.x, cmd.y];
      break;
    case 'V':
      min[1] = Math.max(min[1], cmd.y);
      max[1] = Math.max(max[1], cmd.y);

      _lastReflectionAbsCoord = [cmd.x, cmd.y];
      break;
    case 'H':
      min[0] = Math.max(min[0], cmd.x);
      max[0] = Math.max(max[0], cmd.x);

      _lastReflectionAbsCoord = [cmd.x, cmd.y];
      break;
    case 'C':
      cBbox = cubicBezierCurveBbox(
        [cmd.x0, cmd.y0],
        [cmd.x1, cmd.y1],
        [cmd.x2, cmd.y2],
        [cmd.x, cmd.y],
        maxFloatingNumbers([cmd.x0, cmd.y0, cmd.x1, cmd.y1,
          cmd.x2, cmd.y2, cmd.x, cmd.y],
        minAccuracy, maxAccuracy));

      min[0] = Math.min(cBbox[0], min[0]);
      min[1] = Math.min(cBbox[1], min[1]);
      max[0] = Math.max(cBbox[2], max[0]);
      max[1] = Math.max(cBbox[3], max[1]);

      _lastReflectionAbsCoord = [cmd.x2, cmd.y2];
      break;
    case 'S':
      // Compute reflection
      // SVG spec: If there is no previous command or if the previous
      //   command was not an C, c, S or s, assume the first control
      //   point is coincident with the current point
      if (dc === 0 || ['C', 'S'].indexOf(dCommands[dc - 1].code) === -1) {
        p1 = [cmd.x0, cmd.y0];
      } else {
        p1 = [_lastReflectionAbsCoord[0], _lastReflectionAbsCoord[1]];
      }

      cBbox = cubicBezierCurveBbox(
        [cmd.x0, cmd.y0], p1, [cmd.x2, cmd.y2], [cmd.x, cmd.y],
        maxFloatingNumbers(
          [cmd.x0, cmd.y0, p1[0], p1[1], cmd.x2, cmd.y2, cmd.x, cmd.y],
          minAccuracy, maxAccuracy));

      min[0] = Math.min(cBbox[0], min[0]);
      min[1] = Math.min(cBbox[1], min[1]);
      max[0] = Math.max(cBbox[2], max[0]);
      max[1] = Math.max(cBbox[3], max[1]);

      _lastReflectionAbsCoord = [cmd.x2, cmd.y2];
      break;
    case 'Q':
      cBbox = quadraticBezierCurveBbox(
        [cmd.x0, cmd.y0],
        [cmd.x1, cmd.y1],
        [cmd.x, cmd.y],
        maxFloatingNumbers(
          [cmd.x0, cmd.y0, cmd.x1, cmd.y1, cmd.x, cmd.y],
          minAccuracy, maxAccuracy));

      min[0] = Math.min(cBbox[0], min[0]);
      min[1] = Math.min(cBbox[1], min[1]);
      max[0] = Math.max(cBbox[2], max[0]);
      max[1] = Math.max(cBbox[3], max[1]);

      _lastReflectionAbsCoord = [cmd.x1, cmd.y1];
      break;
    case 'T':
      // Compute reflection
      // SVG spec: If there is no previous command or if the previous
      //   command was not a Q, q, T or t, assume the control point
      //   is coincident with the current point.
      if (dc === 0 || ['Q', 'T'].indexOf(dCommands[dc - 1].code) === -1) {
        p1 = [cmd.x0, cmd.y0];
      } else {
        p1 = [_lastReflectionAbsCoord[0], _lastReflectionAbsCoord[1]];
      }
      cBbox = quadraticBezierCurveBbox(
        [cmd.x0, cmd.y0],
        p1,
        [cmd.x, cmd.y],
        maxFloatingNumbers(
          [cmd.x0, cmd.y0, p1[0], p1[1], cmd.x, cmd.y],
          minAccuracy, maxAccuracy));

      min[0] = Math.min(cBbox[0], min[0]);
      min[1] = Math.min(cBbox[1], min[1]);
      max[0] = Math.max(cBbox[2], max[0]);
      max[1] = Math.max(cBbox[3], max[1]);

      _lastReflectionAbsCoord = p1;
      break;
    case 'A':
      cBbox = ellipticalArcBbox(
        [cmd.x0, cmd.y0],
        cmd.rx,
        cmd.ry,
        cmd.xAxisRotation,
        cmd.largeArc,
        cmd.sweep,
        [cmd.x, cmd.y],
        maxFloatingNumbers(
          [cmd.x0, cmd.y0, cmd.x, cmd.y],
          minAccuracy, maxAccuracy));

      min[0] = Math.min(cBbox[0], min[0]);
      min[1] = Math.min(cBbox[1], min[1]);
      max[0] = Math.max(cBbox[2], max[0]);
      max[1] = Math.max(cBbox[3], max[1]);

      _lastReflectionAbsCoord = [cmd.x, cmd.y];
      break;
    }
  }
  return [min[0], min[1], max[0], max[1]];
};

module.exports = {
  svgPathBbox,
  cubicBezierCurveBbox,
  quadraticBezierCurveBbox,
  ellipticalArcBbox,
};
