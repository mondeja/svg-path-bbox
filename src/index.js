"use strict"

var {parseSVG, makeAbsolute} = require('svg-path-parser');

// Cubic bezier algorithm:
// B(t) = (1-t)**3 * p0 + 3*(1-t)**2 * t * p1 + 3*(1-t)**2 * p2 + t**3 * p3 , 0 <= t <= 1
function cubicBezierXY(p0, p1, p2, p3, t) {
  return [
    Math.pow(1-t,3) * p0[0] + 3 * t * Math.pow(1 - t, 2) * p1[0]
      + 3 * t * t * (1 - t) * p2[0] + t * t * t * p3[0],
    Math.pow(1-t,3) * p0[1] + 3 * t * Math.pow(1 - t, 2) * p1[1]
      + 3 * t * t * (1 - t) * p2[1] + t * t * t * p3[1]
  ];
}

var cubicBezierCurveBbox = function(p0, p1, p2, p3, accuracy) {
  var min = [Infinity, Infinity],
      max = [-Infinity, -Infinity];

  for (var t=0; t<=1; t+=1/10**accuracy) {
    var xy = cubicBezierXY(p0, p1, p2, p3, t);
    min[0] = Math.min(min[0], xy[0]);
    min[1] = Math.min(min[1], xy[1]);
    max[0] = Math.max(max[0], xy[0]);
    max[1] = Math.max(max[1], xy[1]);
  }

  return [min[0], min[1], max[0], max[1]]
}

// Quadratic Bezier algorithm
// B(t) = (1-t)**2 * p0 + 2*(1-t)*t *p1 + t**2 * p2
function quadraticBezierXY(p0, p1, p2, t) {
  return [
    Math.pow(1-t,2) * p0[0] + 2 * (1-t) * t * p1[0] + t * t * p2[0],
    Math.pow(1-t,2) * p0[1] + 2 * (1-t) * t * p1[1] + t * t * p2[1]
  ]
}

var quadraticBezierCurveBbox = function(p0, p1, p2, accuracy) {
  var min = [Infinity, Infinity],
      max = [-Infinity, -Infinity];

  for (var t=0; t<=1; t+=1/10**accuracy) {
    var xy = quadraticBezierXY(p0, p1, p2, t);
    min[0] = Math.min(min[0], xy[0]);
    min[1] = Math.min(min[1], xy[1]);
    max[0] = Math.max(max[0], xy[0]);
    max[1] = Math.max(max[1], xy[1]);
  }

  return [min[0], min[1], max[0], max[1]]
}

var maxFloatingNumbers = function(numbers, min, max) {
  if (!min) {
    min = 1;
  } else {
    min = Math.max(1, min);
  }
  if (!max) {
    max = 3;
  }
  max = Math.max(min, max);
  var response = min;
  for (let n=0; n<numbers.length; n++) {
    var _nString = parseFloat(numbers[n]).toString();
    if (_nString.indexOf(".") == -1) {
      continue
    }
    response = Math.max(_nString.replace(  /\d+\./, '').length, response);
  }
  return Math.min(response, max);
}

var toRadians = function(degrees) {
	return degrees * Math.PI / 180;
}

var angleBetween = function(v0, v1) {
	var p = v0[0]*v1[0] + v0[1]*v1[1];
	var n = Math.sqrt((Math.pow(v0[0], 2)+Math.pow(v0[1], 2)) * (Math.pow(v1[0], 2)+Math.pow(v1[1], 2)));
	var sign = v0[0]*v1[1] - v0[1]*v1[0] < 0 ? -1 : 1;
	return sign*Math.acos(p/n);
}

// Line algorithm:
// B(t) = p0 + (p1 - p0) * t
var lineXY = function(p0, p1, t) {
  return [p0[0] + (p0[1] - p0[0]) * t, p1[0] + (p1[1] - p1[0]) * t];
};

