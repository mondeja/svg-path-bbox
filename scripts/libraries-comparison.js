'use strict';

const {svgPathBbox} = require('./../src/index');
const svgPathBounds = require('svg-path-bounds');
const svgPathBoundingBox = require('svg-path-bounding-box');

const LIBARIES = {
  'svg-path-bbox': {
    func: svgPathBbox,
  },
  'svg-path-bounds': {
    func: svgPathBounds,
  },
  'svg-path-bounding-box': {
    func: svgPathBoundingBox,
    resultParser(result) {
      return [result.minX, result.minY, result.maxX, result.maxY];
    },
  }
};

const PATHS = [
  'M0 0L10 10 20 0Z',
  'M100,250 c0,-150 300,-150 300,0',
  'M 10 20 C 50 -15 90 45 10 80 L 60 80',
];

const EPOCHS = [10000, 100000];

const runLibrariesBenchmarkComparison = function (paths, epochs) {
  for (let p = 0; p < paths.length; p++) {
    for (let e = 0; e < epochs.length; e++) {
      const path = paths[p];
      const pathType = path.replace(/[0-9\-.\s,]/g, '');
      const pathSub = path.length > 25 ?
        `${path.substring(0, 25)}...` : path;

      console.log(`${pathSub} (type ${pathType}) [${epochs[e]} epochs]`);
      for (const library in LIBARIES) {
        const func = LIBARIES[library]['func'];
        console.time(library);
        let result;
        try {
          result = func(path);
        } catch (Error) {
          console.error(`Error computing bbox with library ${library}:`);
          console.error(Error);
        }

        if (LIBARIES[library]['resultParser']) {
          result = LIBARIES[library]['resultParser'](result);
        }
        console.timeEnd(library);
        console.log('  - result:', result);
      }
      console.log();
    }
  }
};

const main = function () {
  runLibrariesBenchmarkComparison(PATHS, EPOCHS);
};

if (require.main === module) {
  main();
} else {
  module.exports = {runLibrariesBenchmarkComparison};
}
