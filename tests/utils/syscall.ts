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
    let hasExited = false;

    const maybeResolve = () => {
      if (hasExited && stdoutEnded && stderrEnded) {
        resolve({ code: exitCode ?? 1, stdout, stderr });
      }
    };

    child.on("error", (err) => {
      reject(err);
    });

    child.on("exit", (code: number | null) => {
      exitCode = code;
      hasExited = true;
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
