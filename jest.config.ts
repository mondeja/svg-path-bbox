export default {
  preset: "jest-puppeteer",
  transform: { "^.+\\.ts?$": "ts-jest" },
  collectCoverage: true,
  coverageDirectory: "<rootDir>/tests/coverage",
  collectCoverageFrom: ["src/*.ts"],
};
