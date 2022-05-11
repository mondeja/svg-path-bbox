const e2e = process.env.TEST_E2E,
  unit = process.env.TEST_UNIT;

export default {
  preset: unit ? undefined : "jest-puppeteer",
  testMatch: [`**/tests/${e2e ? "e2e" : unit ? "!(e2e)" : "*"}.test.ts`],
  transform: { "^.+\\.ts?$": "ts-jest" },
  collectCoverage: !Boolean(e2e),
  coverageDirectory: "<rootDir>/tests/coverage",
  collectCoverageFrom: ["src/*.ts"],
};
