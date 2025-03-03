import { inspect } from "node:util";

import { svgPathBbox } from "../src";
import svgPathBoundingBox from "svg-path-bounding-box";
import type { BBox } from "../src";
import type { BoundingBoxView } from "svg-path-bounding-box";

type LibraryAdapter = {
  func: typeof svgPathBbox | typeof svgPathBoundingBox;
  resultParser?: (result: BoundingBoxView) => BBox;
};

const LIBRARIES: {
  [key: string]: LibraryAdapter;
} = {
  "svg-path-bbox": {
    func: svgPathBbox,
  },
  "svg-path-bounding-box": {
    func: svgPathBoundingBox,
    resultParser(result) {
      return [result.minX, result.minY, result.maxX, result.maxY];
    },
  },
};

const PATHS = [
  "M0 0L10 10 20 0Z",
  "M100,250 c0,-150 300,-150 300,0",
  "M 10 20 C 50 -15 90 45 10 80 L 60 80",
];

const EPOCHS = [10000, 100000];

const runLibrariesBenchmark = (
  paths: [string | null, string][],
  epochs: number[]
) => {
  for (const [key, path] of paths) {
    for (const e of epochs) {
      let pathType = path.replace(/[0-9\-.\s,]/g, "");
      pathType =
        pathType.length > 25 ? `${pathType.substring(0, 25)}...` : pathType;
      const pathSummary =
        path.length > 25 ? `${path.substring(0, 25)}...` : path;

      if (key) {
        process.stdout.write(`${key} - `);
      }

      process.stdout.write(`${pathSummary} (type ${pathType}) [${e} epochs]\n`);
      for (const library in LIBRARIES) {
        console.time(library);
        const func = LIBRARIES[library]["func"];
        let _errorRaised = false,
          result;
        for (let r = 0; r < e; r++) {
          try {
            result = func(path);
          } catch (err) {
            if (!_errorRaised) {
              process.stderr.write(
                `Error computing bbox with library ${library}:\n`
              );
              process.stderr.write(`${err}\n`);
            }
            _errorRaised = true;
          }
        }
        process.stdout.write("  ");
        console.timeEnd(library);

        const resultParser = LIBRARIES[library].resultParser;
        if (resultParser !== undefined) {
          result = resultParser(result as BoundingBoxView);
        }
        if (result) {
          process.stdout.write(
            `    + result: ${inspect(result, { colors: true })}\n`
          );
        }
      }
      process.stdout.write("\n");
    }
  }
};

export default runLibrariesBenchmark;

if (require.main === module) {
  runLibrariesBenchmark(
    PATHS.map((path) => [null, path]),
    EPOCHS
  );
}
