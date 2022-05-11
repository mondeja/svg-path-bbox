import * as fs from "node:fs";

fs.writeFileSync(
  "dist/wrapper.js",
  'module.exports = require("./index.js").default;'
);
