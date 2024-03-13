import * as fs from "node:fs";
import cases from "../../lib/cases";
import { getSimpleIconsSegmentsStats } from "../simple-icons-segments-stats";

function buildIndexTs(indexTemplateTs: string): string {
  let indexTs = "";
  const [beforeCases, afterCases] = indexTemplateTs.split("/*cases*/");
  indexTs += beforeCases.replace(
    '"use strict";',
    '"use strict";\n\n// WARNING: This file is autogenerated, edit lib/index.template.ts'
  );
  indexTs +=
    "// The next cases are ordered based on simple-icons data\n        ";
  const siSegmentsStats = getSimpleIconsSegmentsStats().map(([seg]) => seg);
  for (const segment of siSegmentsStats) {
    const caseBranch = cases[segment as keyof typeof cases];
    indexTs += `case "${segment}": ${caseBranch}\n        `;
  }
  indexTs = indexTs.trimEnd();
  indexTs += afterCases;
  return indexTs;
}

if (require.main === module) {
  const indexTemplateTs = fs.readFileSync("lib/index.template.ts", "utf8");
  const indexTs = buildIndexTs(indexTemplateTs);
  fs.writeFileSync("src/index.ts", indexTs);
}
