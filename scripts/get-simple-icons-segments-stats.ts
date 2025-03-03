/**
 * Shows how many segments of each type are found in
 * simple-icons icons.
 */

import * as icons from "simple-icons";

export function getSimpleIconsSegmentsStats(): [string, number][] {
  const varNames = Object.keys(icons).slice(1);
  const segmentsStats = {
    M: 0,
    V: 0,
    H: 0,
    L: 0,
    C: 0,
    Q: 0,
  };
  for (const varName of varNames) {
    const icon = icons[varName as keyof typeof icons];
    for (const segment in segmentsStats) {
      segmentsStats[segment as keyof typeof segmentsStats] +=
        icon.path.split(segment).length;
    }
  };
  return Object.entries(segmentsStats).sort(([, a], [, b]) => b - a);
}

