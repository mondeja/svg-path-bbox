'use strict';

const {
  svgPathBbox,
  cubicBezierCurveBbox,
  ellipticalArcBbox,
} = require('./bbox');
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

  // Utility functions
  pathNumbers,
  angleBetween,
  maxFloatingNumbers
};
