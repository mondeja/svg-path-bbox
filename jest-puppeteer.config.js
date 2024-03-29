const path = require("path");

const PAGE_DIR = path.join("tests", "browser");
const PORT = 8080;

module.exports = {
  launch: {
    headless: process.env.TEST_HEADLESS !== "false",
  },
  server: {
    command: `anywhere -s -p ${PORT} -d ${PAGE_DIR}`,
    port: PORT,
  },
};
