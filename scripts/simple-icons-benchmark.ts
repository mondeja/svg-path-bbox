import * as icons from "simple-icons";
import type { SimpleIcon } from "simple-icons";

import runLibrariesBenchmark from "./benchmark";

const EPOCHS = [1000];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FILTER = (icon: SimpleIcon) => true;

if (require.main === module) {
  runLibrariesBenchmark(
    Object.values(icons)
      .filter(FILTER)
      .map((icon) => [icon.title, icon.path]),
    EPOCHS
  );
}
