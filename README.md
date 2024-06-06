# 📦 svg-path-bbox

[![NPM version][npm-version-image]][npm-link]
[![License][license-image]][license-link]
[![NodeJS versions][npm-versions-image]][npm-link]

SVG paths bounding box calculator.

## Status

[![Tests][tests-image]][tests-link]
[![Coverage status][coverage-image]][coverage-link]

## Install

```sh
npm install svg-path-bbox
```

## Documentation

### Usage

```javascript
> import { svgPathBbox } from "svg-path-bbox";
> svgPathBbox("M5 10l2 3z")
[ 5, 10, 7, 13 ]
> svgPathBbox("M5 10c3 0 3 3 0 3z")
[ 5, 10, 7.25, 13 ]
```

Returned bounding box is an array made up like `viewBox` SVG attributes `[x0, y0, x1, y1]` of unrounded values:

<p align="center">
  <img width="256" height="256" src="https://raw.githubusercontent.com/mondeja/svg-path-bbox/master/svg-path-bbox.svg">
</p>

### Command line

```bash
$ svg-path-bbox "M5 10c3 0 3 3 0 3z"
5 10 7.25 13

$ svg-path-bbox "M5 10c3 0 3 3 0 3z" "M2 8m5 5z"
5 10 7.25 13
2 8 7 13
```

### Typescript usage

```typescript
import { svgPathBbox } from "svg-path-bbox";
import type { BBox } from "svg-path-bbox";

const cases: [string, BBox][] = [["M0 0H3V6Z", [0, 0, 3, 6]]];
console.log(svgPathBbox(cases[0]));
```

### Reference

<a name="svgPathBbox" href="#svgPathBbox">#</a> **svgPathBbox**(d : _string_) ⇒ [minX: _number_, minY: _number_, maxX: _number_, maxY: _number_]

Computes the bounding box of SVG path following the [SVG 1.1 specification](https://www.w3.org/TR/SVG/paths.html).

- **d** (_string_) SVG path.

## Thanks to

- [simple-icons/simple-icons](https://github.com/simple-icons/simple-icons) for reference dataset.
- [kpym/SVGPathy](https://github.com/kpym/SVGPathy) for reference implementation.
- [icons8/svg-path-bounding-box](https://github.com/icons8/svg-path-bounding-box) because [their bug](https://github.com/icons8/svg-path-bounding-box/issues/3) has been the source of this library.
- [mathandy/svgpathtools](https://github.com/mathandy/svgpathtools/) for reference implementation to compare with.

[npm-link]: https://www.npmjs.com/package/svg-path-bbox
[npm-version-image]: https://img.shields.io/npm/v/svg-path-bbox
[tests-image]: https://img.shields.io/github/actions/workflow/status/mondeja/svg-path-bbox/ci.yml?branch=master&logo=github&label=tests
[tests-link]: https://github.com/mondeja/svg-path-bbox/actions?query=workflow%3ATest
[coverage-image]: https://coveralls.io/repos/github/mondeja/svg-path-bbox/badge.svg?branch=master
[coverage-link]: https://coveralls.io/github/mondeja/svg-path-bbox?branch=master
[license-image]: https://img.shields.io/npm/l/svg-path-bbox?color=brightgreen
[license-link]: https://github.com/mondeja/svg-path-bbox/blob/master/LICENSE
[npm-versions-image]: https://img.shields.io/node/v/svg-path-bbox
