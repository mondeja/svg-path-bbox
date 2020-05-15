"use strict"

const {parseSVG, makeAbsolute} = require('svg-path-parser');

// Cubic bezier algorithm
// B(t) = (1-t)**3 * p0 + 3*(1-t)**2 * t * p1 + 3*(1-t)**2 * p2 + t**3 * p3 , 0 <= t <= 1 
function getBezierXY(t, p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
  return [
    Math.pow(1-t,3) * p0x + 3 * t * Math.pow(1 - t, 2) * p1x 
      + 3 * t * t * (1 - t) * p2x + t * t * t * p3x,
    Math.pow(1-t,3) * p0y + 3 * t * Math.pow(1 - t, 2) * p1y 
      + 3 * t * t * (1 - t) * p2y + t * t * t * p3y
  ];
}

var cubicBezierCurveBbox = function(p0, p1, p2, p3, accuracy) {
  var min = [Infinity, Infinity],
      max = [-Infinity, -Infinity];
  
  for (var t=0; t<=1; t+=1/10**accuracy) {
    var xy = getBezierXY(
      t, p0[0], p0[1], p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
    min[0] = Math.min(min[0], xy[0]);
    min[1] = Math.min(min[1], xy[1]);
    max[0] = Math.max(max[0], xy[0]);
    max[1] = Math.max(max[1], xy[1]);
  }
  
  return [min[0], min[1], max[0], max[1]]
}

function getQuadraticXY(t, p0x, p0y, p1x, p1y, p2x, p2y) {
  return [
    (1-t) * (1-t) * p0x + 2 * (1-t) * t * p1x + t * t * p2x,
    (1-t) * (1-t) * p0y + 2 * (1-t) * t * p1y + t * t * p2y
  ]
}

var quadraticBezierCurveBbox = function(p0, p1, p2, accuracy) {
  var min = [Infinity, Infinity],
      max = [-Infinity, -Infinity];
  
  for (var t=0; t<=1; t+=1/10**accuracy) {
    var xy = getQuadraticXY(
      t, p0[0], p0[1], p1[0], p1[1], p2[0], p2[1]);
    min[0] = Math.min(min[0], xy[0]);
    min[1] = Math.min(min[1], xy[1]);
    max[0] = Math.max(max[0], xy[0]);
    max[1] = Math.max(max[1], xy[1]);
  }
  
  return [min[0], min[1], max[0], max[1]]
}

var _getMaxFloatingNumbers = function(array, min, max) {
  if (!min && min != 0) {
    min = 0;
  }
  if (!max && max != 0) {
    max = 3;
  }
  var response = min;
  for (let n=0; n<array.length; n++) {
    var _numberDigits = parseFloat(array[n]).toString().replace(
      /\d+\./, '').length;
    response = Math.min(max, Math.max(response, _numberDigits)); 
  }
  return response;
}

var toRadians = function(angle) {
	return angle * (Math.PI / 180);
}

var pointOnLine = function(p0x, p0y, p1x, p1y, t) {
	function calculateLineParameter(x0, x1, t) {
		var result = x0 + (x1-x0)*t;
		
		return result;
	}
	
	return [
    calculateLineParameter(p0x, p1x, t),
    calculateLineParameter(p0y, p1y, t)
  ];
};

var angleBetween = function(v0x, v0y, v1x, v1y) {
		var p = v0x*v1x + v0y*v1y;
		var n = Math.sqrt((Math.pow(v0x, 2)+Math.pow(v0y, 2)) * (Math.pow(v1x, 2)+Math.pow(v1y, 2)));
		var sign = v0x*v1y - v0y*v1x < 0 ? -1 : 1;
		var angle = sign*Math.acos(p/n);
		//var angle = Math.atan2(v0y, v0x) - Math.atan2(v1y,  v1x);
		return angle;
	}

// https://github.com/MadLittleMods/svg-curve-lib
var pointOnEllipticalArc = function(t, p0x, p0y, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, p1x, p1y) {
	// In accordance to: http://www.w3.org/TR/SVG/implnote.html#ArcOutOfRangeParameters
	rx = Math.abs(rx);
	ry = Math.abs(ry);
	xAxisRotation = (xAxisRotation%360 + 360)%360;
	var xAxisRotationRadians = toRadians(xAxisRotation);
	// If the endpoints are identical, then this is equivalent to omitting the elliptical arc segment entirely.
	if (p0x === p1x && p0x === p1y) {
		return [p0x, p0y];
	}
	
	// If rx = 0 or ry = 0 then this arc is treated as a straight line segment joining the endpoints.    
	if(rx === 0 || ry === 0) {
		return pointOnLine(p0, p1, t);
	}

	
	// Following "Conversion from endpoint to center parameterization"
	// http://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
	
	// Step #1: Compute transformedPoint
	var dx = (p0x-p1x)/2;
	var dy = (p0y-p1y)/2;
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
	var cCoef = (largeArcFlag !== sweepFlag ? 1 : -1) * Math.sqrt(cRadicand);
	var transformedCenter = [
		cCoef*((rx*transformedPoint[1])/ry),
		cCoef*(-(ry*transformedPoint[0])/rx)
	];

	// Step #3: Compute center
	var center = [
		Math.cos(xAxisRotationRadians)*transformedCenter[0] - Math.sin(xAxisRotationRadians)*transformedCenter[1] + ((p0x+p1x)/2),
		Math.sin(xAxisRotationRadians)*transformedCenter[0] + Math.cos(xAxisRotationRadians)*transformedCenter[1] + ((p0y+p1y)/2)
	];

	
	// Step #4: Compute start/sweep angles
	// Start angle of the elliptical arc prior to the stretch and rotate operations.
	// Difference between the start and end angles
	var startVector = [
    (transformedPoint[0]-transformedCenter[0])/rx,
    (transformedPoint[1]-transformedCenter[1])/ry,
  ]
	var startAngle = angleBetween(1, 0, startVector[0], startVector[1]);
	
	var endVector = [
    (-transformedPoint[0]-transformedCenter[0])/rx,
    (-transformedPoint[1]-transformedCenter[1])/ry,
  ]
	var sweepAngle = angleBetween(
    startVector[0], startVector[1], endVector[0], endVector[1]);
	
	if(!sweepFlag && sweepAngle > 0) {
		sweepAngle -= 2*Math.PI;
	}
	else if(sweepFlag && sweepAngle < 0) {
		sweepAngle += 2*Math.PI;
	}
	// We use % instead of `mod(..)` because we want it to be -360deg to 360deg(but actually in radians)
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

var ellipticalArcBbox = function(p0x, p0y, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, p1x, p1y, accuracy) {
  var min = [Infinity, Infinity],
      max = [-Infinity, -Infinity];
  
  for (var t=0; t<=1; t+=1/10**accuracy) {
    var xy = pointOnEllipticalArc(
      t, p0x, p0y, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, p1x, p1y);
    min[0] = Math.min(min[0], xy[0]);
    min[1] = Math.min(min[1], xy[1]);
    max[0] = Math.max(max[0], xy[0]);
    max[1] = Math.max(max[1], xy[1]);
  }
  return [min[0], min[1], max[0], max[1]]
}

const getSvgPathBbox = function(d) {
  var min = [Infinity, Infinity],
      max = [-Infinity, -Infinity];
      
  var dCommands = makeAbsolute(parseSVG(d));
  
  // Previous reflection absolute coordinate (2º point of control
  //   of the last cubic bezier curve). Necessary to calculate the
  //   first point of control of S commands.
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
          _getMaxFloatingNumbers([cmd.x0, cmd.y0, cmd.x1, cmd.y1,
                                  cmd.x2, cmd.y2, cmd.x, cmd.y]));
          
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
          p0, p1, p2, p3, _getMaxFloatingNumbers(
            [p0[0], p0[1], p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]]));
            
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
          _getMaxFloatingNumbers([
            cmd.x0, cmd.y0, cmd.x1, cmd.y1, cmd.x, cmd.y]));
        
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
          _getMaxFloatingNumbers([
            cmd.x0, cmd.y0, p1[0], p1[1], cmd.x, cmd.y]));
            
        min[0] = Math.min(cBbox[0], min[0]);
        min[1] = Math.min(cBbox[1], min[1]);
        max[0] = Math.max(cBbox[2], max[0]);
        max[1] = Math.max(cBbox[3], max[1]);
            
        _lastReflectionAbsCoord = p1;
        break;
      case "A":
        var cBbox = ellipticalArcBbox(
          cmd.x0,
          cmd.y0,
          cmd.rx,
          cmd.ry,
          cmd.xAxisRotation,
          cmd.largeArc,
          cmd.sweep,
          cmd.x,
          cmd.y,
          _getMaxFloatingNumbers([cmd.x0, cmd.y0, cmd.x, cmd.y]));
        
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

/*
const fs = require("fs")
const path = require("path")

fs.readdir("../simple-icons/icons", (err, files) => {
  files.forEach(file => {
    if (file.indexOf(".svg") > -1) {
      let filepath = path.join("../simple-icons/icons", file);
      console.log()
      console.log(filepath)
      const data = fs.readFileSync(filepath, "utf-8");
      const d = data.match(/<path\s+d="([^"]*)/)[1];
      
      console.log(getSvgPathBbox(d))
    }
  });
});
*/