// https://github.com/MadLittleMods/svg-curve-lib
var ellipticalArcXY = function(p0, rx, ry, xAxisRotation, largeArc, sweep, p1, t) {
	// In accordance to: http://www.w3.org/TR/SVG/implnote.html#ArcOutOfRangeParameters
  // This is not handled by `svg-path-parser`: https://github.com/hughsk/svg-path-parser/issues/13
	rx = Math.abs(rx);
	ry = Math.abs(ry);
	xAxisRotation = (xAxisRotation%360 + 360)%360;
	var xAxisRotationRadians = toRadians(xAxisRotation);
	// If the endpoints are identical, then this is equivalent to omitting the elliptical arc segment entirely.
	if (p0[0] === p1[0] && p0[0] === p1[1]) {
		return p0;
	}

	// If rx = 0 or ry = 0 then this arc is treated as a straight line segment joining the endpoints.
	if(rx === 0 || ry === 0) {
		return lineXY(p0, p1, t);
	}

	// Following "Conversion from endpoint to center parameterization"
	// http://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter

	// Step #1: Compute transformedPoint
	var dx = (p0[0]-p1[0])/2;
	var dy = (p0[1]-p1[1])/2;
	var transformedPoint = [
		Math.cos(xAxisRotationRadians)*dx + Math.sin(xAxisRotationRadians)*dy,
		-Math.sin(xAxisRotationRadians)*dx + Math.cos(xAxisRotationRadians)*dy
	];
	// Ensure radii are large enough
	var radiiCheck = Math.pow(transformedPoint[0], 2)/Math.pow(rx, 2) + Math.pow(transformedPoint[1], 2)/Math.pow(ry, 2);
	if (radiiCheck > 1) {
		rx = Math.sqrt(radiiCheck)*rx;
		ry = Math.sqrt(radiiCheck)*ry;
	}

	// Step #2: Compute transformedCenter
	var cSquareNumerator = Math.pow(rx, 2)*Math.pow(ry, 2) - Math.pow(rx, 2)*Math.pow(transformedPoint[1], 2) - Math.pow(ry, 2)*Math.pow(transformedPoint[0], 2);
	var cSquareRootDenom = Math.pow(rx, 2)*Math.pow(transformedPoint[1], 2) + Math.pow(ry, 2)*Math.pow(transformedPoint[0], 2);
	var cRadicand = cSquareNumerator/cSquareRootDenom;
	// Make sure this never drops below zero because of precision
	cRadicand = cRadicand < 0 ? 0 : cRadicand;
	var cCoef = (largeArc !== sweep ? 1 : -1) * Math.sqrt(cRadicand);
	var transformedCenter = [
		cCoef*((rx*transformedPoint[1])/ry),
		cCoef*(-(ry*transformedPoint[0])/rx)
	];

	// Step #3: Compute center
	var center = [
		Math.cos(xAxisRotationRadians)*transformedCenter[0] - Math.sin(xAxisRotationRadians)*transformedCenter[1] + ((p0[0]+p1[0])/2),
		Math.sin(xAxisRotationRadians)*transformedCenter[0] + Math.cos(xAxisRotationRadians)*transformedCenter[1] + ((p0[1]+p1[1])/2)
	];


	// Step #4: Compute start/sweep angles
	// Start angle of the elliptical arc prior to the stretch and rotate operations.
	// Difference between the start and end angles
	var startVector = [
    (transformedPoint[0]-transformedCenter[0])/rx,
    (transformedPoint[1]-transformedCenter[1])/ry,
  ]
	var startAngle = angleBetween([1, 0], startVector);

	var endVector = [
    (-transformedPoint[0]-transformedCenter[0])/rx,
    (-transformedPoint[1]-transformedCenter[1])/ry,
  ]
	var sweepAngle = angleBetween(startVector, endVector);

	if (!sweep && sweepAngle > 0) {
		sweepAngle -= 2*Math.PI;
	} else if (sweep && sweepAngle < 0) {
		sweepAngle += 2*Math.PI;
	}
	// We use % instead of `mod(..)` because we want it to be
  //   -360deg to 360deg (but actually in radians)
	sweepAngle %= 2*Math.PI;

	// From http://www.w3.org/TR/SVG/implnote.html#ArcParameterizationAlternatives
	var angle = startAngle+(sweepAngle*t);
	var ellipseComponentX = rx*Math.cos(angle);
	var ellipseComponentY = ry*Math.sin(angle);

	return [
    Math.cos(xAxisRotationRadians)*ellipseComponentX - Math.sin(xAxisRotationRadians)*ellipseComponentY + center[0],
    Math.sin(xAxisRotationRadians)*ellipseComponentX + Math.cos(xAxisRotationRadians)*ellipseComponentY + center[1],
  ]
};

var ellipticalArcBbox = function(p0, rx, ry, xAxisRotation, largeArc, sweep, p1, accuracy) {
  var min = [Infinity, Infinity],
      max = [-Infinity, -Infinity];

  for (var t=0; t<=1; t+=1/10**accuracy) {
    var xy = ellipticalArcXY(p0, rx, ry, xAxisRotation, largeArc, sweep, p1, t);
    min[0] = Math.min(min[0], xy[0]);
    min[1] = Math.min(min[1], xy[1]);
    max[0] = Math.max(max[0], xy[0]);
    max[1] = Math.max(max[1], xy[1]);
  }
  return [min[0], min[1], max[0], max[1]]
}

