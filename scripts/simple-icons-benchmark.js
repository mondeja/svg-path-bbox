'use strict';

const simpleIcons = require('simple-icons');

const runLibrariesBenchmarkComparison = require('./benchmark.js');

const EPOCHS = [1000];

const main = function () {
  const paths = {};

  for (const iconName in simpleIcons) {
    const path = simpleIcons[iconName].path;
    paths[iconName] = path;
  }

  runLibrariesBenchmarkComparison(paths, EPOCHS);
};

if (require.main === module) {
  main();
}
