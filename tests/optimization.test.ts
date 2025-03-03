import * as fs from "node:fs";
import { getSimpleIconsSegmentsStats } from "../scripts/get-simple-icons-segments-stats";

test("Segments parsing order switch is optimized", () => {
  // We use simple-icons data to compute segment stats
  const indexTs = fs.readFileSync("src/index.ts", "utf8");
  const siSegmentsByOccurrence = getSimpleIconsSegmentsStats().map(
    ([seg]: [string, number]) => seg
  );

  const swithCasesSegmentByLines = indexTs
    .split("\n")
    .map((line) => {
      if (line.startsWith("        case ")) {
        return line.split('"')[1];
      }
      return null;
    })
    .filter((occ) => occ !== null);

  expect(siSegmentsByOccurrence).toStrictEqual(swithCasesSegmentByLines);
});
