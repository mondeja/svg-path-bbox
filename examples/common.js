const util = require("util")
const svgPathBbox = require("../dist/wrapper.js");

const bbox = svgPathBbox("M0 0H3V6Z");
process.stdout.write(`${util.inspect(bbox)}\n`)
