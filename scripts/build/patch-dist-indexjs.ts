import * as fs from "node:fs";

fs.writeFileSync(
  "dist/index.js",
  fs
    .readFileSync("dist/index.js", "utf8")
    .replace(
      'exports.default = svgPathBbox;',
      'module.exports = svgPathBbox;'
    )
);
