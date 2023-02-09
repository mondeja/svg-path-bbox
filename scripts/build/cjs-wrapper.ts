import * as fs from "node:fs";

if (require.main === module) {
  fs.writeFileSync(
    "dist/wrapper.js",
    'module.exports = require("./index.js").default;'
  );
}
