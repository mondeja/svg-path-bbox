// from root folder: `ts-node examples/typescript.ts`

import svgPathBbox from "../src";
import type { BBox } from "../src/BBox";

type CasesTuple = Array<[string, BBox]>;

const cases: CasesTuple = [["M0 0H3V6Z", [0, 0, 3, 6]]];

for (const [path, expectedBbox] of cases) {
  const result = svgPathBbox(path);
  const stringResult = JSON.stringify(result);
  if (stringResult !== JSON.stringify(expectedBbox)) {
    console.error(`UNEXPECTED BBOX: ${result}`);
    process.exit(1);
  } else {
    console.log(result);
  }
}
