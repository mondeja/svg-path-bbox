import { inspect } from "node:util";
import process from "node:process";
import { svgPathBbox } from "../dist/es2015/index.mjs";

const bbox = svgPathBbox("M0 0H3V6Z");
process.stdout.write(`${inspect(bbox)}\n`)
