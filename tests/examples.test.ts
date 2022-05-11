import * as fs from "node:fs";
import * as path from "node:path";

import syscall from "./utils/syscall";
import type { SysCallOutput, SysCallProgram } from "./utils/syscall";

const examplesDirname = "examples";
const expectedOutput = "[ 0, 0, 3, 6 ]\n";

type ExamplesCases = [string, SysCallProgram][];

const examplesCases: ExamplesCases = fs
  .readdirSync(examplesDirname)
  .map((fname) => [fname, fname.endsWith(".ts") ? "ts-node" : "node"]);

describe("svg-path-bbox/examples", () => {
  test.each(examplesCases)("svg-path-bbox %p [%p]", async (fname, program) => {
    const proc = (await syscall(
      [path.resolve(examplesDirname, fname)],
      program
    )) as SysCallOutput;
    expect(proc.code).toBe(0);
    expect(proc.stdout).toEqual(expectedOutput);
    expect(proc.stderr).toEqual("");
  });
});
