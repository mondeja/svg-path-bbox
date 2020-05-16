# svg-path-bbox

## THIS IS A WORK IN PROGRESS

Compute bounding box of SVG paths. Pure Javascript, only one dependency.

## Quickstart

```javascript
> const { svgPathBbox } = require("svg-path-bbox")
> svgPathBbox("M5 10l2 3z")
[ 5, 10, 7, 13 ]
```

The bounding box returned is made up in the same way of `viewBox` SVG attributes: `[x0, y0, x1, y1]`.

If the path contains curves, is an approximation. You can control the precission needed calculating bounding box of curves using the parameters `minAccuracy` and `maxAccuracy`, but keep in mind that increasing these numbers will result in a slower execution:

```javascript
const d = "M5 10c3 0 3 3 0 3z";

> svgPathBbox(d) // accuracy is inferred by default
[ 5, 10, 7.25, 13 ]

> svgPathBbox(d, 2) // lower values can produce inaccurate results
[ 5, 10, 7.25, 12.999106 ]

> svgPathBbox(d, 3)
[ 5, 10, 7.249999999999999, 12.999991006 ]

> svgPathBbox(d, 4)
[ 5, 10, 7.249999999999999, 13 ]

> svgPathBbox(d, 5)
[ 5, 10, 7.25, 13 ]
```

> The number of epochs for curves and arcs bounding box calculations are `Math.pow(10, accuracy)`. [See documentation](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#svgPathBbox) for more.

## Documentation

- [svgPathBbox](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#svgPathBbox)
- [cubicBezierCurveBbox](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#cubicBezierCurveBbox)
- [quadraticBezierCurveBbox](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#quadraticBezierCurveBbox)
- [ellipticalArcBbox](https://github.com/mondeja/svg-path-bbox/blob/master/README.md#ellipticalArcBbox)

________________________________________________________________________________

<a name="svgPathBbox" href="#svgPathBbox">#</a> <b>svgPathBbox</b>(<i>d</i>, <i>minAccuracy</i>, <i>maxAccuracy</i>)

Computes the bounding box of SVG path following the [SVG 2 specification](https://www.w3.org/TR/SVG/paths.html).

- **d** (`string`) SVG path. 
- **minAccuracy** (`number`) Minimum accuracy computing curves and arcs. By default is inferred using the number of floating point numbers inside the points of the arc or curve.
- **minAccuracy** (`number`) Maximum accuracy computing curves and arcs. By default is inferred using the number of floating point numbers inside the points of the arc or curve.

<a name="cubicBezierCurveBbox" href="#cubicBezierCurveBbox">#</a> <b>cubicBezierCurveBbox</b>(<i>p0</i>, <i>p1</i>, <i>p2</i>, <i>p3</i>, <i>accuracy</i>)

Approximates the bounding box of a cubic Bezier curve defined as in the [SVG 2 specification](https://www.w3.org/TR/SVG2/paths.html#PathDataCubicBezierCommands).

- **p0** (array) Coordinate of the start point.
- **p1** (array) Coordinate of the first control point.
- **p2** (array) Coordinate of the second control point.
- **p3** (array) Coordinate of the end point.
- **accuracy** (number) Power of ten for number of epochs used computing the result.

<a name="quadraticBezierCurveBbox" href="#quadraticBezierCurveBbox">#</a> <b>quadraticBezierCurveBbox</b>(<i>p0</i>, <i>p1</i>, <i>p2</i>, <i>accuracy</i>)

Approximates the bounding box of a quadratic Bezier curve defined as in the [SVG 2 specification](https://www.w3.org/TR/SVG2/paths.html#PathDataQuadraticBezierCommands).

- **p0** (array) Coordinate of the start point.
- **p1** (array) Coordinate of the control point.
- **p2** (array) Coordinate of the end point.
- **accuracy** (number) Power of ten for number of epochs used computing the result.

<a name="ellipticalArcBbox" href="#ellipticalArcBbox">#</a> <b>ellipticalArcBbox</b>(<i>p0</i>, <i>rx</i>, <i>ry</i>, <i>xAxisRotation</i>, <i>largeArc</i>, <i>sweep</i>, <i>p1</i>, <i>accuracy</i>)
