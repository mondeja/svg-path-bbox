import { exec } from "node:child_process";

export type SysCallArgs = string[];
export type SysCallOutput = { code: number; stdout: string; stderr: string };
export type SysCallProgram = "node" | "ts-node";

export default (args: SysCallArgs, program: SysCallProgram = "node") =>
  new Promise((resolve, reject) => {
    const child = exec(`${program} ${args.join(" ")}`);

    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];
    let stdout: string;
    let stderr: string;
    child.on("exit", (code: number) => {
      resolve({ code, stdout, stderr });
    });

    if (child.stdout === null) {
      return reject("'stdout' object of ChildProcess is null");
    }
    child.stdout.on("data", (data: string) => {
      stdoutChunks.push(data);
    });
    child.stdout.on("end", () => {
      stdout = stdoutChunks.join("");
    });

    if (child.stderr === null) {
      return reject("'stdout' object of ChildProcess is null");
    }
    child.stderr.on("data", (data: string) => {
      stderrChunks.push(data);
    });
    child.stderr.on("end", () => {
      stderr = stderrChunks.join("");
    });
  });
