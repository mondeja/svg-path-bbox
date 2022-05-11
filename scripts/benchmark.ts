import svgPathBbox from "../src";
import * as svgPathBoundingBox from "svg-path-bounding-box";
import type { BBox } from "../src";
import type { BoundingBoxView } from "svg-path-bounding-box";

type LibraryAdapter = {
  func: typeof svgPathBbox | typeof svgPathBoundingBox;
  resultParser?: (result: BoundingBoxView) => BBox;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const LIBRARIES: {
  [key: string]: LibraryAdapter;
} = {
  "svg-path-bbox": {
    func: svgPathBbox,
  },
  "svg-path-bounding-box": {
    func: svgPathBoundingBox,
    resultParser(result: BoundingBoxView) {
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

      console.log(`${pathSummary} (type ${pathType}) [${e} epochs]`);
      for (const library in LIBRARIES) {
        console.time(library);
        const func = LIBRARIES[library]["func"];
        let _errorRaised = false,
          result;
        for (let r = 0; r < e; r++) {
          try {
            result = func(path);
          } catch (Error) {
            if (!_errorRaised) {
              console.error(`Error computing bbox with library ${library}:`);
              console.error(Error);
            }
            _errorRaised = true;
          }
        }
        process.stdout.write("  ");
        console.timeEnd(library);

        const resultParser = LIBRARIES[library].resultParser;
        if (resultParser !== undefined) {
          result = resultParser(result);
        }
        if (result) {
          console.log("    + result:", result);
        }
      }
      console.log();
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
