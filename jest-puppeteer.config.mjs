import process from 'node:process';

const PORT = 8080;

export default {
  launch: {
    headless: process.env.TEST_HEADLESS !== "false",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  server: {
    command: `anywhere -s -p ${PORT} -d tests/browser`,
    port: PORT,
  },
};
