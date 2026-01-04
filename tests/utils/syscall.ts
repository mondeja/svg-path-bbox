import { execFile } from "node:child_process";

export type SysCallArgs = string[];
export type SysCallOutput = { code: number; stdout: string; stderr: string };
export type SysCallProgram = "node" | "ts-node";

export default (args: SysCallArgs, program: SysCallProgram = "node") =>
  new Promise((resolve, reject) => {
    const child = execFile(program, args);

    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];
    let stdout = "";
    let stderr = "";
    let exitCode: number | null = null;
    let stdoutEnded = false;
    let stderrEnded = false;

    const maybeResolve = () => {
      if (exitCode !== null && stdoutEnded && stderrEnded) {
        resolve({ code: exitCode, stdout, stderr });
      }
    };

    child.on("exit", (code: number) => {
      exitCode = code;
      maybeResolve();
    });

    if (child.stdout === null) {
      return reject("'stdout' object of ChildProcess is null");
    }
    child.stdout.on("data", (data: string) => {
      stdoutChunks.push(data);
    });
    child.stdout.on("end", () => {
      stdout = stdoutChunks.join("");
      stdoutEnded = true;
      maybeResolve();
    });

    if (child.stderr === null) {
      return reject("'stderr' object of ChildProcess is null");
    }
    child.stderr.on("data", (data: string) => {
      stderrChunks.push(data);
    });
    child.stderr.on("end", () => {
      stderr = stderrChunks.join("");
      stderrEnded = true;
      maybeResolve();
    });
  });
