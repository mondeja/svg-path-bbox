import { getSimpleIconsSegmentsStats } from "./get-simple-icons-segments-stats";

const stats = getSimpleIconsSegmentsStats();
for (const [seg, occ] of stats) {
  process.stdout.write(`${seg}: ${occ}\n`);
}
