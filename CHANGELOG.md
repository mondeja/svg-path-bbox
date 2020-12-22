# CHANGELOG

## [Unreleased]

## [1.0.0] - ?
- [ ] Testing with 100% coverage.

## [0.2.0] - 2020-12-22
- Removed almost all public API functions (only keep `svgPathBbox` function).
- Removed `polf` dependency.
- Optimized quadratic Bézier curves minimum and maximum values computation.
- Optimized cubic Bézier curves minimum and maximum values computation.
- Optimized lineal segments minimum and maximum values computation.

## [0.1.5] - 2020-11-26
- Documentation improved.
- Switch CI to Github Actions.

## [0.1.4] - 2020-11-23
- Document and export `quadraticBezierCurveBbox` function.
- Remove development file from NPM package.
- Update acknowledgments.

## [0.1.1] - 2020-11-19
- Fix error computing bounding boxes for Q, T and some C commands.

## [0.0.47] - 2020-07-23
- Separate point on line functions in another package.
- Replaced svg-path-parser dependency with svgpath to optimize parsing time.
- Removed dregrees to radians converter function.
- Fix error in point on line function.
- Fix errors in utility functions.
- Add tests for utilities and command line client.

## [0.0.28] - 2020-05-22
- Update LICENSE.
- Fix error converting quaratic to Bézier coordinates.
- Add tests for some bounding boxes functions.

## [0.0.26] - 2020-05-21
- Removed `quadraticBezierCurveBbox` function.
- Optimized quadratic Bézier curve bounding box computation.
- Optimized cubic Bézier curve bounding box algorithm.
- Fixed error on V and H commands computing SVG path bbox.

## [0.0.20] - 2020-05-17
- Add function to obtain an array of numbers from SVG path.
- Multiple paths as arguments for command line script.

## [0.0.13] - 2020-05-17
- Add command line interface.
- Add linting.
- Released to NPM.
- Add documentation.
- Add changelog.
- Basic functionalities finished.
