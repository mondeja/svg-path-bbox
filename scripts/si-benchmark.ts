import * as icons from "simple-icons/icons";

import runLibrariesBenchmark from "./benchmark";

const EPOCHS = [1000];

if (require.main === module) {
  runLibrariesBenchmark(
    Object.values(icons).map((icon) => [icon.title, icon.path]),
    EPOCHS
  );
}
