'use strict';

const path = require('path');
const exec = require('child_process').exec;

const cli = (args, cwd) => new Promise((resolve) => {
  exec(`node ${path.resolve(path.join('src', 'cli.js'))} ${args.join(' ')}`,
    {cwd},
    (error, stdout, stderr) => {
      resolve({
        code: error && error.code ? error.code : 0,
        error,
        stdout,
        stderr
      });
    }
  );
});


const cliParameterCases = [
  [['"M5 10c3 0 3 3 0 3z"'], 0, '5 10 7.25 13\n', null],
  [['"M5 10c3 0 3 3 0 3z"', '"M2 8m5 5z"'], 0, '5 10 7.25 13\n2 8 7 13\n', null],
  [[], 1, null, 'You must pass SVG paths enclosed between quotes as parameters.\n'],
];

describe('svg-path-bbox', () => {
  test.each(cliParameterCases)(
    'svg-path-bbox %p [STDOUT: %p | STDERR: %p]',
    (parameters, code, stdout, stderr) => {
      cli(parameters, '.').then((proc) => {
        expect(proc.code).toBe(code);
        if (stdout !== null) {
          expect(proc.stdout).toEqual(stdout);
        }
        if (stderr !== null) {
          expect(proc.stderr).toEqual(stderr);
        }
      });
    }
  );
});
