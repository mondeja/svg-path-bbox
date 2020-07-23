'use strict';

const simpleIcons = require('simple-icons');

const {runLibrariesBenchmarkComparison} = require('./libraries-comparison.js');

const EPOCHS = [1000];

const main = function () {
  const paths = {};

  for (const iconSlug in simpleIcons) {
    const path = simpleIcons[iconSlug].path;
    paths[iconSlug] = path;
  }

  runLibrariesBenchmarkComparison(paths, EPOCHS);
};

if (require.main === module) {
  main();
}
