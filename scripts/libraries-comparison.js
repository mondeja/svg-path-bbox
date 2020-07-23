'use strict';

const {svgPathBbox} = require('./../src/index');
const svgPathBounds = require('svg-path-bounds');
const svgPathBoundingBox = require('svg-path-bounding-box');

const LIBARIES = {
  'svg-path-bbox': {
    func: svgPathBbox,
    result: undefined,
  },
  'svg-path-bounds': {
    func: svgPathBounds,
    result: undefined,
  },
  'svg-path-bounding-box': {
    func: svgPathBoundingBox,
    result: undefined,
    resultParser: function(result) {
      return [result.minX, result.minY, result.maxX, result.maxY];
    },
  }
};

const PATHS = {
  'ML': 'M0 0L10 10 20 0Z',
  'Mc': 'M100,250 c0,-150 300,-150 300,0',
  'MCL': 'M 10 20 C 50 -15 90 45 10 80 L 60 80',
}

const EPOCHS = [10000, 100000];

const main = function() {
  for (let pathType in PATHS) {
    for (let e=0; e<EPOCHS.length; e++) {
      let epochs = EPOCHS[e];
      console.log(`${PATHS[pathType]} (type ${pathType}) [${epochs} epochs]`);
      for (let library in LIBARIES) {
        let func = LIBARIES[library]['func'];
        console.time(library);
        let result;
        for (let r=0; r<epochs; r++) {
          result = func(PATHS[pathType]);
          if (LIBARIES[library]['resultParser']) {
            result = LIBARIES[library]['resultParser'](result);
          }
          if (LIBARIES[library]['result'] === undefined) {
            LIBARIES[library]['result'] = result;
          }
        }
        console.timeEnd(library);
        console.log(`  - result:`, result)
      }
      console.log();
    }
  }
}

if (require.main === module) {
  main();
};
