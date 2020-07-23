'use strict';

const {
  svgPathBbox,
  cubicBezierCurveBbox,
  ellipticalArcBbox,
} = require('./bbox');
const {
  lineXY,
  cubicBezierXY,
  quadraticBezierXY,
  ellipticalArcXY,
} = require('./pol');
const {
  pathNumbers,
  angleBetween,
  maxFloatingNumbers,
} = require('./util');

module.exports = {
  // BBOX functions
  svgPathBbox,
  cubicBezierCurveBbox,
  ellipticalArcBbox,

  // Point on line functions
  lineXY,
  cubicBezierXY,
  quadraticBezierXY,
  ellipticalArcXY,

  // Utility functions
  pathNumbers,
  angleBetween,
  maxFloatingNumbers
};
