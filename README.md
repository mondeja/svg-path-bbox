# svg-path-bbox

[![NPM version](https://img.shields.io/npm/v/svg-path-bbox)](https://www.npmjs.com/package/svg-path-bbox) [![Tests](https://img.shields.io/travis/mondeja/svg-path-bbox?label=tests)](https://travis-ci.com/github/mondeja/svg-path-bbox) [![Coverage Status](https://coveralls.io/repos/github/mondeja/svg-path-bbox/badge.svg?branch=master)](https://coveralls.io/github/mondeja/svg-path-bbox?branch=master) [![Dependencies](https://img.shields.io/librariesio/release/npm/svg-path-bbox)](https://libraries.io/npm/svg-path-bbox/tree) [![NPM license](https://img.shields.io/npm/l/svg-path-bbox?color=brightgreen)](https://github.com/mondeja/svg-path-bbox/blob/master/LICENSE) [![Node versions](https://img.shields.io/node/v/svg-path-bbox)](https://www.npmjs.com/package/svg-path-bbox)

Compute bounding box of SVG paths. Pure Javascript, only [svg-path-parser](https://github.com/hughsk/svg-path-parser) as dependency.

## Installation

```
npm install svg-path-bbox
```

## Quickstart

```javascript
> const { svgPathBbox } = require("svg-path-bbox")
> svgPathBbox("M5 10l2 3z")
[ 5, 10, 7, 13 ]
```

The bounding box returned is an array made up in the same way of `viewBox` SVG attributes: `[x0, x1, y0, y1]`.

If the path contains curves, the result is an approximation. You can control the precission needed calculating bounding box of curves using the optional parameters `minAccuracy` and `maxAccuracy`, but keep in mind that increasing these numbers will result in a slower execution:

```javascript
const d = "M5 10c3 0 3 3 0 3z";

> svgPathBbox(d) // accuracy is inferred by default
[ 5, 10, 7.25, 13 ]

> svgPathBbox(d, 2) // lower values might produce inaccurate results
[ 5, 10, 7.25, 12.999106 ]

> svgPathBbox(d, 3)
[ 5, 10, 7.249999999999999, 12.999991006 ]

> svgPathBbox(d, 4)
[ 5, 10, 7.249999999999999, 13 ]

> svgPathBbox(d, 5)
[ 5, 10, 7.25, 13 ]
```

> The number of epochs for curves and arcs bounding box calculations are `Math.pow(10, accuracy)`.

### Command line

```bash
$ svg-path-bbox "M5 10c3 0 3 3 0 3z"
5 10 7.25 13

$ svg-path-bbox "M5 10c3 0 3 3 0 3z" "M2 8m5 5z"
5 10 7.25 13
2 8 7 13
```

## Documentation

### Bounding box functions [▼](https://github.com/mondeja/svg-path-bbox#bounding-box-functions)
- [svgPathBbox](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#svgPathBbox)
- [cubicBezierCurveBbox](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#cubicBezierCurveBbox)
- [quadraticBezierCurveBbox](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#quadraticBezierCurveBbox)
- [ellipticalArcBbox](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#ellipticalArcBbox)

### Point on line functions [▼](https://github.com/mondeja/svg-path-bbox#point-on-line-functions)
- [lineXY](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#lineXY)
- [cubicBezierXY](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#cubicBezierXY)
- [quadraticBezierXY](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#quadraticBezierXY)
- [ellipticalArcXY](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#ellipticalArcXY)

### Utility functions [▼](https://github.com/mondeja/svg-path-bbox#utility-functions)
- [pathNumbers](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#pathNumbers)
- [toRadians](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#toRadians)
- [angleBetween](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#angleBetween)
- [maxFloatingNumbers](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#maxFloatingNumbers)

________________________________________________________________________________

### Bounding box functions

<a name="svgPathBbox" href="#svgPathBbox">#</a> <b>svgPathBbox</b>(<i>d</i>, <i>minAccuracy</i>, <i>maxAccuracy</i>) ⇒ `array`

Computes the bounding box of SVG path following the [SVG 2 specification](https://www.w3.org/TR/SVG/paths.html).

- **d** (string) SVG path. 
- **minAccuracy** (number) Minimum accuracy computing curves and arcs. By default is inferred using the maximum number of floating point numbers inside the coordinates of the arc or curve.
- **maxAccuracy** (number) Maximum accuracy computing curves and arcs. By default is inferred using the maximum number of floating point numbers inside the coordinates of the arc or curve.

<a name="cubicBezierCurveBbox" href="#cubicBezierCurveBbox">#</a> <b>cubicBezierCurveBbox</b>(<i>p0</i>, <i>p1</i>, <i>p2</i>, <i>p3</i>, <i>accuracy</i>) ⇒ `array`

Approximates the bounding box of a cubic Bézier curve defined as in the [SVG 2 specification](https://www.w3.org/TR/SVG2/paths.html#PathDataCubicBezierCommands).

- **p0** (array) Coordinate of the start point.
- **p1** (array) Coordinate of the first control point.
- **p2** (array) Coordinate of the second control point.
- **p3** (array) Coordinate of the end point.

<a name="ellipticalArcBbox" href="#ellipticalArcBbox">#</a> <b>ellipticalArcBbox</b>(<i>p0</i>, <i>rx</i>, <i>ry</i>, <i>xAxisRotation</i>, <i>largeArc</i>, <i>sweep</i>, <i>p1</i>, <i>accuracy</i>) ⇒ `array`

Approximates the bounding box of an elliptical arc defined as in the [SVG 2 specification](https://www.w3.org/TR/SVG2/paths.html#PathDataEllipticalArcCommands).

- **p0** (array) Coordinate of the start point.
- **rx** (number) X radius of the arc.
- **ry** (number) Y radius of the arc.
- **xAxisRotation** (number) Rotation in X of the arc in degrees.
- **largeArc** (boolean) `large-arc` flag that specifies how the arc is drawn.
- **sweep** (boolean) `sweep` flag that specifies how the arc is drawn.
- **p1** (array) Coordinate of the end point.
- **accuracy** (number) Power of ten for number of epochs used computing the result.

### Point on line functions

<a name="lineXY" href="#lineXY">#</a> <b>lineXY</b>(<i>p0</i>, <i>p1</i>, <i>t</i>) ⇒ `array`

Computes the coordinate of a point in a line parametrized in the range `t` from 0 to 1.

> Algorithm: `B(t) = p0 + (p1 - p0) * t , 0 <= t <= 1`

- **p0** (array) Coordinate of the start point.
- **p1** (array) Coordinate of the end point.
- **t** (number) Number in the range from 0 to 1 that parametrizes the location on the line.

<a name="cubicBezierXY" href="#cubicBezierXY">#</a> <b>cubicBezierXY</b>(<i>p0</i>, <i>p1</i>, <i>p2</i>, <i>p3</i>, <i>t</i>) ⇒ `array`

Computes the coordinate of a point in a cubic Bézier curve parametrized in the range `t` from 0 to 1.

> Algorithm: `B(t) = (1-t)^3 * p0 + 3*(1-t)^2 * t * p1 + 3*(1-t)^2 * p2 + t^3 * p3 , 0 <= t <= 1`

- **p0** (array) Coordinate of the start point.
- **p1** (array) Coordinate of the first control point.
- **p2** (array) Coordinate of the second control point.
- **p3** (array) Coordinate of the end point.
- **t** (number) Number in the range from 0 to 1 that parametrizes the location on the curve.

<a name="quadraticBezierXY" href="#quadraticBezierXY">#</a> <b>quadraticBezierXY</b>(<i>p0</i>, <i>p1</i>, <i>p2</i>, <i>t</i>) ⇒ `array`

Computes the coordinate of a point in a quadratic Bézier curve parametrized in the range `t` from 0 to 1. 

> Algorithm: `B(t) = (1-t)2 * p0 + 2*(1-t)*t *p1 + t2 * p2 , 0 <= t <= 1`

- **p0** (array) Coordinate of the start point.
- **p1** (array) Coordinate of the control point.
- **p2** (array) Coordinate of the end point.
- **t** (number) Number in the range from 0 to 1 that parametrizes the location on the curve.

<a name="ellipticalArcXY" href="#ellipticalArcXY">#</a> <b>ellipticalArcXY</b>(<i>p0</i>, <i>rx</i>, <i>ry</i>, <i>xAxisRotation</i>, <i>largeArc</i>, <i>sweep</i>, <i>p1</i>, <i>t</i>) ⇒ `array`

Computes the coordinate of a point in a elliptical arc parametrized in the range `t` from 0 to 1.

- **p0** (array) Coordinate of the start point.
- **rx** (number) X radius of the arc.
- **ry** (number) Y radius of the arc.
- **xAxisRotation** (number) Rotation in X of the arc in degrees.
- **largeArc** (boolean) `large-arc` flag that specifies how the arc is drawn.
- **sweep** (boolean) `sweep` flag that specifies how the arc is drawn.
- **p1** (array) Coordinate of the end point.
- **t** (number) Number in the range from 0 to 1 that parametrizes the location on the arc.

### Utility functions

> The next functions are used internally but are public to the API because can be useful along with this library.

<a name="pathNumbers" href="#pathNumbers">#</a> <b>pathNumbers</b>(<i>d</i>) ⇒ `array`

Extract all the numbers defined inside a SVG path.

- **d** (string) Path string.

<a name="toRadians" href="#toRadians">#</a> <b>toRadians</b>(<i>p0</i>, <i>p1</i>, <i>p2</i>, <i>t</i>) ⇒ `number`

Converts from degrees to radians. Don't checks if input value is in the range from 0 to 360.

> Algorithm: `degrees * PI / 180`

- **degrees** (number) Degrees to convert.

<a name="angleBetween" href="#angleBetween">#</a> <b>angleBetween</b>(<i>v0</i>, <i>v1</i>) ⇒ `number`

Computes the angle between two vectors.

- **v0** (array) First vector in comparison.
- **v1** (array) Second vector in comparison.

<a name="maxFloatingNumbers" href="#maxFloatingNumbers">#</a> <b>maxFloatingNumbers</b>(<i>numbers</i>, <i>min</i>, <i>max</i>) ⇒ `number`

Returns the maximum number of floating point numbers from an array of numbers. The result can be limited with `min` and `max` parameters.

- **numbers** (array) Array of numbers.
- **min** (number) - Minimum limit in response.
- **max** (number) - Maximum limit in response.

## Thanks to
- [hughsk/svg-path-parser](https://github.com/hughsk/svg-path-parser) for the awesome SVG path parser.
- [MadLittleMods/svg-curve-lib](https://github.com/MadLittleMods/svg-curve-lib) for elliptical arc point on line algorithm.
- [adobe-webplatform/Snap.svg](https://github.com/adobe-webplatform/Snap.svg) for cubic Bezier curve bounding box algorithm.
- [simple-icons/simple-icons](https://github.com/simple-icons/simple-icons) for reference dataset.
