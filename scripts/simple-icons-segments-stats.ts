/**
 * Shows how many segments of each type are found in
 * simple-icons icons.
 */

import * as icons from "simple-icons/icons";

export function getSimpleIconsSegmentsStats() {
  const segmentsStats = {
    M: 0,
    V: 0,
    H: 0,
    L: 0,
    C: 0,
    Q: 0,
  };
  Object.values(icons).map((icon) => {
    for (const segment in segmentsStats) {
      segmentsStats[segment as keyof typeof segmentsStats] +=
        icon.path.split(segment).length - 0;
    }
  });
  return Object.entries(segmentsStats).sort(([, a], [, b]) => b - a);
}

if (require.main === module) {
  const stats = getSimpleIconsSegmentsStats();
  for (const [seg, occ] of stats) {
    process.stdout.write(`${seg}: ${occ}\n`);
  }
}