const svgPathBbox = function(d, minAccuracy, maxAccuracy) {
  minAccuracy = Math.max(1, minAccuracy);

  var min = [Infinity, Infinity],
      max = [-Infinity, -Infinity];

  var dCommands = makeAbsolute(parseSVG(d));

  // Previous reflection absolute coordinate
  var _lastReflectionAbsCoord = undefined;

  for (var dc=0; dc<dCommands.length; dc++) {
    // Command letter
    var cmd = dCommands[dc];

    if (["z", "Z"].indexOf(cmd.code) > -1) {
      continue;
    }

    // Extent bounding box
    switch (cmd.code) {
      case "M":
      case "L":
        min[0] = Math.min(min[0], cmd.x);
        min[1] = Math.min(min[1], cmd.y);
        max[0] = Math.max(max[0], cmd.x);
        max[1] = Math.max(max[1], cmd.y);

        _lastReflectionAbsCoord = [cmd.x, cmd.y];
        break;
      case "V":
        min[1] = Math.max(min[1], cmd.y);
        max[1] = Math.max(max[1], cmd.y);

        _lastReflectionAbsCoord = [cmd.x, cmd.y];
        break;
      case "H":
        min[0] = Math.max(min[0], cmd.x);
        max[0] = Math.max(max[0], cmd.x);

        _lastReflectionAbsCoord = [cmd.x, cmd.y];
        break;
      case "C":
        var cBbox = cubicBezierCurveBbox(
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
      case "S":
        // Compute reflection
        // SVG spec: If there is no previous command or if the previous
        //   command was not an C, c, S or s, assume the first control
        //   point is coincident with the current point
        var p1;
        if (dc == 0 || ["C", "S"].indexOf(dCommands[dc-1].code) == -1) {
          p1 = [cmd.x0, cmd.y0]
        } else {
          p1 = [_lastReflectionAbsCoord[0], _lastReflectionAbsCoord[1]]
        }
        var p0 = [cmd.x0, cmd.y0],
            p2 = [cmd.x2, cmd.y2],
            p3 = [cmd.x, cmd.y];

        var cBbox = cubicBezierCurveBbox(
          p0, p1, p2, p3, maxFloatingNumbers(
            [p0[0], p0[1], p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]],
            minAccuracy, maxAccuracy));

        min[0] = Math.min(cBbox[0], min[0]);
        min[1] = Math.min(cBbox[1], min[1]);
        max[0] = Math.max(cBbox[2], max[0]);
        max[1] = Math.max(cBbox[3], max[1]);

        _lastReflectionAbsCoord = p2;
        break;
      case "Q":
        var cBbox = quadraticBezierCurveBbox(
          [cmd.x0, cmd.y0],
          [cmd.x1, cmd.y1],
          [cmd.x, cmd.y],
          maxFloatingNumbers([
            cmd.x0, cmd.y0, cmd.x1, cmd.y1, cmd.x, cmd.y],
            minAccuracy, maxAccuracy));

        min[0] = Math.min(cBbox[0], min[0]);
        min[1] = Math.min(cBbox[1], min[1]);
        max[0] = Math.max(cBbox[2], max[0]);
        max[1] = Math.max(cBbox[3], max[1]);

        _lastReflectionAbsCoord = [cmd.x1, cmd.y1];
        break;
      case "T":
        // Compute reflection
        // SVG spec: If there is no previous command or if the previous
        //   command was not a Q, q, T or t, assume the control point
        //   is coincident with the current point.
        var p1;
        if (dc == 0 || ["Q", "T"].indexOf(dCommands[dc-1].code) == -1) {
          p1 = [cmd.x0, cmd.y0]
        } else {
          p1 = [_lastReflectionAbsCoord[0], _lastReflectionAbsCoord[1]]
        }
        var cBbox = quadraticBezierCurveBbox(
          [cmd.x0, cmd.y0],
          p1,
          [cmd.x, cmd.y],
          maxFloatingNumbers([
            cmd.x0, cmd.y0, p1[0], p1[1], cmd.x, cmd.y],
            minAccuracy, maxAccuracy));

        min[0] = Math.min(cBbox[0], min[0]);
        min[1] = Math.min(cBbox[1], min[1]);
        max[0] = Math.max(cBbox[2], max[0]);
        max[1] = Math.max(cBbox[3], max[1]);

        _lastReflectionAbsCoord = p1;
        break;
      case "A":
        var cBbox = ellipticalArcBbox(
          [cmd.x0, cmd.y0],
          cmd.rx,
          cmd.ry,
          cmd.xAxisRotation,
          cmd.largeArc,
          cmd.sweep,
          [cmd.x, cmd.y],
          maxFloatingNumbers([cmd.x0, cmd.y0, cmd.x, cmd.y],
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
}

module.exports = {
  // BBOX functions
  svgPathBbox: svgPathBbox,
  cubicBezierCurveBbox: cubicBezierCurveBbox,
  quadraticBezierCurveBbox: quadraticBezierCurveBbox,
  ellipticalArcBbox: ellipticalArcBbox,

  // Point on line functions
  lineXY: lineXY,
  cubicBezierXY: cubicBezierXY,
  quadraticBezierXY: quadraticBezierXY,
  ellipticalArcXY: ellipticalArcXY,

  // Utility functions
  toRadians: toRadians,
  angleBetween: angleBetween,
  maxFloatingNumbers: maxFloatingNumbers,
}
