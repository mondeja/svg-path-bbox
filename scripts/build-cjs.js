require("fs").writeFileSync(
  "dist/cjs.js",
  'module.exports = require("./index.js").default;'
);
