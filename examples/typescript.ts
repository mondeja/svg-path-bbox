import { inspect } from "node:util";
import svgPathBbox from "../src";
import type { BBox } from "../src";

const cases: [string, BBox][] = [["M0 0H3V6Z", [0, 0, 3, 6]]];

for (const [path, expectedBbox] of cases) {
  const bbox = svgPathBbox(path);
  if (JSON.stringify(bbox) !== JSON.stringify(expectedBbox)) {
    process.stderr.write(`UNEXPECTED BBOX: ${inspect(bbox)}\n`);
    process.exit(1);
  } else {
    process.stdout.write(`${inspect(bbox)}\n`);
  }
}
