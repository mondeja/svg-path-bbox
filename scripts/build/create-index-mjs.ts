import * as fs from "node:fs";

fs.writeFileSync(
  "dist/index.mjs",
  `import svgPathBbox from "./index.js";
export default svgPathBbox;
`
);
