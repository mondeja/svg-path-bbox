#!/usr/bin/env node
'use strict';

/* eslint no-process-exit: 0 */
/* eslint global-require: 0 */

if (require.main === module) {
  let sliceN = 1;
  if (process.argv.indexOf(module.filename) > -1 || require('path').basename(process.argv[1]) === 'svg-path-bbox') {
    sliceN = 2;
  }
  const args = process.argv.slice(sliceN, process.argv.length);

  if (args.length === 0) {
    console.error('You must pass SVG paths enclosed between quotes as parameters.');
    process.exit(1);
  }

  const {svgPathBbox} = require('./bbox');
  for (let a = 0; a < args.length; a++) {
    console.log(svgPathBbox(args[a]).join(' '));
  }
}
