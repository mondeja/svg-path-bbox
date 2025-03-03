import icons from "simple-icons";
import type { SimpleIcon } from "simple-icons";

import runLibrariesBenchmark from "./benchmark";

const EPOCHS = [5000];
const MAX_ICONS = 5;
const FILTER = (icon: SimpleIcon | undefined) => icon !== undefined;

const titlePaths: [string, string][] = [];
for (const icon of Object.values(icons)) {
  if (!FILTER(icon)) {
    continue;
  }
  titlePaths.push([icon.title, icon.path]);
  if (titlePaths.length >= MAX_ICONS) {
    break;
  }
}

runLibrariesBenchmark(titlePaths, EPOCHS);

