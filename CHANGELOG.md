# CHANGELOG

## [2.0.0] - 2024-06-06

- No more default export. Now you have to import `svgPathBbox` function
  directly. Use `import { svgPathBbox } from "svg-path-bbox";` instead of
  `import svgPathBbox from "svg-path-bbox";`.

## [1.2.6] - 2024-03-14

- Support types without enabling `esModuleInterop` in TypeScript.

## [1.2.5] - 2024-03-13

- Fixed error computing some quadratic Bézier curves cases.

## [1.2.4] - 2023-02-09

- Optimized proccesing of segments based on [Simple Icons] data.

[Simple Icons]: https://github.com/simple-icons/simple-icons

## [1.2.3] - 2022-12-23

- Fixed CLI not being executed in some versions of Node.js < v16.

## [1.2.2] - 2022-05-26

- Fixed edge case computing cubic Bézier curves bounding boxes.

## [1.2.1] - 2022-05-12

- Fixed error computing cubic Bézier curves bounding boxes.

## [1.2.0] - 2022-05-07

- Use default export for better interoperability.

## [1.1.0] - 2022-05-05

- Add support for Typescript.

## [1.0.2] - 2022-01-11

- Add basic options `--version` and `--help` to CLI.

## [1.0.1] - 2021-06-21

- Fixed error computing limits for cubic Bèzier curves of length 0.

## [1.0.0] - 2021-06-03

- Testing with 100% coverage.
- Make `svgPathBbox` function the default export.

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

[Unreleased]: https://github.com/mondeja/svg-path-bbox/compare/v1.2.6...HEAD
[1.2.6]: https://github.com/mondeja/svg-path-bbox/compare/v1.2.5...v1.2.6
[1.2.5]: https://github.com/mondeja/svg-path-bbox/compare/v1.2.4...v1.2.5
[1.2.4]: https://github.com/mondeja/svg-path-bbox/compare/v1.2.3...v1.2.4
[1.2.3]: https://github.com/mondeja/svg-path-bbox/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/mondeja/svg-path-bbox/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/mondeja/svg-path-bbox/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/mondeja/svg-path-bbox/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/mondeja/svg-path-bbox/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/mondeja/svg-path-bbox/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/mondeja/svg-path-bbox/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/mondeja/svg-path-bbox/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/mondeja/svg-path-bbox/compare/v0.1.5...v0.2.0
[0.1.5]: https://github.com/mondeja/svg-path-bbox/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/mondeja/svg-path-bbox/compare/v0.1.1...v0.1.4
[0.1.1]: https://github.com/mondeja/svg-path-bbox/compare/v0.0.47...v0.1.1
[0.0.47]: https://github.com/mondeja/svg-path-bbox/compare/v0.0.28...v0.0.47
[0.0.28]: https://github.com/mondeja/svg-path-bbox/compare/v0.0.26...v0.0.28
[0.0.26]: https://github.com/mondeja/svg-path-bbox/compare/v0.0.20...v0.0.26
[0.0.20]: https://github.com/mondeja/svg-path-bbox/compare/v0.0.13...v0.0.20
[0.0.13]: https://github.com/mondeja/svg-path-bbox/releases/tag/v0.0.13
