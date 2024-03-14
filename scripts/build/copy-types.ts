import * as fs from "node:fs";

fs.copyFileSync("src/types.d.ts", "dist/types.d.ts");
