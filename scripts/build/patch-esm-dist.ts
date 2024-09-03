import * as fs from "node:fs";

// .js -> .mjs
fs.renameSync(
  "dist/es2015/index.js",
  "dist/es2015/index.mjs"
);

// import * as SvgPath from "svgpath"; -> import SvgPath from "svgpath";
fs.writeFileSync(
  "dist/es2015/index.mjs",
  fs.readFileSync("dist/es2015/index.mjs", "utf-8").replace(
    'import * as SvgPath from "svgpath";',
    'import SvgPath from "svgpath";'
  )
);
