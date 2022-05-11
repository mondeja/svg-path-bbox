import * as fs from "node:fs";
import * as path from "node:path";

import syscall from "./utils/syscall";
import type { SysCallOutput, SysCallArgs } from "./utils/syscall";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

const cliPath = path.resolve("src", "cli");

type CliCases = [SysCallArgs, number, string, string][];

const cliParameterCases: CliCases = [
  [['"M5 10c3 0 3 3 0 3z"'], 0, "5 10 7.25 13\n", ""],
  [['"M5 10c3 0 3 3 0 3z"', '"M2 8m5 5z"'], 0, "5 10 7.25 13\n2 8 7 13\n", ""],
  [
    [],
    1,
    "",
    "You must pass SVG paths enclosed between quotes as parameters.\n",
  ],
  [["--version"], 1, `^${packageJson.version}\n$`, ""],
  [["-v"], 1, `^${packageJson.version}\n$`, ""],
  [["--help"], 1, "", `^${packageJson.description}`],
  [["-h"], 1, "", `^${packageJson.description}`],
];

describe("svg-path-bbox", () => {
  test.each(cliParameterCases)(
    "svg-path-bbox %p [CODE: %p | STDOUT: %p | STDERR: %p]",
    async (args, code, stdout, stderr) => {
      args.unshift(cliPath);
      const proc = (await syscall(args)) as SysCallOutput;
      expect(proc.code).toBe(code);
      expect(new RegExp(stdout).test(proc.stdout)).toEqual(true);
      expect(new RegExp(stderr).test(proc.stderr)).toEqual(true);
    }
  );
});
