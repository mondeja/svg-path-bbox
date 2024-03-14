import { inspect } from "node:util";
import svgPathBbox from "../dist/index.mjs";

const bbox = svgPathBbox("M0 0H3V6Z");
process.stdout.write(`${inspect(bbox)}\n`)
