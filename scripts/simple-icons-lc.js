'use strict';

const simpleIcons = require('simple-icons');

const {runLibrariesBenchmarkComparison} = require('./libraries-comparison.js');

const EPOCHS = [1000];

const main = function () {
  const paths = {};

  for (let iconSlug in simpleIcons) {
    let path = simpleIcons[iconSlug].path;
    paths[iconSlug] = path;
  }

  runLibrariesBenchmarkComparison(paths, EPOCHS);
};

if (require.main === module) {
  main();
}
