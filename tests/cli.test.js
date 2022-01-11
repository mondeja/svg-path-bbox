'use strict';

const path = require('path');
const {exec} = require('child_process');
const packageJson = require('../package.json');

const cli = args => new Promise((resolve) => {
  const child = exec(
    `node ${path.resolve(__dirname, '..', 'src', 'cli.js')}` +
    ` ${args.join(' ')}`
  );

  const stdoutChunks = [], stderrChunks = [];
  let stdout, stderr;
  child.on('exit', (code) => {
    resolve({code, stdout, stderr});
  });

  child.stdout.on('data', (data) => {
    stdoutChunks.push(data);
  });
  child.stdout.on('end', () => {
    stdout = stdoutChunks.join('');
  });

  child.stderr.on('data', (data) => {
    stderrChunks.push(data);
  });
  child.stderr.on('end', () => {
    stderr = stderrChunks.join('');
  });
});


const cliParameterCases = [
  [['"M5 10c3 0 3 3 0 3z"'], 0, '5 10 7.25 13\n', ''],
  [['"M5 10c3 0 3 3 0 3z"', '"M2 8m5 5z"'], 0, '5 10 7.25 13\n2 8 7 13\n', ''],
  [[], 1, '', 'You must pass SVG paths enclosed between quotes as parameters.\n'],
  [['--version'], 1, `^${packageJson.version}\n$`, ''],
  [['-v'], 1, `^${packageJson.version}\n$`, ''],
  [['--help'], 1, '', `^${packageJson.description}`],
  [['-h'], 1, '', `^${packageJson.description}`],
];

describe('svg-path-bbox', () => {
  test.each(cliParameterCases)(
    'svg-path-bbox %p [CODE: %p | STDOUT: %p | STDERR: %p]',
    async (parameters, code, stdout, stderr) => {
      const proc = await cli(parameters);
      expect(proc.code).toBe(code);
      expect(new RegExp(stdout).test(proc.stdout)).toEqual(true);
      expect(new RegExp(stderr).test(proc.stderr)).toEqual(true);
    }
  );
});
