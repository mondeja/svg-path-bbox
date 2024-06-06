#!/usr/bin/env node
"use strict";

/* eslint no-process-exit: 0 */
/* eslint global-require: 0 */

function help() {
  const packageJson = require("../package.json");

  return `${packageJson.description}
  Output is redirected to STDOUT.

Usage:
  ${packageJson.name} [-h] [-v] [path [path ...]]

Options:
  -h, --help     Display this help text and exit.
  -v, --version  Show this program version number (${packageJson.version}).`;
}

if (require.main === module) {
  let sliceN = 1;
  if (
    process.argv.indexOf(module.filename) > -1 ||
    require("path").basename(process.argv[1]) === "svg-path-bbox" ||
    process.argv.indexOf(module.filename.slice(0, -3)) > -1 // rstrip '.js'
  ) {
    sliceN = 2;
  }
  const args = process.argv.slice(sliceN, process.argv.length);

  if (args.length === 0) {
    console.error(
      "You must pass SVG paths enclosed between quotes as parameters."
    );
    process.exit(1);
  } else if (args.includes("--version") || args.includes("-v")) {
    console.log(require("../package.json").version);
    process.exit(1);
  } else if (args.includes("--help") || args.includes("-h")) {
    console.error(help());
    process.exit(1);
  }

  const { svgPathBbox } = require("../dist/index.js");
  for (let a = 0; a < args.length; a++) {
    console.log(svgPathBbox(args[a]).join(" "));
  }
}
