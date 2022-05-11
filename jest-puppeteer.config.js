const path = require("path");

const PAGE_DIR = path.join("tests", "e2e");
const PORT = 8080;

module.exports = {
  launch: {
    headless: process.env.TEST_HEADLESS !== "false",
  },
  server: {
    command: `anywhere -s -p ${PORT} -d ${PAGE_DIR}`,
    port,
  },
};
